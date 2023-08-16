"use client"

import { ReactNode, createContext, useContext, useState } from "react"
import { create } from "zustand"
import {
  Edge,
  Node,
  NodeChange,
  OnNodesChange,
  applyNodeChanges,
} from "reactflow"
import { StreamContextProps } from "../types/types"
import sanitise from "../../utils/sanitise"

// Zustand Node State Management

type RFState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  updateNodeTitle: (nodeId: string, text: string) => void
  updateNodeDescription: (nodeId: string, text: string) => void
  updateNodeChecked: (
    nodeId: string,
    allChildren: string[],
    parent: string,
    done: boolean
  ) => void
  removeNode: (nodeId: string) => void
  addTaskNode: () => void
  addIssueNode: (nodeId: string, position: { x: number; y: number }) => void
  setProject: (project: { nodes: Node[]; edges: Edge[] }) => void
}

const strokeStyle = { stroke: "black", strokeWidth: 3 }

export const initialNodes: Node[] = [
  {
    id: "Title",
    type: "titleNode",
    position: { x: 0, y: 0 },
    data: null,
  },
]

export const initialEdges: Edge[] = []

export const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },
  updateNodeTitle: (nodeId: string, text: string) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          node.data = { ...node.data, title: text }
        }

        return node
      }),
    })
  },
  updateNodeDescription: (nodeId: string, text: string) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          node.data = { ...node.data, description: text }
        }
        return node
      }),
    })
  },
  updateNodeChecked: (
    nodeId: string,
    children: string[],
    parent: string,
    newDone: boolean
  ) => {
    const updatedNodes = get().nodes.map(node => {
      // update checked node and all associated children if it is a TaskNode
      if (
        node.id === nodeId ||
        (parent === "Title" && children.includes(node.id))
      ) {
        node.data = { ...node.data, done: newDone }
      }
      return node
    })
    // if checked node is an IssueNode, find its associated TaskNode and update it
    if (parent !== "Title") {
      const updatedParent = updatedNodes.find(node => node.id === parent)
      if (updatedParent && updatedParent.data.children.length > 0) {
        const areAllSiblingsDone = updatedParent.data.children.every(childId => {
          const childNode = updatedNodes.find(node => node.id === childId)
          return childNode?.data.done
        })
        updatedParent.data = { ...updatedParent.data, done: areAllSiblingsDone }
      }
    }
    // set entire state
    set({ nodes: updatedNodes })
  },
  removeNode: (nodeId: string) => {
    set({ nodes: get().nodes.filter(node => node.id !== nodeId) })
  },
  addTaskNode: () => {
    const timestamp = new Date().getUTCMilliseconds().toString()
    set(state => ({
      nodes: [
        ...state.nodes,
        {
          id: timestamp,
          type: "taskNode",
          position: { x: 100, y: 400 },
          data: {
            title: "Title",
            description: "Description",
            done: false,
          },
        },
      ],
      edges: [
        ...state.edges,
        {
          id: timestamp,
          source: "Title",
          target: timestamp,
          style: strokeStyle,
        },
      ],
    }))
  },
  addIssueNode: (nodeId: string, position: { x: number; y: number }) => {
    const timestamp = new Date().getUTCMilliseconds().toString()
    set(state => ({
      nodes: [
        ...state.nodes,
        {
          id: timestamp,
          type: "issueNode",
          position: { x: position.x, y: position.y + 400 },
          data: {
            title: "Title",
            description: "Description",
            done: false,
          },
        },
      ],
      edges: [
        ...state.edges,
        {
          id: timestamp,
          source: nodeId,
          target: timestamp,
          style: strokeStyle,
        },
      ],
    }))
  },
  setProject: (project: { nodes: Node[]; edges: Edge[] }) => {
    set(() => ({ nodes: project.nodes, edges: project.edges }))
  },
}))

// Context for API call data stream.

const StreamContext = createContext<StreamContextProps | undefined>(undefined)

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projectInput, setProjectInput] = useState("")
  const [error, setError] = useState("")
  const [stream, setStream] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCleared, setIsCleared] = useState<boolean>(true)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const time = 1000

    if (!isCleared) {
      setError("Need to clear project first")
      setTimeout(() => setError(""), time)
      return
    }

    const prompt = projectInput

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (response.status === 400) {
      setError(response.statusText)
      setTimeout(() => setError(""), time)
      return
    }

    if (response.status === 404) {
      setError("404 Not Found")
      setTimeout(() => setError(""), time)
      return
    }
    if (response.status === 500) {
      setError("API Key Depracated, contact developers.")
      setTimeout(() => setError(""), time)
      return
    }
    if (response.status !== 200) {
      const data = await response.json()
      setError(data.statusText)
      setTimeout(() => setError(""), time)
    }

    const data = response.body

    if (!data) {
      return
    }
    setIsCleared(false)
    setIsLoading(true)

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    const streamedData: string[] = []

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setStream(prev => prev + chunkValue)
      streamedData.push(chunkValue)
    }

    const finalData = streamedData.join("")

    const sanitisedData = sanitise(finalData)

    if (sanitisedData === "not valid object") {
      setError("OpenAI returned invalid JSON \n Try re-sending request.")
      setTimeout(() => setError(""), time + 1500)
      setIsLoading(false)
      return
    }

    setStream("")
    setIsLoading(false)
  }

  return (
    <StreamContext.Provider
      value={{
        projectInput,
        setProjectInput,
        error,
        setError,
        stream,
        setStream,
        isLoading,
        setIsLoading,
        isCleared,
        setIsCleared,
        onSubmit,
      }}
    >
      {children}
    </StreamContext.Provider>
  )
}

export const useStreamContext = () => {
  const context = useContext(StreamContext)
  if (context === undefined) {
    throw new Error("Context is undefined")
  }
  return context
}

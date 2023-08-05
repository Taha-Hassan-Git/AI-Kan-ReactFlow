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
  updateNodeChecked: (nodeId: string) => void
}

const initialNodes: Node[] = [
  {
    id: "Title",
    type: "titleNode",
    position: { x: 0, y: 0 },
    data: null,
  },
  {
    id: "Task-1",
    type: "taskNode",
    position: { x: 12, y: 400 },
    data: { title: "Title", description: "description", done: false },
  },
  {
    id: "Issue-1",
    type: "issueNode",
    position: { x: 12, y: 800 },
    data: { title: "Title", description: "description", done: false },
  },
]

const initialEdges: Edge[] = [
  {
    id: "edges-Title-Task1",
    source: "Title",
    target: "Task-1",
    style: { stroke: "black", strokeWidth: 3 },
  },
  {
    id: "edges-Task1-Issue1",
    source: "Task-1",
    target: "Issue-1",
    style: { stroke: "black", strokeWidth: 3 },
  },
]

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
          // it's important to create a new object here, to inform React Flow about the cahnges
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
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = { ...node.data, description: text }
        }

        return node
      }),
    })
  },
  updateNodeChecked: (nodeId: string) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          node.data = { ...node.data, done: !node.data.done }
        }
        return node
      }),
    })
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

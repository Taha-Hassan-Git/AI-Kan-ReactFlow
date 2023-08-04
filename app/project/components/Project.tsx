"use client"
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow"
import { useCallback } from "react"
import "reactflow/dist/style.css"
import TitleNode from "./TitleNode"
import { useStreamContext } from "../../Context/store"
import TaskNode from "./TasKNode"
import IssueNode from "./IssueNode"

const initialNodes = [
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

const initialEdges = [
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

const nodeTypes = {
  titleNode: TitleNode,
  taskNode: TaskNode,
  issueNode: IssueNode,
}

function Project() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    connection => setEdges(eds => addEdge(connection, eds)),
    [setEdges]
  )

  const streamContext = useStreamContext()
  const stream = streamContext?.stream

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background
          color="#18c"
          gap={75}
          size={3}
          variant={BackgroundVariant.Dots}
        />
        <Panel position="top-left">
          <button>Sign Out</button>
        </Panel>
        <Panel position="top-right">
          <button>Clear Project</button>
        </Panel>
        {stream && <Panel position="bottom-center">{stream}</Panel>}
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default Project

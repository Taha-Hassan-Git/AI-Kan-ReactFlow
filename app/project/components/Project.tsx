"use client"
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import TitleNode from "./TitleNode"
import {
  initialEdges,
  initialNodes,
  useStreamContext,
} from "../../Context/store"
import TaskNode from "./TasKNode"
import IssueNode from "./IssueNode"
import { shallow } from "zustand/shallow"
import { useStore } from "../../Context/store"

const selector = state => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

const nodeTypes = {
  titleNode: TitleNode,
  taskNode: TaskNode,
  issueNode: IssueNode,
}

function Project() {
  const streamContext = useStreamContext()
  const stream = streamContext?.stream
  const { nodes, edges, onNodesChange } = useStore(selector, shallow)

  const setProject = useStore(state => state.setProject)
  const project = { nodes: initialNodes, edges: initialEdges }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
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
          <button
            onClick={() => setProject(project)}
            className="border border-black bg-gray-50 p-1.5 rounded ml-5"
          >
            Clear Project
          </button>
        </Panel>
        {stream && <Panel position="bottom-center">{stream}</Panel>}
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default Project

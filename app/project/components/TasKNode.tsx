import { card } from "../../Styles/TailwindClasses"
import { Handle, NodeProps, Position } from "reactflow"
import { useStore } from "../../Context/store"
import { NodeDataType } from "../../types/types"

const TaskNode = ({ id, data, xPos, yPos }: NodeProps<NodeDataType>) => {
  const updateNodeTitle = useStore(state => state.updateNodeTitle)
  const updateNodeDescription = useStore(state => state.updateNodeDescription)
  const updateNodeChecked = useStore(state => state.updateNodeChecked)
  const removeNode = useStore(state => state.removeNode)
  const addIssueNode = useStore(state => state.addIssueNode)
  return (
    <div
      className={`${card} ${
        !data.done ? "bg-teal-50" : "bg-slate-50 text-gray-400"
      } flex flex-col TestTaskId text-ellipsis`}
    >
      <Handle type="target" position={Position.Top} id="b" />
      <div className={`mb-2 flex items-center justify-between`}>
        <input
          type="checkbox"
          checked={data.done}
          onChange={() =>
            updateNodeChecked(id, data.children, data.parent, !data.done)
          }
          className={`TestTaskCheckbox cursor-pointer`}
        ></input>
        <button
          onClick={() => removeNode(id, data.children, data.parent)}
          type="button"
          className={`TestTaskDelete`}
        >
          ✖
        </button>
      </div>
      <input
        type="text"
        className={`mb-2 p-2 rounded border text-ellipsis overflow-hidden ${
          !data.done ? "border-black" : "border-gray-400"
        } TestTaskTitle`}
        value={data.title}
        onChange={evt => updateNodeTitle(id, evt.target.value)}
      />
      <textarea
        rows={5}
        cols={20}
        value={data.description}
        onChange={evt => updateNodeDescription(id, evt.target.value)}
        className={`mb-2 p-2 resize-none rounded border ${
          !data.done ? "border-black" : "border-gray-400"
        } TestTaskDescription`}
      ></textarea>
      <button onClick={() => addIssueNode(id, { x: xPos, y: yPos })}>+</button>
      <Handle type="source" position={Position.Bottom} id="c" />
    </div>
  )
}

export default TaskNode

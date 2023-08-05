import { Handle, Position } from "reactflow"
import { card } from "../../Styles/TailwindClasses"
import { useStore } from "../../Context/store"

const IssueNode = ({ id, data }) => {
  const updateNodeTitle = useStore(state => state.updateNodeTitle)
  const updateNodeDescription = useStore(state => state.updateNodeDescription)
  const updateNodeChecked = useStore(state => state.updateNodeChecked)
  return (
    <div
      className={`${card} ${
        !data.done ? "bg-pink-50" : "bg-pink-50 text-gray-400"
      } flex flex-col mb-4 border-none TestIssueId-j`}
    >
      <Handle type="target" position={Position.Top} id="d" />
      <div className={`mb-2 flex items-center justify-between`}>
        <input
          type="checkbox"
          checked={data.done}
          onChange={() => updateNodeChecked(id)}
          className={`TestIssueCheckbox cursor-pointer`}
        ></input>
        <button type="button" className={`TestIssueDelete`}>
          ✖
        </button>
      </div>
      <input
        type="text"
        value={data.title}
        onChange={evt => updateNodeTitle(id, evt.target.value)}
        className={`mb-2 p-2 rounded border ${
          !data.done ? "border-black" : "border-gray-400"
        } TestIssueTitle text-ellipsis overflow-hidden`}
      />
      <textarea
        rows={4}
        cols={20}
        value={data.description}
        onChange={evt => updateNodeDescription(id, evt.target.value)}
        className={`mb-2 p-2 resize-none rounded border ${
          !data.done ? "border-black" : "border-gray-400"
        } TestIssueDescription text-ellipsis overflow-scroll`}
      ></textarea>
    </div>
  )
}

export default IssueNode

import { Edge, Node } from "reactflow"
const strokeStyle = {
  stroke: "black",
  strokeWidth: 3,
}
const sanitise = (response: string) => {
  try {
    const jsonData = JSON.parse(`{${response}`)
    if (typeof jsonData !== "object" || !jsonData.tasks)
      return "not valid object"
    jsonData.id = 0
    const nodes: Node[] = [
      {
        id: "Title",
        type: "titleNode",
        position: { x: 0, y: 0 },
        data: null,
      },
    ]
    const edges: Edge[] = []
    jsonData.tasks.map((task: any, index: number) => {
      nodes.push({
        id: `Task-${index}`,
        type: "taskNode",
        position: { x: 600, y: 400 },
        data: { ...task },
      })
      edges.push({
        id: `Edge-${index}`,
        source: "Title",
        target: `Task-${index}`,
        style: strokeStyle,
      })
      if (task.issues) {
        task.issues.map((issue, index2) => {
          nodes.push({
            id: `Issue-${index}-${index2}`,
            type: "issueNode",
            position: { x: 800 + index2 * 10, y: 800 + index2 * 10 },
            data: { ...issue },
          })
          edges.push({
            id: `Edge-${index}-${index2}`,
            source: `Task-${index}`,
            target: `Issue-${index}-${index2}`,
            style: strokeStyle,
          })
        })
      }
    })
    console.log({ nodes, edges })
    return { nodes, edges }
  } catch {
    return "not valid object"
  }
}

export default sanitise

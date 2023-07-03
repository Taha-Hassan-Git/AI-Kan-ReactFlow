// import { GetStaticPaths, GetStaticProps } from "next"

import exampleData from "../../data/exampleData"
import Title from "./Title"
import Task from "./Task"
import Issue from "./Issue"

// type Params = {
//   project: string
// }

// export const getStaticPaths: GetStaticPaths<Params> = () => {
//   const paths = exampleData.map(project => ({
//     params: {
//       project: project.name.toLowerCase().replace(/\s/g, "-"),
//     },
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

// type Props = {
//   tasks: Task[]
// }

// type Task = {
//   id: number
//   title: string
//   description: string
//   timeEstimate: string
//   issues: Issue[]
//   done: boolean
// }

// type Issue = {
//   id: number
//   taskId: number
//   description: string
//   timeEstimate: string
//   done: boolean
// }

// export const getStaticProps: GetStaticProps<Props, Params> = ({ params }) => {
//   const tasks = exampleData[0].tasks
//   return {
//     props: {
//       tasks,
//     },
//   }
// }

export default function Project({}) {
  return (
    <>
      <Title />
      {exampleData[0].tasks.map(task => (
        <div key={task.id}>
          <Task
            key={task.id}
            title={task.title}
            description={task.description}
            done={task.done}
          />
          {task.issues.map((issue, index) => (
            <Issue
              key={index}
              title={issue.title}
              description={issue.description}
              done={issue.done}
            />
          ))}
        </div>
      ))}
    </>
  )
}
export interface TaskType {
  id: number
  title: string
  description: string
  issues: IssueType[]
  done: boolean
}

export interface IssueType {
  id: number
  taskId: number
  title: string
  description: string
  timeEstimate: string
  done: boolean
}

export interface ProjectType {
  id: number
  name: string
  tasks: TaskType[]
  xarrowChangeCounter: number
}

type Action =
  | { type: "EDIT_TASK_TITLE"; payload: TaskType }
  | { type: "EDIT_TASK_DESCRIPTION"; payload: TaskType }
  | { type: "EDIT_ISSUE_TITLE"; payload: IssueType }
  | { type: "EDIT_ISSUE_DESCRIPTION"; payload: IssueType }
  | { type: "EDIT_TASK_CHECKBOX"; payload: TaskType }
  | { type: "EDIT_ISSUE_CHECKBOX"; payload: IssueType }
  | { type: "DELETE_TASK"; payload: TaskType }
  | { type: "DELETE_ISSUE"; payload: IssueType }
  | { type: "NEW_PROJECT"; payload: ProjectType }
  | { type: "CLEAR_PROJECT"; payload: ProjectType }

export type DispatchType = (value: Action) => void

export type ActionTypes = {
  type: string
  payload: TaskType | IssueType | ProjectType
}

export interface StreamContextProps {
  projectInput: string
  setProjectInput: React.Dispatch<React.SetStateAction<string>>
  error: string
  setError: React.Dispatch<React.SetStateAction<string>>
  stream: string
  setStream: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isCleared: boolean
  setIsCleared: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

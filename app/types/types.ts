export interface NodeDataType {
  title: string
  description: string
  done: boolean
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

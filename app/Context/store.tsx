"use client"

import { ReactNode, createContext, useContext, useState } from "react"
import sanitise from "../../utils/sanitise"

interface StreamContextProps {
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

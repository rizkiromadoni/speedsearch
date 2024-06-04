import { useEffect, useState } from "react"

const App = () => {
  const [input, setInput] = useState<string>("")
  const [searchResults, setSearchResults] = useState<{
    results: string[]
    duration: number
  }>()

  useEffect(() => {
    const fetchData = async () => {
      if(!input) return setSearchResults(undefined)

      const response = await fetch(`/api/search?q=${input}`)
    }

    fetchData()
  }, [input])

  return (
    <div>
      <input type="text" value={input} onChange={(e) => {
        setInput(e.target.value)
      }} />
    </div>
  )
}

export default App
import { useState } from 'react'
import './App.css'
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <VideoPlayer />
    </div>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MapView from './components/MapView'
import KMZMap from './components/KMZMap'
// import daat from './constants/all districts KMZ/astore.kmz'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <KMZMap/>
    </div>
  )
}

export default App

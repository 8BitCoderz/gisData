import { useState } from 'react'
import { Box } from '@mui/material'
// import './App.css'
import MapView from './components/MapView3'
import KMZMap from './components/KMZMap'
// import daat from './constants/all districts KMZ/astore.kmz'

function App() {

  return (
    
    <div style={{ height: "calc(100vh - 32px)", width: "calc(100vw - 32px)" }}>
      <MapView />
    </div>
  )
}

export default App

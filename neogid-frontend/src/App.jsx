import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Координаты Томска
const CENTER = [56.4975, 84.9744]

// Пример POI
const POIS = [
  { id: 1, name: 'Площадь Ленина', lat:56.4975, lon:84.9744 },
  { id: 2, name: 'Университет', lat:56.5010, lon:84.9640 },
  { id: 3, name: 'Парк', lat:56.4920, lon:84.9800 }
]

// Простая жадная маршрутизация (nearest neighbour)
function buildRoute(pois) {
  if (!pois.length) return []
  const remaining = [...pois]
  const route = [remaining.shift()]
  while (remaining.length) {
    const last = route[route.length - 1]
    let bestIdx = 0
    let bestDist = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const d = Math.hypot(last.lat - remaining[i].lat, last.lon - remaining[i].lon)
      if (d < bestDist) { bestDist = d; bestIdx = i }
    }
    route.push(remaining.splice(bestIdx,1)[0])
  }
  return route
}

function App() {
  const [count, setCount] = useState(0)
  const [route] = useState(buildRoute(POIS))
  const polyline = route.map(p => [p.lat, p.lon])
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <MapContainer center={CENTER} zoom={13} style={{height: '100vh', width: '100%'}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {POIS.map(p => (
          <Marker key={p.id} position={[p.lat, p.lon]}>
            <Popup>{p.name}</Popup>
          </Marker>
        ))}
        <Polyline positions={polyline} color="blue" />
      </MapContainer>
    </>
  )
}

export default App

// src/main.jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={`/${crypto.randomUUID()}`} />} />

      <Route path="/:frontId" element={<App />} />
    </Routes>
  </BrowserRouter>
)

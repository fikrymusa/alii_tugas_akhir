import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // Import createRoot directly
import './index.css'
import App from './App.jsx'

// Call createRoot directly, as it's imported
createRoot(document.getElementById('root')).render(
  <StrictMode> {/* Note: React.StrictMode should be just StrictMode if imported */}
    <App />
  </StrictMode>,
)

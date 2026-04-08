import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { enforceAntiScrape } from './utils/security'
import App from './App.jsx'

// Initialize bot protection & anti-scrape
enforceAntiScrape();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

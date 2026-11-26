import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App'

const updateServiceWorker=registerSW({immediate:true,onNeedRefresh(){window.dispatchEvent(new Event('drummaster-update-ready'))}})
window.addEventListener('drummaster-apply-update',()=>void updateServiceWorker(true))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

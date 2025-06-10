import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './global.css'
import App from './App'
import { ThemeProvider } from './components/theme-provider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

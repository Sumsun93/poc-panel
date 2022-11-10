/**
 * Package import
 */
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

/**
 * Local import
 */
import Router from './Router'
import './index.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css' // theme
import 'primereact/resources/primereact.min.css' // core css
import 'primeicons/primeicons.css' // icons

const rootElement = document.querySelector('[data-js="root"]')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(rootElement)
root.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css' 
import App from './App.jsx' 
import 'bootstrap/dist/css/bootstrap.min.css';
// ADD THIS LINE FOR DROPDOWNS TO WORK:
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>
)

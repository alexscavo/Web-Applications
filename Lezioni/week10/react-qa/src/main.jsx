import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {CreateBrowserRouter, RouterProvider, createBrowserRouter} from "react-router-dom"

const router = createBrowserRouter([{path: ""}])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

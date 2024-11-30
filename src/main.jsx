import React from 'react'
import ReactDOM from 'react-dom/client'
import Chat from './components/Chat'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="container mx-auto p-4">
      <Chat />
    </div>
  </React.StrictMode>,
)
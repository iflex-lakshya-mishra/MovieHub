import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ToastProvider = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable={false}
      pauseOnHover
      theme="dark"
      toastStyle={{ background: 'rgba(10,10,10,0.92)', border: '1px solid rgba(255,255,255,0.10)' }}
    />
  )
}

export default ToastProvider


import React from 'react'
import { Navigate } from 'react-router-dom'
import Siderbar from './playcomponents/Siderbar'
import PlayArea from './playcomponents/PlayArea'
import './Play.css'

export default function Play() {
  // Check for token in localStorage
  const isLoggedIn = !!localStorage.getItem('token')

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />
  }

  return (
    <>
      <div className='playdiv'>
        <Siderbar />
        <PlayArea />
      </div>
    </>
  )
}

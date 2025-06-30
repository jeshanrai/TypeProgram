import React from 'react'
import Siderbar from './playcomponents/Siderbar'
import PlayArea from './playcomponents/PlayArea'
import './Play.css'

export default function Play() {
  return (
    <>
    <div className='playdiv'> 

  <Siderbar />
  <PlayArea />
    </div>
 
  </>
  )
}

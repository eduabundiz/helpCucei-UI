import React from 'react'
import db from '../../assets/dangerbulb.png'

export default function NotFound() {
  return (
    <div className='homeDiv'>
      <div className='homeLogo'>
        <img className='lightbulb' src={db}/>
        <label className='homeText'>Error 404</label>
      </div>
      <div className='homePhrase'>
        <label className='homeTextmin'>Página no encontrada</label>
      </div>
    </div>
  )
}

import React from 'react'
import helpcucei from '../../assets/helpqci.png'
import { Button } from 'react-bootstrap';
import { Link, useNavigate} from 'react-router-dom';
import lb from '../../assets/lightbulb.png'

export default function Home() {
  const navigate = useNavigate()

  

  return (
    <div className='homeDiv'>
      <div className='homeLogo'>
        <label className='homeText'>¡BIENVENIDO!</label>
      </div>
      <div className='homePhrase'>
        <label className='homeTextmin'>Encontrar respuestas nunca fué tan facil</label>
      </div>
      <div>
        <Button variant="primary" className='FormButtonIniciar' onClick={() => navigate('/blog')}>
          Ir al Blog
        </Button>
      </div>
    </div>
  )
}

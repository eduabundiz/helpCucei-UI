import React from 'react'
import helpcucei from '../../assets/helpqci.png'
import { Button, Form, Modal, Toast, ToastContainer} from 'react-bootstrap';
import { Link, useNavigate} from 'react-router-dom';
import lb from '../../assets/lightbulb.png'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className='homeDiv'>
      <div className='homeLogo'>
        <img className='lightbulb' src={lb}/>
        <label className='homeText'>HelpCUCEI</label>
      </div>
      <div className='homePhrase'>
        <label className='homeTextmin'>Encontrar respuestas nunca fué tan facil</label>
      </div>
      <div>
        <Button variant="primary" className='FormButtonIniciar' onClick={() => navigate('/login')}>
          INICIAR
        </Button>
      </div>
    </div>
  )
}

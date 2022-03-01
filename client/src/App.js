import React from 'react'
import Login from './components/Login/Login'
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Home from './components/Home/Home';
import Profile from './components/Home/Profile'
import Navigation from './components/Navigation/Navigation';
import NotFound from './components/NotFound/NotFound';

export default function App() {
  return (
    <Router>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Home/>} exact/>
        <Route path='/login' element={<Login/>} exact/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile/:user' element={<Profile/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}


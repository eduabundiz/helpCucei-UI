import React from 'react';
import Login from './components/Login/Login'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './components/Home/Home';
import Blog from './components/Home/Blog';
import CheckPosts from './components/Home/CheckPosts';
import CheckNews from './components/Home/checkNews';
import News from './components/Home/News';
import Profile from './components/Home/Profile'
import Navigation from './components/Navigation/Navigation';
import NotFound from './components/NotFound/NotFound';
import useToken from './useToken.js'

export default function App() {
  
  const { token, setToken } = useToken();
  
  if(!token) {
    return <Login setToken={setToken} />
  }
  
  return (
    <Router>
      <Navigation token={token}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/blog' element={<Blog token={token}/>}/>
        <Route path='/checkposts' element={<CheckPosts/>}/>
        <Route path='/checknews' element={<CheckNews/>}/>
        <Route path='/news' element={<News token={token}/>}/>
        <Route path='/profile' element={<Profile token={token}/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}


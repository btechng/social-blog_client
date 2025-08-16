import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Feed from './pages/Feed.jsx'
import PostDetail from './pages/PostDetail.jsx'
import Profile from './pages/Profile.jsx'
import Chat from './pages/Chat.jsx'
import { useAuth } from './context/AuthContext.jsx'

function Nav() {
  const { user, logout } = useAuth()
  return (
    <nav style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #ddd'}}>
      <Link to="/">Feed</Link>
      {user && <Link to={`/profile/${user._id}`}>My Profile</Link>}
      {user && <Link to={`/chat`}>DMs</Link>}
      <span style={{flex:1}} />
      {!user ? (<>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </>) : (<button onClick={logout}>Logout</button>)}
    </nav>
  )
}

function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div>
      <Nav />
      <div style={{maxWidth:900, margin:'0 auto', padding:16}}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  )
}

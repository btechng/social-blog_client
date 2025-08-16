import React, { useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  async function submit(e){
    e.preventDefault()
    const res = await api.post('/auth/register', { username, email, password })
    login(res.data.token, res.data.user)
    navigate('/')
  }
  return (
    <form onSubmit={submit} style={{display:'grid', gap:8}}>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Create Account</button>
    </form>
  )
}

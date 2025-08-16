import React, { useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  async function submit(e){
    e.preventDefault()
    const res = await api.post('/auth/login', { email, password })
    login(res.data.token, res.data.user)
    navigate('/')
  }
  return (
    <form onSubmit={submit} style={{display:'grid', gap:8}}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  )
}

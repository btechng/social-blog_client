import React, { useEffect, useRef, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext.jsx'
import { io } from 'socket.io-client'

export default function Chat(){
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [active, setActive] = useState(null) // userId
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_BASE || 'http://localhost:5000')
    socketRef.current.emit('join', user._id)
    return () => socketRef.current.disconnect()
  }, [user._id])

  useEffect(() => {
    if (!active) return
    const room = [user._id, active].sort().join(':')
    socketRef.current.emit('dm:join', { me: user._id, other: active })
    const handler = (msg) => {
      const a = [msg.from, msg.to].map(String)
      if (a.includes(user._id) && a.includes(active)) setMessages(prev => [...prev, msg])
    }
    socketRef.current.on('dm:new', handler)
    return () => socketRef.current.off('dm:new', handler)
  }, [active, user._id])

  async function doSearch(q){
    const res = await api.get('/users', { params: { search: q, limit: 10 } })
    setUsers(res.data.filter(u => u._id !== user._id))
  }

  useEffect(() => { const t = setTimeout(()=>doSearch(search), 300); return ()=>clearTimeout(t) }, [search])

  async function openThread(u){
    setActive(u._id)
    const res = await api.get(`/chat/${u._id}?page=1&limit=50`)
    setMessages(res.data.data)
  }

  async function send(){
    if (!text.trim() || !active) return
    const res = await api.post(`/chat/${active}`, { content: text })
    setMessages(prev => [...prev, res.data])
    setText('')
  }

  return (
    <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:12}}>
      <div style={{borderRight:'1px solid #eee', paddingRight:12}}>
        <input placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'100%', padding:8}} />
        <div>
          {users.map(u => (
            <div key={u._id} onClick={()=>openThread(u)} style={{padding:'8px 4px', cursor:'pointer', borderBottom:'1px solid #f3f3f3'}}>
              <img src={u.avatarUrl || 'https://placehold.co/24'} width="24" height="24" style={{borderRadius:12, verticalAlign:'middle'}} />{' '}
              <strong>@{u.username}</strong>
            </div>
          ))}
        </div>
      </div>
      <div>
        {!active ? <div>Select a user to chat.</div> : (
          <div style={{display:'flex', flexDirection:'column', height:'70vh'}}>
            <div style={{flex:1, overflowY:'auto', border:'1px solid #eee', padding:8}}>
              {messages.map(m => (
                <div key={m._id} style={{textAlign: String(m.from)===String(user._id) ? 'right' : 'left', margin:'4px 0'}}>
                  <span style={{display:'inline-block', padding:'6px 10px', borderRadius:12, background:'#f5f5f5'}}>{m.content}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." style={{flex:1}} />
              <button onClick={send}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

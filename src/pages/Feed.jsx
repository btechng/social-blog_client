import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext.jsx'
import PostCard from '../components/PostCard.jsx'
import PostEditor from '../components/PostEditor.jsx'
import { io } from 'socket.io-client'

export default function Feed(){
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [q, setQ] = useState('')
  const { user } = useAuth()

  async function load(p=1, query=''){
    const res = await api.get('/posts', { params: { page: p, limit: 10, q: query } })
    setPosts(res.data.data); setPage(res.data.page); setPages(res.data.pages)
  }

  useEffect(() => { load(1, '') }, [])

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:5000')
    if (user) socket.emit('join', user._id)
    return () => socket.disconnect()
  }, [user])

  function onSaved(p){ setPosts([p, ...posts]) }

  async function onEdit(p){
    const title = prompt('New title', p.title)
    const content = prompt('New content (HTML allowed)', p.content)
    if (title == null || content == null) return
    const res = await api.put('/posts/' + p._id, { title, content, imageUrl: p.imageUrl })
    setPosts(posts.map(x => x._id === p._id ? res.data : x))
  }

  async function onDelete(p){
    if (!confirm('Delete this post?')) return
    await api.delete('/posts/' + p._id)
    setPosts(posts.filter(x => x._id !== p._id))
  }

  async function onLike(p){
    const res = await api.post('/posts/' + p._id + '/like')
    setPosts(posts.map(x => x._id === p._id ? res.data : x))
  }

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(1, q), 400)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div>
      {user && <PostEditor onSaved={onSaved} />}
      <input placeholder="Search posts..." value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%', padding:8, marginBottom:12}} />
      {posts.map(p => <PostCard key={p._id} post={p} onEdit={onEdit} onDelete={onDelete} onLike={onLike} />)}
      <div className="pager">
        <button disabled={page<=1} onClick={()=>load(page-1, q)}>Prev</button>
        <span>Page {page} / {pages}</span>
        <button disabled={page>=pages} onClick={()=>load(page+1, q)}>Next</button>
      </div>
    </div>
  )
}

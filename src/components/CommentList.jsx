import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext.jsx'

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const { user } = useAuth()

  async function load(p=1) {
    const res = await api.get('/comments/post/' + postId + `?page=${p}&limit=10`)
    setComments(res.data.data)
    setPage(res.data.page); setPages(res.data.pages)
  }
  useEffect(() => { load(1) }, [postId])

  async function add() {
    if (!text.trim()) return
    const res = await api.post('/comments/post/' + postId, { content: text })
    // reload last page to include newest comment
    await load(pages)
    setText('')
  }

  return (
    <div>
      <h4>Comments</h4>
      {comments.map(c => (
        <div key={c._id} style={{borderTop:'1px solid #eee', paddingTop:8, marginTop:8}}>
          <strong>{c.author?.username}</strong>
          <div>{c.content}</div>
        </div>
      ))}
      <div className="pager" style={{marginTop:8}}>
        <button disabled={page<=1} onClick={()=>load(page-1)}>Prev</button>
        <span>Page {page} / {pages}</span>
        <button disabled={page>=pages} onClick={()=>load(page+1)}>Next</button>
      </div>
      {user && (
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment..." style={{flex:1}} />
          <button onClick={add}>Send</button>
        </div>
      )}
    </div>
  )
}

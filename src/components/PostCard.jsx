import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PostCard({ post, onEdit, onDelete, onLike }) {
  const { user } = useAuth()
  const isAuthor = user && post.author && user._id === post.author._id
  return (
    <div style={{border:'1px solid #ddd', borderRadius:8, padding:12, marginBottom:12}}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <img src={post.author?.avatarUrl || 'https://placehold.co/32'} alt="" width={32} height={32} style={{borderRadius:16}} />
        <strong>{post.author?.username}</strong>
      </div>
      <h3>{post.title}</h3>
      {post.imageUrl && <img src={post.imageUrl} style={{maxWidth:'100%', borderRadius:8}}/>}
      <div dangerouslySetInnerHTML={{__html: post.content}} />
      <div style={{display:'flex', gap:8}}>
        <button onClick={() => onLike(post)}>❤ {post.likes?.length || 0}</button>
        <Link to={`/post/${post._id}`}>Comments</Link>
        {isAuthor && <button onClick={() => onEdit(post)}>Edit</button>}
        {isAuthor && <button onClick={() => onDelete(post)}>Delete</button>}
      </div>
    </div>
  )
}

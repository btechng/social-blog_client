import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import CommentList from '../components/CommentList.jsx'
import PostCard from '../components/PostCard.jsx'

export default function PostDetail(){
  const { id } = useParams()
  const [post, setPost] = useState(null)
  async function load(){
    const res = await api.get('/posts/' + id)
    setPost(res.data)
  }
  useEffect(() => { load() }, [id])
  if (!post) return <div>Loading...</div>
  return (
    <div>
      <PostCard post={post} onEdit={()=>{}} onDelete={()=>{}} onLike={async () => {
        const res = await api.post('/posts/' + id + '/like')
        setPost(res.data)
      }} />
      <CommentList postId={id} />
    </div>
  )
}

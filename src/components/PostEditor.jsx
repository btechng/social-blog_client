import React, { useState } from 'react'
import { api } from '../api'
import ReactQuill from 'react-quill'

export default function PostEditor({ initial = null, onSaved }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  async function save() {
    setLoading(true)
    try {
      let imageUrl = initial?.imageUrl || ''
      if (image) {
        const up = await api.post('/uploads', { image })
        imageUrl = up.data.url
      }
      const payload = { title, content, imageUrl }
      if (initial?._id) {
        const res = await api.put('/posts/' + initial._id, payload)
        onSaved(res.data)
      } else {
        const res = await api.post('/posts', payload)
        onSaved(res.data)
      }
      setTitle(''); setContent(''); setImage(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{border:'1px dashed #aaa', padding:12, borderRadius:8, marginBottom:16}}>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:8}} />
      <div style={{marginTop:8}}>
        <ReactQuill theme="snow" value={content} onChange={setContent} />
      </div>
      <input type="file" accept="image/*" onChange={handleImage} style={{marginTop:8}} />
      <div><button disabled={loading} onClick={save}>{initial?._id ? 'Update' : 'Post'}</button></div>
    </div>
  )
}

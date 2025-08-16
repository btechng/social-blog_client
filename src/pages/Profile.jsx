import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext.jsx'
export default function Profile(){
  const { id } = useParams()
  const [userData, setUserData] = useState(null)
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const { user } = useAuth()
  const isOwner = user && user._id === id
  async function load(){
    const res = await api.get('/users/' + id)
    setUserData(res.data); setBio(res.data.bio || ''); setAvatar(res.data.avatarUrl || '')
  }
  useEffect(() => { load() }, [id])
  async function save(){
    const res = await api.put('/users/' + id, { bio, avatarUrl: avatar })
    setUserData(res.data)
  }
  if (!userData) return <div>Loading...</div>
  return (
    <div>
      <h2>@{userData.username}</h2>
      <img src={userData.avatarUrl || 'https://placehold.co/96'} width="96" height="96" style={{borderRadius:48}} />
      <p>{userData.bio}</p>
      {isOwner && (
        <div style={{borderTop:'1px solid #eee', marginTop:16, paddingTop:16}}>
          <h3>Edit profile</h3>
          <input placeholder="Avatar URL" value={avatar} onChange={e=>setAvatar(e.target.value)} style={{width:'100%'}} />
          <textarea placeholder="Bio" value={bio} onChange={e=>setBio(e.target.value)} style={{width:'100%', height:100}} />
          <button onClick={save}>Save</button>
        </div>
      )}
    </div>
  )
}

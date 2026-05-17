import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MediaCard from '../components/MediaCard'
import { useApp } from '../context/AppContext'

const ListsPage = () => {
  const { user, lists, createList, deleteList, removeFromList, toggleListVisibility, favorites, watchlist } = useApp()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPublic, setNewPublic] = useState(false)
  const [expandedList, setExpandedList] = useState(null)
  const [activeTab, setActiveTab] = useState('lists')

  const handleCreate = () => {
    if (!newName.trim()) return
    createList({ name: newName.trim(), description: newDesc.trim(), isPublic: newPublic })
    setNewName(''); setNewDesc(''); setNewPublic(false); setCreating(false)
  }

  if (!user) return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-xl mb-4">Login to manage your lists</p>
        <button onClick={() => navigate('/login')} className="bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-full font-semibold transition">Login</button>
      </div>
    </div>
  )

  const tabs = [
    { id: 'lists', label: `📋 My Lists (${lists.length})` },
    { id: 'favorites', label: `❤️ Favorites (${favorites.length})` },
    { id: 'watchlist', label: `🔖 Watchlist (${watchlist.length})` },
  ]

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[80px] md:pt-[88px] max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-black">My Collections</h1>
          {activeTab === 'lists' && (
            <button onClick={() => setCreating(true)}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2">
              ＋ New List
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${activeTab === t.id ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Create form */}
        {creating && (
          <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-bold mb-4">Create New List</h3>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="List name (e.g. Top Isekai Anime)"
              className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500/60 transition mb-3" />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)"
              className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500/60 transition mb-3" />
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setNewPublic(p => !p)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${newPublic ? 'bg-green-600 border-green-600 text-white' : 'bg-white/10 border-white/20 text-gray-400'}`}>
                {newPublic ? '🌐 Public' : '🔒 Private'}
              </button>
              <span className="text-xs text-gray-500">{newPublic ? 'Anyone with the link can see this' : 'Only you can see this'}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition">Create</button>
              <button onClick={() => setCreating(false)} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold transition">Cancel</button>
            </div>
          </div>
        )}

        {/* Lists tab */}
        {activeTab === 'lists' && (
          lists.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-lg font-semibold mb-2">No lists yet</p>
              <p className="text-sm">Create your first list to organize your favorite shows & movies</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lists.map(list => (
                <div key={list.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-white/5 transition"
                    onClick={() => setExpandedList(expandedList === list.id ? null : list.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-lg">{list.isPublic ? '🌐' : '🔒'}</span>
                        <h3 className="font-bold text-white truncate">{list.name}</h3>
                        <span className="text-xs text-gray-500 bg-white/8 px-2 py-0.5 rounded-full">{list.items.length} items</span>
                      </div>
                      {list.description && <p className="text-sm text-gray-400 truncate">{list.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button onClick={e => { e.stopPropagation(); toggleListVisibility(list.id) }}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition text-gray-300">
                        {list.isPublic ? 'Make Private' : 'Make Public'}
                      </button>
                      <button onClick={e => { e.stopPropagation(); if (confirm(`Delete "${list.name}"?`)) deleteList(list.id) }}
                        className="text-xs px-3 py-1 rounded-full bg-red-600/20 hover:bg-red-600/40 text-red-400 transition">
                        Delete
                      </button>
                      <span className="text-gray-400">{expandedList === list.id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedList === list.id && (
                    <div className="border-t border-white/10 p-4">
                      {list.items.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">No items yet. Add from any movie or show's detail page.</p>
                      ) : (
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                          {list.items.map((item, i) => (
                            <div key={i} className="relative shrink-0">
                              <MediaCard item={item} showActions={false} />
                              <button onClick={() => removeFromList(list.id, item)}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-xs flex items-center justify-center text-white hover:bg-red-500 transition shadow-lg">
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* Favorites tab */}
        {activeTab === 'favorites' && (
          favorites.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🤍</p>
              <p className="text-lg font-semibold mb-2">No favorites yet</p>
              <p className="text-sm">Tap the heart on any movie or show to save it here</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {favorites.map((item, i) => <MediaCard key={i} item={item} />)}
            </div>
          )
        )}

        {/* Watchlist tab */}
        {activeTab === 'watchlist' && (
          watchlist.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🔖</p>
              <p className="text-lg font-semibold mb-2">Watchlist is empty</p>
              <p className="text-sm">Add shows you want to watch later using the + button</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {watchlist.map((item, i) => <MediaCard key={i} item={item} />)}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ListsPage

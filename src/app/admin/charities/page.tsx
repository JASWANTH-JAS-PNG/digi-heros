'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Charity { id: string; name: string; description: string; image_url: string; website_url: string; is_featured: boolean; is_active: boolean }

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [form, setForm] = useState({ name: '', description: '', image_url: '', website_url: '', is_featured: false })
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false })
    setCharities(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (editing) {
      await supabase.from('charities').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing)
      setEditing(null)
    } else {
      await supabase.from('charities').insert(form)
    }
    setForm({ name: '', description: '', image_url: '', website_url: '', is_featured: false })
    setShowForm(false)
    await load()
    setLoading(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('charities').update({ is_active: !current }).eq('id', id)
    load()
  }

  async function deleteCharity(id: string) {
    if (!confirm('Delete this charity?')) return
    await supabase.from('charities').delete().eq('id', id)
    load()
  }

  function startEdit(c: Charity) {
    setEditing(c.id)
    setForm({ name: c.name, description: c.description, image_url: c.image_url, website_url: c.website_url, is_featured: c.is_featured })
    setShowForm(true)
  }

  const F = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Charities</h1>
          <p className="text-zinc-400 mt-1">{charities.length} charities registered</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name:'',description:'',image_url:'',website_url:'',is_featured:false }) }}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          {showForm ? 'Cancel' : '+ Add Charity'}
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-white mb-4">{editing ? 'Edit Charity' : 'New Charity'}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Name *</label>
              <input required value={form.name} onChange={e => F('name', e.target.value)} placeholder="Charity Name"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Website URL</label>
              <input value={form.website_url} onChange={e => F('website_url', e.target.value)} placeholder="https://..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Image URL</label>
              <input value={form.image_url} onChange={e => F('image_url', e.target.value)} placeholder="https://..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => F('is_featured', e.target.checked)}
                className="w-4 h-4 accent-green-500" />
              <label htmlFor="featured" className="text-sm text-zinc-300">Featured charity</label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-zinc-400 block mb-1">Description</label>
              <textarea value={form.description} onChange={e => F('description', e.target.value)} rows={3} placeholder="Describe the charity..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors resize-none" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={loading}
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                {loading ? 'Saving…' : editing ? 'Update Charity' : 'Add Charity'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {charities.map(c => (
          <div key={c.id} className={`bg-zinc-900 border rounded-2xl overflow-hidden ${c.is_active ? 'border-zinc-800' : 'border-zinc-800 opacity-60'}`}>
            {c.image_url && <img src={c.image_url} alt={c.name} className="w-full h-32 object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {c.is_featured && <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">⭐ Featured</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-500/10 text-green-400' : 'bg-zinc-700 text-zinc-500'}`}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="font-bold text-white mb-1">{c.name}</h3>
              <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{c.description}</p>
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                <button onClick={() => toggleActive(c.id, c.is_active)} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                  {c.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteCharity(c.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

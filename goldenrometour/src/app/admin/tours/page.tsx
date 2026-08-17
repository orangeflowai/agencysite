'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateTour } from '@/app/actions/tourActions'
import Button from '@/components/ui/Button'

type Row = {
  id: string
  slug: string
  title: string
  price: number
  duration: string
  badge: string
  image_url: string
  description: string
  highlights: string[]
  includes: string[]
  excludes: string[]
  important_info: string[]
}

function Editable({ value, label, multiline }: { value: string; label: string; multiline?: boolean }) {
  const name = label.toLowerCase().replace(/[^a-z]/g, '_')
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {multiline
        ? <textarea name={name} defaultValue={value} rows={6} className="w-full bg-background border border-border rounded-lg p-2 text-sm" />
        : <input name={name} defaultValue={value} className="w-full bg-background border border-border rounded-lg p-2 text-sm" />}
    </div>
  )
}

export default function AdminToursPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/tours')
      .then((r) => r.json())
      .then((d) => setRows(d.tours || []))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, slug: string) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('slug', slug)
    const res = await updateTour(fd)
    setMsg(res.success ? 'Saved' : res.error || 'Error')
    router.refresh()
  }

  if (loading) return <div className="p-8 text-muted-foreground">Loading tours…</div>

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Tours</h1>
      {msg && <p className="text-sm text-primary">{msg}</p>}
      {rows.map((t) => (
        <form key={t.id} onSubmit={(e) => onSubmit(e, t.slug)} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">{t.title}</h2>
          <Editable value={t.title} label="title" />
          <div className="grid grid-cols-2 gap-4">
            <Editable value={String(t.price)} label="price" />
            <Editable value={t.duration || ''} label="duration" />
          </div>
          <Editable value={t.badge || ''} label="badge" />
          <Editable value={t.image_url || ''} label="image_url" />
          <Editable value={t.description || ''} label="description" multiline />
          <Editable value={(t.highlights || []).join('\n')} label="highlights" multiline />
          <Editable value={(t.includes || []).join('\n')} label="includes" multiline />
          <Editable value={(t.excludes || []).join('\n')} label="excludes" multiline />
          <Editable value={(t.important_info || []).join('\n')} label="important_info" multiline />
          <Button type="submit" variant="primary">Save</Button>
        </form>
      ))}
    </div>
  )
}

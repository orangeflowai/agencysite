'use client'

import { useEffect, useState } from 'react'

type Booking = {
  id: string
  tour_title: string
  date: string
  time: string
  lead_first_name: string
  lead_last_name: string
  lead_email: string
  lead_phone: string | null
  guests: number
  total_amount: number
  currency: string
  status: string
  created_at: string
  card_brand: string | null
  card_last4: string | null
  stripe_status: string | null
}

const fmt = (d: string) => (d ? new Date(d).toLocaleDateString('en-GB') : '—')

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const load = () => {
    fetch('/api/admin/bookings')
      .then((r) => r.json())
      .then((d) => { if (d.error) setError(d.error); else setBookings(d.bookings || []) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const cancel = async (id: string) => {
    if (!confirm('Cancel this booking? This refunds the customer and releases the slots.')) return
    setBusy(id)
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const d = await res.json()
    setBusy(null)
    if (d.error) setError(d.error)
    load()
  }

  if (loading) return <div className="p-8 text-muted-foreground">Loading bookings…</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <span className="text-sm text-muted-foreground">{bookings.length} total</span>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Tour</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Guests</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Card</th>
                <th className="p-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="p-3 whitespace-nowrap">{fmt(b.date)} {b.time}</td>
                  <td className="p-3">{b.tour_title}</td>
                  <td className="p-3">
                    <p className="font-medium">{`${b.lead_first_name || ''} ${b.lead_last_name || ''}`.trim() || '—'}</p>
                    <p className="text-muted-foreground">{b.lead_email}</p>
                    {b.lead_phone && <p className="text-muted-foreground">{b.lead_phone}</p>}
                  </td>
                  <td className="p-3">{b.guests}</td>
                  <td className="p-3">€{b.total_amount}</td>
                  <td className="p-3">
                    <span className={b.status === 'cancelled' ? 'text-destructive font-medium' : 'text-green-600 font-medium'}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {b.card_brand ? `${b.card_brand} •••• ${b.card_last4}` : '—'}
                  </td>
                  <td className="p-3">
                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => cancel(b.id)}
                        disabled={busy === b.id}
                        className="text-destructive text-sm font-medium hover:underline disabled:opacity-50"
                      >
                        {busy === b.id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

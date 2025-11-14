import { useEffect, useMemo, useState } from 'react'

function App() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showBooking, setShowBooking] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)

  const [bookingForm, setBookingForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    travel_date: '',
    guests: 1,
    notes: '',
  })

  const [inquiryForm, setInquiryForm] = useState({
    full_name: '',
    email: '',
    message: '',
  })

  const fetchTours = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/tours`)
      if (!res.ok) throw new Error('Gagal memuat data tour')
      const data = await res.json()
      setTours(data)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  }, [])

  const openBooking = (tour) => {
    setSelectedTour(tour)
    setShowBooking(true)
  }

  const closeBooking = () => {
    setShowBooking(false)
    setSelectedTour(null)
    setBookingForm({ full_name: '', email: '', phone: '', travel_date: '', guests: 1, notes: '' })
  }

  const submitBooking = async (e) => {
    e.preventDefault()
    if (!selectedTour) return
    try {
      const payload = { ...bookingForm, tour_id: selectedTour._id || selectedTour.id || selectedTour.title }
      const res = await fetch(`${baseUrl}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Booking gagal')
      alert(`Booking berhasil! ID: ${data.booking_id || 'Terkirim'}`)
      closeBooking()
    } catch (err) {
      alert(err.message)
    }
  }

  const submitInquiry = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${baseUrl}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal mengirim pesan')
      alert('Pertanyaan terkirim. Kami akan menghubungi Anda segera!')
      setInquiryForm({ full_name: '', email: '', message: '' })
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-sky-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-sky-500 text-white grid place-items-center font-bold">T</div>
            <span className="font-extrabold text-xl">Tourify</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#tours" className="hover:text-sky-600">Paket Tour</a>
            <a href="#why" className="hover:text-sky-600">Kenapa Kami</a>
            <a href="#contact" className="hover:text-sky-600">Kontak</a>
            <a href="/test" className="px-3 py-1.5 rounded-md bg-sky-600 text-white hover:bg-sky-700">Tes Koneksi</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-16 grid md:grid-cols-2 items-center gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Jelajahi Dunia Dengan Pelayanan Tour Terbaik
          </h1>
          <p className="mt-4 text-gray-600">
            Kami menyediakan paket liburan yang dirancang dengan sepenuh hati. Nikmati pengalaman tak terlupakan
            dengan harga bersahabat dan layanan profesional.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#tours" className="px-4 py-2.5 rounded-md bg-sky-600 text-white hover:bg-sky-700">Lihat Paket</a>
            <a href="#contact" className="px-4 py-2.5 rounded-md border border-sky-200 hover:border-sky-400 hover:text-sky-700">Hubungi Kami</a>
          </div>
          <p className="mt-3 text-xs text-gray-500">Backend: {baseUrl}</p>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop" className="rounded-xl shadow-lg" alt="Hero" />
          <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-md hidden md:block">
            <p className="font-semibold">Diskon Musim Ini</p>
            <p className="text-sky-600 font-bold text-xl">Hingga 20%</p>
          </div>
        </div>
      </section>

      {/* Tours */}
      <section id="tours" className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Paket Tour Populer</h2>
            <p className="text-gray-600">Pilih paket yang cocok untuk liburan Anda</p>
          </div>
          <button onClick={fetchTours} className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50">Muat Ulang</button>
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-500">Memuat paket tour...</div>
        )}
        {error && (
          <div className="text-center py-10 text-red-600">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100 flex flex-col">
                <div className="h-44 bg-gray-100 overflow-hidden">
                  <img src={tour.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'} alt={tour.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg">{tour.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{tour.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-sky-50 text-sky-700 rounded">{tour.duration_days} hari</span>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{tour.location}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Mulai dari</p>
                      <p className="text-xl font-extrabold text-sky-700">${tour.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => openBooking(tour)} className="px-3 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">Pesan</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Us */}
      <section id="why" className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Harga Transparan', desc: 'Tanpa biaya tersembunyi, jelas sejak awal.' },
            { title: 'Pemandu Berpengalaman', desc: 'Tim profesional siap menemani perjalanan Anda.' },
            { title: 'Dukungan 24/7', desc: 'Bantuan kapan pun Anda butuhkan selama perjalanan.' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <p className="font-bold text-lg">{item.title}</p>
              <p className="text-gray-600 mt-1 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Inquiry */}
      <section id="contact" className="bg-sky-50 border-t border-sky-100">
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold">Ada pertanyaan? Hubungi kami</h3>
            <p className="text-gray-600 mt-2">Kirim pesan, kami akan membalas secepatnya.</p>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>Email: hello@tourify.co</li>
              <li>Telepon: +62 812-0000-0000</li>
              <li>Jam Operasional: 09.00 - 18.00 WIB</li>
            </ul>
          </div>
          <form onSubmit={submitInquiry} className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Nama Lengkap</label>
                <input required value={inquiryForm.full_name} onChange={e => setInquiryForm(v => ({...v, full_name: e.target.value}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input required type="email" value={inquiryForm.email} onChange={e => setInquiryForm(v => ({...v, email: e.target.value}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm">Pesan</label>
                <textarea required rows={4} value={inquiryForm.message} onChange={e => setInquiryForm(v => ({...v, message: e.target.value}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
              </div>
            </div>
            <button className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-md">Kirim</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} Tourify. Semua hak cipta dilindungi.</footer>

      {/* Booking Modal */}
      {showBooking && selectedTour && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center p-4" onClick={closeBooking}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <p className="font-bold">Pesan: {selectedTour.title}</p>
              <button onClick={closeBooking} className="text-gray-500 hover:text-gray-700">Tutup</button>
            </div>
            <form onSubmit={submitBooking} className="p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Nama Lengkap</label>
                  <input required value={bookingForm.full_name} onChange={e => setBookingForm(v => ({...v, full_name: e.target.value}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
                <div>
                  <label className="text-sm">Email</label>
                  <input required type="email" value={bookingForm.email} onChange={e => setBookingForm(v => ({...v, email: e.target.value}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
                <div>
                  <label className="text-sm">Telepon</label>
                  <input value={bookingForm.phone} onChange={e => setBookingForm(v => ({...v, phone: e.target.value}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
                <div>
                  <label className="text-sm">Tanggal Perjalanan</label>
                  <input required type="date" value={bookingForm.travel_date} onChange={e => setBookingForm(v => ({...v, travel_date: e.target.value}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
                <div>
                  <label className="text-sm">Jumlah Tamu</label>
                  <input required type="number" min={1} max={20} value={bookingForm.guests} onChange={e => setBookingForm(v => ({...v, guests: Number(e.target.value)}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm">Catatan</label>
                  <textarea rows={3} value={bookingForm.notes} onChange={e => setBookingForm(v => ({...v, notes: e.target.value}))} className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
              </div>
              <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-md">Kirim Pemesanan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

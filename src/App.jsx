import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import './App.css'

// Premium Color JSON Syntax Highlighter
const SyntaxHighlight = ({ data }) => {
  if (!data) return null;
  const json = JSON.stringify(data, null, 2);
  const highlighted = json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );

  return <pre className="json-viewer" dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

// Helper function to extract breed from Dog CEO URL
const getBreedFromUrl = (url) => {
  if (!url) return '';
  const parts = url.split('/');
  const breedIndex = parts.indexOf('breeds') + 1;
  const breedRaw = parts[breedIndex] || '';
  return breedRaw.replace('-', ' ');
}

// Pages
const DogPage = () => {
  const [dog, setDog] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDog = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await res.json()
      setDog(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDog() }, [])

  return (
    <div className="page-entry" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header">
        <h1 className="page-title">Breed Explorer</h1>
        <p className="page-desc">Uncovering the canine kingdom through high-resolution imagery and taxonomic data.</p>
      </header>
      <div className="glass-panel tester-card">
        <div className="display-area">
          {loading ? <div className="loading-spinner"></div> : dog && (
            <div style={{ width: '100%', position: 'relative' }}>
              <img src={dog.message} alt="Random Dog" className="dog-hero" />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                <div className="breed-badge">{getBreedFromUrl(dog.message)}</div>
              </div>
            </div>
          )}
        </div>
        <button onClick={fetchDog} disabled={loading}>
          {loading ? 'Processing...' : '🚀 Fetch New Species'}
        </button>
      </div>
    </div>
  )
}

const JokePage = () => {
  const [joke, setJoke] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchJoke = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://official-joke-api.appspot.com/random_joke')
      const data = await res.json()
      setJoke(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJoke() }, [])

  return (
    <div className="page-entry" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header">
        <h1 className="page-title">Comedy Hub</h1>
        <p className="page-desc">Experience neural-generated humor through our advanced joke-sync API integration.</p>
      </header>
      <div className="glass-panel tester-card">
        <div className="display-area" style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
          {loading ? <div className="loading-spinner"></div> : joke && (
            <div className="joke-card-content">
              <p className="joke-setup-text">“{joke.setup}”</p>
              <p className="joke-punch-text">{joke.punchline}</p>
            </div>
          )}
        </div>
        <button onClick={fetchJoke} disabled={loading} style={{ background: '#7c3aed' }}>
          {loading ? 'Buffering...' : '🎭 Laugh Again'}
        </button>
      </div>
    </div>
  )
}

const UserPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://randomuser.me/api/')
      const data = await res.json()
      setUser(data.results[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUser() }, [])

  return (
    <div className="page-entry" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <header className="page-header">
        <h1 className="page-title">Digital Personas</h1>
        <p className="page-desc">Synthesized identity validation engine utilizing random entropy for profile generation.</p>
      </header>
      <div className="glass-panel tester-card">
        <div className="display-area" style={{ padding: '3rem' }}>
          {loading ? <div className="loading-spinner"></div> : user && (
            <div className="user-profile">
              <img src={user.picture.large} alt="User Avatar" className="user-img-large" />
              <div className="user-data-grid">
                <div className="user-data-item">
                  <span className="data-label">Full Name</span>
                  <span className="data-value">{user.name.first} {user.name.last}</span>
                </div>
                <div className="user-data-item">
                  <span className="data-label">Identity Status</span>
                  <span className="data-value">Verified ✓</span>
                </div>
                <div className="user-data-item">
                  <span className="data-label">Electronic Mail</span>
                  <span className="data-value">{user.email}</span>
                </div>
                <div className="user-data-item">
                  <span className="data-label">Geolocation</span>
                  <span className="data-value">{user.location.city}, {user.location.country} 🚩</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <button onClick={fetchUser} disabled={loading} style={{ background: '#059669' }}>
          {loading ? 'Synthesizing...' : '👤 Generate New Identity'}
        </button>
      </div>
    </div>
  )
}

const JSONPlaceholderPage = () => {
  const [resource, setResource] = useState('posts')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchResource = async (type) => {
    setLoading(true)
    setResource(type)
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${type}?_limit=6`)
      const json = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResource('posts') }, [])

  return (
    <div className="page-entry">
      <header className="page-header">
        <h1 className="page-title">Data Architect</h1>
        <p className="page-desc">Low-latency REST testing against JSONPlaceholder architecture endpoints.</p>
      </header>
      <div className="glass-panel tester-card">
        <div style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['posts', 'comments', 'albums', 'photos'].map(type => (
            <button 
              key={type} 
              className={resource === type ? 'btn-active' : ''}
              onClick={() => fetchResource(type)}
              disabled={loading}
              style={{ background: resource === type ? 'var(--primary-neon)' : 'rgba(255,255,255,0.05)', flex: '1', minWidth: '120px' }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="display-area" style={{ background: '#010409' }}>
          {loading ? <div className="loading-spinner"></div> : <SyntaxHighlight data={data} />}
        </div>
      </div>
    </div>
  )
}

const CurrencyPage = () => {
  const [codes, setCodes] = useState([])
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [amount, setAmount] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const API_KEY = '83455fc388c403415c50275b'

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`)
        const data = await res.json()
        setCodes(data.supported_codes || [])
      } catch (err) {
        console.error("Failed to fetch currency codes", err)
      }
    }
    fetchCodes()
  }, [])

  const convert = async () => {
    if (!amount || amount <= 0) return
    setLoading(true)
    try {
      const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error("Conversion failed", err)
    } finally {
      setLoading(false)
    }
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  useEffect(() => {
    convert()
  }, [from, to])

  return (
    <div className="page-entry">
      <header className="page-header">
        <h1 className="page-title">Currency Nexus</h1>
        <p className="page-desc">High-precision monetary exchange engine utilizing real-time fiscal data streams.</p>
      </header>

      <div className="glass-panel tester-card">
        <div className="exchange-container">
          <div className="exchange-controls">
            <div className="exchange-input-group">
              <label className="exchange-label">Source Asset</label>
              <select className="currency-select" value={from} onChange={(e) => setFrom(e.target.value)}>
                {codes.map(([code, name]) => (
                  <option key={code} value={code}>{code} - {name}</option>
                ))}
              </select>
            </div>

            <button className="swap-btn" onClick={swap} title="Swap Currencies">
              ⇄
            </button>

            <div className="exchange-input-group">
              <label className="exchange-label">Target Asset</label>
              <select className="currency-select" value={to} onChange={(e) => setTo(e.target.value)}>
                {codes.map(([code, name]) => (
                  <option key={code} value={code}>{code} - {name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="amount-group">
            <label className="exchange-label">Amount</label>
            <input 
              type="number" 
              className="amount-input" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
            />
          </div>

          <button onClick={convert} disabled={loading} style={{ width: '100%', padding: '1.2rem' }}>
            {loading ? 'Recalculating...' : '💎 Execute Exchange'}
          </button>

          {result && !loading && (
            <div className="result-card">
              <div className="result-amount">
                {result.conversion_result.toLocaleString()} <span className="currency-badge">{to}</span>
              </div>
              <div className="result-rate">
                1 {from} = {result.conversion_rate} {to}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const HomePage = () => (
  <div className="page-entry">
    <header className="page-header">
      <h1 className="page-title">NexGen API Explorer</h1>
      <p className="page-desc">An elite testing suite for modern public API services. High performance meets ultimate aesthetics.</p>
    </header>
    <div className="card-grid">
      <Link to="/dog" className="glass-panel action-card">
        <div className="action-icon">🐶</div>
        <h3>Breed Explorer</h3>
        <p>Advanced image taxonomy utilizing the Dog CEO infrastructure. Real-time breed identification from remote endpoints.</p>
        <div className="action-cta">Establish Connection →</div>
      </Link>
      <Link to="/joke" className="glass-panel action-card">
        <div className="action-icon">🎭</div>
        <h3>Comedy Hub</h3>
        <p>Neural-net laughter generation via standardized joke protocols. Featuring low-latency humor synchronization.</p>
        <div className="action-cta">Initialize Protocol →</div>
      </Link>
      <Link to="/user" className="glass-panel action-card">
        <div className="action-icon">👤</div>
        <h3>Digital Personas</h3>
        <p>Synthesizing high-fidelity random identities for data validation and persona testing. End-to-end persona synchronization.</p>
        <div className="action-cta">Request Profile →</div>
      </Link>
      <Link to="/exchange" className="glass-panel action-card">
        <div className="action-icon">💎</div>
        <h3>Currency Nexus</h3>
        <p>Real-time fiscal exchange engine. Convert between 160+ world currencies with high-precision neural synchronization.</p>
        <div className="action-cta">Initialize Exchange →</div>
      </Link>
      <Link to="/json" className="glass-panel action-card" style={{ gridColumn: 'span 1' }}>
        <div className="action-icon">🔗</div>
        <h3>Data Architect</h3>
        <p>Probing REST endpoints. Stress-test data structures across posts, comments, albums, and raw objects.</p>
        <div className="action-cta">Launch Architect →</div>
      </Link>
    </div>
  </div>
)

const Navbar = () => (
  <header className="nav-container">
    <div className="main-nav">
      <Link to="/" className="brand-link">
        <div style={{ padding: '0.4rem', background: 'var(--primary-neon)', borderRadius: '10px', boxShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
        </div>
        NEXGEN API <span className="brand-badge">BETA v2.4</span>
      </Link>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>Dashboard</NavLink>
        <NavLink to="/dog" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Canine</NavLink>
        <NavLink to="/joke" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Humor</NavLink>
        <NavLink to="/user" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Identities</NavLink>
        <NavLink to="/exchange" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Currency</NavLink>
        <NavLink to="/json" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Core Objects</NavLink>
      </nav>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success-neon)', boxShadow: '0 0 10px var(--success-neon)' }}></div>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>UPSTREAM ACTIVE</span>
      </div>
    </div>
  </header>
)

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dog" element={<DogPage />} />
            <Route path="/joke" element={<JokePage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/exchange" element={<CurrencyPage />} />
            <Route path="/json" element={<JSONPlaceholderPage />} />
          </Routes>
        </main>
        <footer style={{ padding: '3rem', textAlign: 'center', opacity: 0.4, fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          &copy; 2026 NEXGEN SYSTEMS • QUANTUM CORE ARCHITECTURE • BUILT WITH VITE & REACT 19
        </footer>
      </div>
    </Router>
  )
}

export default App

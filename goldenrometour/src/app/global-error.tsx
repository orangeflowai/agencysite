'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1>System Failure Detected</h1>
          <p>The Roman Archives encountered a critical protocol error.</p>
          <pre style={{ 
            background: '#f4f4f4', 
            padding: '10px', 
            borderRadius: '5px',
            fontSize: '12px',
            marginTop: '20px'
          }}>
            {error.message}
          </pre>
          <button
            onClick={() => reset()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Re-initialize System
          </button>
        </div>
      </body>
    </html>
  )
}

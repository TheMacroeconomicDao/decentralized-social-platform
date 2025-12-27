import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(212, 157, 50, 0.1) 0%, rgba(66, 184, 243, 0.1) 100%)'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <img
          src="/images/error-404-lg.svg"
          alt="404 Error"
          width={800}
          height={600}
          style={{ width: '100%', height: 'auto', maxWidth: '600px', margin: '0 auto' }}
        />
        <div style={{ marginTop: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#d49d32',
            marginBottom: '1rem'
          }}>
            Page Not Found
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#666',
            marginBottom: '2rem'
          }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: '#d49d32',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}


import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f9ff',
            backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              maxWidth: '800px',
              textAlign: 'center',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: 'white',
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                }}
              >
                🐋
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#1e293b',
                margin: '0 0 16px 0',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Vaquita
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '32px',
                color: '#64748b',
                margin: '0 0 40px 0',
                fontWeight: '500',
              }}
            >
              DeFi Savings Game
            </p>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '40px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  padding: '12px 20px',
                  borderRadius: '24px',
                  border: '2px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <span style={{ fontSize: '24px' }}>🌱</span>
                <span style={{ fontSize: '20px', color: '#065f46', fontWeight: '600' }}>
                  Eco-Friendly
                </span>
              </div>
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  padding: '12px 20px',
                  borderRadius: '24px',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <span style={{ fontSize: '24px' }}>💰</span>
                <span style={{ fontSize: '20px', color: '#1e40af', fontWeight: '600' }}>
                  Earn Rewards
                </span>
              </div>
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  padding: '12px 20px',
                  borderRadius: '24px',
                  border: '2px solid rgba(168, 85, 247, 0.2)',
                }}
              >
                <span style={{ fontSize: '24px' }}>🎮</span>
                <span style={{ fontSize: '20px', color: '#7c3aed', fontWeight: '600' }}>
                  Gamified
                </span>
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '32px',
                fontSize: '24px',
                fontWeight: 'bold',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              🐋 Start Your Journey
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, immutable, no-transform, max-age=300',
        },
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

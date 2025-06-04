import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
    width: 180,
    height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #13854E 0%, #1a6c42 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '20px',
                    fontFamily: 'system-ui, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '64px',
                    letterSpacing: '2px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
            >
                IPÊ
            </div>
        ),
        {
            ...size,
        }
    )
}

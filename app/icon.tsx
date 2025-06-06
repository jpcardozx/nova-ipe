import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
    width: 32,
    height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
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
                    borderRadius: '6px',
                    fontFamily: 'system-ui, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    letterSpacing: '1px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
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

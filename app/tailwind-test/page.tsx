'use client';

export default function TailwindTest() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#f7f7f7'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '2rem' }}>
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        color: '#1a6f5c',
                        marginBottom: '1rem'
                    }}>Styling Test Page</h1>

                    <p style={{
                        color: '#4b5563',
                        marginBottom: '1.5rem'
                    }}>
                        This page is using inline styles while we fix the Tailwind CSS issues.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            backgroundColor: '#fee2e2',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            color: '#b91c1c',
                            textAlign: 'center'
                        }}>Red</div>
                        <div style={{
                            backgroundColor: '#dcfce7',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            color: '#166534',
                            textAlign: 'center'
                        }}>Green</div>
                        <div style={{
                            backgroundColor: '#dbeafe',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            color: '#1e40af',
                            textAlign: 'center'
                        }}>Blue</div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button style={{
                            backgroundColor: '#1a6f5c',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '1rem'
                        }}>
                            Primary Button
                        </button>
                        <button style={{
                            backgroundColor: 'white',
                            border: '1px solid #1a6f5c',
                            color: '#1a6f5c',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                        }}>
                            Secondary Button
                        </button>
                    </div>
                </div>
            </div>

            <p style={{
                marginTop: '2rem',
                color: '#6b7280',
                fontSize: '0.875rem'
            }}>
                We're still working on fixing the Tailwind CSS configuration.
            </p>
        </div>
    );
} 
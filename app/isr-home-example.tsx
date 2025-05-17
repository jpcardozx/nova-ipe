// This page will be statically generated at build time
// but then regenerated in the background every 60 seconds if requested
export async function generateMetadata() {
    return {
        title: 'Home - Nova IPE',
        description: 'Propriedades exclusivas em Guararema com atendimento personalizado'
    };
}

export default async function HomePageISR() {
    // This data will be fetched at build time and then revalidated every 60 seconds
    const data = await fetch('https://your-api-endpoint/data', {
        next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    const jsonData = await data.json();

    return (
        <div>
            <h1>ISR Home Page</h1>
            <p>This page uses Incremental Static Regeneration</p>
            <p>Last updated at: {new Date().toLocaleString()}</p>
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
    );
}

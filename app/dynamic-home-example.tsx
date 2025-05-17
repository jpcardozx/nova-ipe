// This makes the page dynamic instead of static
export const dynamic = 'force-dynamic';

export default async function HomePage() {
    // Now this function will run on each request instead of just at build time
    const data = await fetch('https://your-api-endpoint/data', {
        // This ensures the data is fresh on each request
        cache: 'no-store'
    });

    const jsonData = await data.json();

    return (
        <div>
            <h1>Dynamic Home Page</h1>
            <p>This page is now rendered on each request</p>
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
    );
}

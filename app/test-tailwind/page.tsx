import './test-v4.css';

export default function TestTailwind() {
    return (
        <div className="p-10">
            <h1 className="text-blue-500 text-4xl mb-4">Tailwind Test Page</h1>
            <p className="text-gray-700 mb-6">This page tests if Tailwind CSS is working correctly.</p>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-200 p-4 rounded">Red Box</div>
                <div className="bg-green-200 p-4 rounded">Green Box</div>
                <div className="bg-blue-200 p-4 rounded">Blue Box</div>
            </div>
            <button className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Test Button
            </button>
        </div>
    );
} 
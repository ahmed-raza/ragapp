export default function login() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="username">
                Username
                </label>
                <input
                type="text"
                id="username"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
                </label>
                <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
                Login
            </button>
            </form>
        </div>
        </div>
    );
}

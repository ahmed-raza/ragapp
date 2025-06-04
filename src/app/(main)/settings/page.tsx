export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-gray-600">This is where you can manage your account settings.</p>
      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}


'use client';

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Bookings</p>
                    <p className="text-3xl font-bold text-emerald-900">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Revenue</p>
                    <p className="text-3xl font-bold text-emerald-900">€0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Inventory Alerts</p>
                    <p className="text-3xl font-bold text-yellow-600">0</p>
                </div>
            </div>

            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                <p>Select <strong>Inventory</strong> to manage your tour dates.</p>
            </div>
        </div>
    )
}

'use client';

export default function LeadsTable({ leads, onStatusChange, onDelete }: any) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((l: any) => (
            <tr key={l.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{l.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{l.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <select value={l.status} onChange={(e) => onStatusChange(l.id, e.target.value)} className="border rounded p-1 text-sm">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Archived">Archived</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(l.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onDelete(l.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

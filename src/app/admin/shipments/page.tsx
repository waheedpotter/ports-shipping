'use client';
import { useState, useEffect } from 'react';
import ShipmentEditor from '@/components/admin/ShipmentEditor';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);

  const fetchShipments = async () => {
    const res = await fetch('/api/admin/shipments');
    const { data } = await res.json();
    if (data) setShipments(data);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      await fetch(`/api/admin/shipments/${id}`, { method: 'DELETE' });
      fetchShipments();
    }
  };

  if (isEditing) {
    return (
      <ShipmentEditor 
        shipment={currentShipment} 
        onSave={() => { setIsEditing(false); fetchShipments(); }} 
        onCancel={() => setIsEditing(false)} 
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Shipments</h1>
        <button onClick={() => { setCurrentShipment(null); setIsEditing(true); }} className="bg-[#8B0000] text-white px-4 py-2 rounded-md hover:bg-red-900 font-medium">
          + Add Shipment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BL Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Container</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((s: any) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.blNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.containerNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.originPort} → {s.destinationPort}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => { setCurrentShipment(s); setIsEditing(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

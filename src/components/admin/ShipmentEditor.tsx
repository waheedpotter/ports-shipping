'use client';
import { useState } from 'react';

export default function ShipmentEditor({ shipment, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(shipment || {
    blNumber: '',
    containerNumber: '',
    shipper: '',
    consignee: '',
    originPort: '',
    destinationPort: '',
    status: 'Booked',
    milestones: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = shipment ? `/api/admin/shipments/${shipment.id}` : '/api/admin/shipments';
    const method = shipment ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    onSave();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{shipment ? 'Edit Shipment' : 'Add Shipment'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">BL Number</label>
            <input type="text" required value={formData.blNumber} onChange={e => setFormData({...formData, blNumber: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Container Number</label>
            <input type="text" required value={formData.containerNumber} onChange={e => setFormData({...formData, containerNumber: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Origin Port</label>
            <input type="text" required value={formData.originPort} onChange={e => setFormData({...formData, originPort: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination Port</label>
            <input type="text" required value={formData.destinationPort} onChange={e => setFormData({...formData, destinationPort: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option>Booked</option>
              <option>In Transit</option>
              <option>Arrived</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-[#8B0000] text-white rounded-md hover:bg-red-900">Save</button>
        </div>
      </form>
    </div>
  );
}

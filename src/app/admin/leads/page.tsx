'use client';
import { useState, useEffect } from 'react';
import LeadsTable from '@/components/admin/LeadsTable';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  
  const fetchLeads = async () => {
    const res = await fetch('/api/admin/leads');
    const { data } = await res.json();
    if (data) setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this lead?')) {
      await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      fetchLeads();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Leads & Inquiries</h1>
      <LeadsTable leads={leads} onStatusChange={handleStatusChange} onDelete={handleDelete} />
    </div>
  );
}

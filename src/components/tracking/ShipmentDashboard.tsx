'use client';

import React from 'react';
import { Package, Ship, MapPin, Calendar, Scale, Info } from 'lucide-react';

interface Props {
  shipment: any;
}

export default function ShipmentDashboard({ shipment }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[#8B0000] p-6 text-white flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">BL: {shipment.blNumber}</h2>
          <p className="text-white/80">Container: {shipment.containerNo}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full font-bold border border-white/30">
          Status: {shipment.status}
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-12">
        {/* Left Col - Route & Schedule */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><MapPin className="text-[#C9A84C]" /> Routing</h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6 relative">
                <div className="w-full absolute top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-300 z-0"></div>
                <div className="relative z-10 bg-gray-50 px-2 font-bold text-[#8B0000]">Origin</div>
                <Ship className="relative z-10 text-gray-400 bg-gray-50 px-2 w-10 h-10" />
                <div className="relative z-10 bg-gray-50 px-2 font-bold text-gray-900">Dest</div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="w-1/3">{shipment.origin}</span>
                <span className="w-1/3 text-right">{shipment.destination}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Calendar className="text-[#C9A84C]" /> Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500 mb-1">Estimated Departure</div>
                <div className="font-bold text-gray-900">{shipment.etd}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500 mb-1">Estimated Arrival</div>
                <div className="font-bold text-gray-900">{shipment.eta}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Details */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Info className="text-[#C9A84C]" /> Shipment Details</h3>
            <ul className="space-y-4">
              <li className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Vessel / Voyage</span>
                <span className="font-semibold text-gray-900">{shipment.vessel} / {shipment.voyage}</span>
              </li>
              <li className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Weight</span>
                <span className="font-semibold text-gray-900 flex items-center gap-2"><Scale size={16} className="text-gray-400"/> {shipment.weight}</span>
              </li>
              <li className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Packages</span>
                <span className="font-semibold text-gray-900 flex items-center gap-2"><Package size={16} className="text-gray-400"/> {shipment.packages}</span>
              </li>
              <li className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Shipper</span>
                <span className="font-semibold text-gray-900">{shipment.shipper}</span>
              </li>
              <li className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Consignee</span>
                <span className="font-semibold text-gray-900">{shipment.consignee}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

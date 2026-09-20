'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface Milestone {
  label: string;
  date: string;
  status: 'completed' | 'pending';
}

interface Props {
  milestones: Milestone[];
  currentStatus: string;
}

export default function TrackingTimeline({ milestones }: Props) {
  return (
    <div className="relative pl-6">
      <div className="absolute top-0 bottom-0 left-[27px] w-0.5 bg-gray-200"></div>
      
      <div className="space-y-8">
        {milestones.map((m, idx) => {
          const isCompleted = m.status === 'completed';
          const isCurrent = idx > 0 && milestones[idx - 1].status === 'completed' && m.status === 'pending';
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-start group"
            >
              <div className={`absolute -left-6 bg-white p-1 rounded-full z-10 ${isCompleted ? 'text-[#8B0000]' : isCurrent ? 'text-[#C9A84C]' : 'text-gray-300'}`}>
                {isCompleted ? <CheckCircle2 size={24} className="fill-current bg-white" /> : 
                 isCurrent ? <Clock size={24} className="animate-pulse" /> : 
                 <Circle size={24} />}
              </div>
              
              <div className="ml-8">
                <h4 className={`text-lg font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>{m.label}</h4>
                <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>{m.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

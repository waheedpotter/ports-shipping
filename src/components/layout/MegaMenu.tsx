'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MEGA_MENU_DATA } from '@/data/navigation';
import * as Icons from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
}

export default function MegaMenu({ isOpen, onClose, onMouseEnter }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 top-[104px] bg-black/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white border-t border-gold-200 shadow-xl z-50 overflow-hidden"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onClose}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-4 gap-8">
                {MEGA_MENU_DATA.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-sm font-bold text-crimson-800 uppercase tracking-wider border-b border-gold-200 pb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIdx) => {
                        const Icon = (Icons as any)[item.icon] || Icons.ChevronRight;
                        return (
                          <li key={itemIdx}>
                            <Link 
                              href={`/services/${item.slug}`}
                              className="group flex items-start p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                              onClick={onClose}
                            >
                              <Icon className="w-5 h-5 mt-0.5 text-gold-500 group-hover:text-crimson-800 transition-colors shrink-0" />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-crimson-800 transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

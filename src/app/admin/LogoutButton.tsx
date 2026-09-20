'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold">
      Logout
    </button>
  );
}

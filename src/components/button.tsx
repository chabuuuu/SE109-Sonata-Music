'use client'
import { useRouter } from "next/navigation";
import React from "react";

const Button = ({data}:{data:string}) => {
  const router = useRouter();
  const handleLogOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ADMIN_TOKEN');
    }

    router.push('/admin/login');
  }

  return (
    <button onClick={handleLogOut} className="bg-white text-gray-900 font-medium rounded-full px-4 py-1 hover:bg-stone-400">{data}</button>
  );
};

export default Button;

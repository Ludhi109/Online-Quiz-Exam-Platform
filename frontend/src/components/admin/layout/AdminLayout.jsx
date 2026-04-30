import { useState } from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

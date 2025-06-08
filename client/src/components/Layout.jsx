import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen px-6 py-10 bg-[#e0e0e0] text-black font-sans">
      {children}
    </div>
  );
};

export default Layout;

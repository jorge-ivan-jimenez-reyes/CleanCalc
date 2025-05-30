import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-700">CleanCalc</h1>
          <p className="text-sm text-purple-600 hidden md:block">Track your cleaning expenses</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-10">
        {children}
      </main>
      <footer className="bg-white/80 backdrop-blur-sm py-4 px-6 md:px-10 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 CleanCalc - Optimize your cleaning expenses</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
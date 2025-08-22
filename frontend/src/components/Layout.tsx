import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Check if current route is a chat-based page
  const isChatPage = location.pathname.includes('/chat-plan') || location.pathname.includes('/chat-trip');
  
  if (isChatPage) {
    // For chat pages, render without header and footer for full-screen experience
    return (
      <div className="h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // Default layout with header and footer
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

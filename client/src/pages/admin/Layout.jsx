import React from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication tokens/storage
        localStorage.removeItem('token');
        // Redirect to home page
        navigate("/");
    };

    return (
        <div className='flex flex-col h-screen'>
            {/* Header */}
            <header className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200 bg-white sticky top-0 z-10'>
                <img 
                    src={assets.logo} 
                    alt="Website Logo" 
                    className='w-32 sm:w-40 cursor-pointer hover:opacity-80 transition-opacity'
                    onClick={() => navigate("/")}
                />
                <button 
                    onClick={handleLogout} 
                    className='text-sm px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors'
                >
                    Logout
                </button>
            </header>

            {/* Main Content Area */}
            <div className='flex flex-1 overflow-hidden'>
                <Sidebar />
                <main className='flex-1 overflow-auto p-4 sm:p-6 bg-gray-50'>
                    <Outlet /> {/* This renders the nested routes */}
                </main>
            </div>
        </div>
    );
};

export default Layout;
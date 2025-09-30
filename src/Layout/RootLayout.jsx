import React from 'react';
import Navbar from '../components/Shared/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Shared/Footer';

const RootLayout = () => {
    return (
        <div>
            {/* Header */}
            <header className="w-full sticky top-0 z-50 bg-white shadow-md">
                <Navbar />
            </header>

            {/* Main Content */}
            <main >
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="w-full bg-gray-100 mt-auto">
                <Footer />
            </footer>
        </div>
    );
};

export default RootLayout;

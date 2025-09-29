import React from 'react';
import Navbar from '../components/Shared/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Shared/Footer';

const RootLayout = () => {
    return (
        <div>
        
        <header>
            <Navbar> </Navbar>
        </header>
        <main>
            <Outlet></Outlet>
        </main>

        <footer>
           <Footer> </Footer>
        </footer>
        </div>
    );
};

export default RootLayout;
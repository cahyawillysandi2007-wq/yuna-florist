import React from 'react';
import FloatingWA from './FloatingWA';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  const hideFooter =
    location.pathname.startsWith('/product/') ||
    location.pathname === '/cart';
    

  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </>
  );
}
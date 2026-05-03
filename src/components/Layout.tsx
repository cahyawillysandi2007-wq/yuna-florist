import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWA from './FloatingWA';

export default function Layout() {
  const location = useLocation();

  const hideFooter =
    location.pathname.startsWith('/product/') ||
    location.pathname === '/cart';

  const hideFloatingWA = location.pathname.startsWith('/admin');

  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      {!hideFooter && <Footer />}

      {!hideFloatingWA && <FloatingWA />}
    </>
  );
}
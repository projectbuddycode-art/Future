import React, { useEffect } from 'react';
import { Router, Route, Switch, useLocation } from 'wouter';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Systems from './pages/Systems';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminOverview from './pages/admin/AdminOverview';
import AdminPages from './pages/admin/AdminPages';
import AdminMedia from './pages/admin/AdminMedia';
import AdminProjects from './pages/admin/AdminProjects';
import AdminNavSeo from './pages/admin/AdminNavSeo';
import AdminSettings from './pages/admin/AdminSettings';

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

export default function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <AuthProvider>
      <CMSProvider>
        <div className="relative min-h-screen flex flex-col justify-between bg-[#FAF9F6] selection:bg-[#0052FF]/10 selection:text-[#0052FF]">
          
          {/* Public Navigation */}
          {!isAdminRoute && <Navigation />}

          {/* Scroll Restorer */}
          <ScrollToTop />

          {/* Main Content Pages */}
          <main className={`relative z-10 flex-grow ${isAdminRoute ? 'bg-slate-100' : ''}`}>
            <Switch>
              {/* Public Canonical Routes */}
              <Route path="/" component={Home} />
              <Route path="/services" component={Services} />
              <Route path="/systems" component={Systems} />
              <Route path="/how-it-works" component={HowItWorks} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/privacy" component={Privacy} />

              {/* Admin Private System Routes */}
              <Route path="/admin/login" component={AdminLogin} />
              <Route path="/admin" component={AdminOverview} />
              <Route path="/admin/pages" component={AdminPages} />
              <Route path="/admin/media" component={AdminMedia} />
              <Route path="/admin/projects" component={AdminProjects} />
              <Route path="/admin/navigation" component={AdminNavSeo} />
              <Route path="/admin/seo" component={AdminNavSeo} />
              <Route path="/admin/settings" component={AdminSettings} />

              {/* Fallback */}
              <Route component={Home} />
            </Switch>
          </main>

          {/* Public Footer */}
          {!isAdminRoute && <Footer />}
        </div>
      </CMSProvider>
    </AuthProvider>
  );
}

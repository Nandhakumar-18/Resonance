import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';

// Lazy load pages for optimal architecture
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Discover = lazy(() => import('./pages/Discover').then(m => ({ default: m.Discover })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));

// Generic loading fallback for suspense
const Loader = () => (
  <div className="flex items-center justify-center w-full h-screen bg-black text-gray-500 font-mono text-sm" role="status" aria-live="polite">
    Loading interface...
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <BrowserRouter>
          <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-hidden relative">
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;

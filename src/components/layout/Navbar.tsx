import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Radio, Compass, User } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useUser();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Tune In', path: '/', icon: <Radio size={18} /> },
    { name: 'Discover', path: '/discover', icon: <Compass size={18} />, disabled: !currentUser },
    { name: 'Profile', path: '/profile', icon: <User size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4" role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-md border border-gray-800 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center gap-2 text-white">
          <Radio className="text-gray-300" />
          <span className="font-light tracking-widest text-sm uppercase">Resonance</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.disabled ? (
                <span className="flex items-center gap-2 text-gray-600 cursor-not-allowed text-sm uppercase tracking-wider">
                  {link.icon}
                  {link.name}
                </span>
              ) : (
                <NavLink 
                  to={link.path}
                  className={({ isActive }) => 
                    `flex items-center gap-2 text-sm uppercase tracking-wider transition-colors hover:text-white ${isActive ? 'text-white font-medium' : 'text-gray-500'}`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-400 hover:text-white focus:outline-none"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-xl flex flex-col gap-4 z-50">
          {navLinks.map((link) => (
            link.disabled ? (
              <span key={link.name} className="flex items-center gap-3 text-gray-600 p-2 cursor-not-allowed uppercase text-sm tracking-wider">
                {link.icon}
                {link.name}
              </span>
            ) : (
              <NavLink 
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 p-2 rounded-lg uppercase text-sm tracking-wider ${isActive ? 'bg-gray-800 text-white' : 'text-gray-400'}`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            )
          ))}
        </div>
      )}
    </nav>
  );
};

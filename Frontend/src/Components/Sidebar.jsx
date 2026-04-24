import { LayoutDashboard, Users, Vote, Settings, LogOut,ChartPie, X } from 'lucide-react';
import { Link, useLocation,useNavigate } from 'react-router';
import Logocts from "../assets/logo-cts2-removebg-preview.png"
import { useState } from 'react';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`relative flex items-center gap-4 px-8 py-4 transition-all duration-300 group ${
      active 
        ? 'bg-emerald-50 text-emerald-600 font-[900]' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    {/* Barre verticale active - Effet "Onglet" de ta photo */}
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-r-md shadow-[2px_0_12px_rgba(16,185,129,0.4)]" />
    )}
    
    <Icon 
      size={20} 
      className={`transition-colors ${active ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600'}`} 
    />
    <span className="text-[11px]  font-[900] ">
      {label}
    </span>
  </Link>
);

const Sidebar = ({ isOpen, toggle, activePage }) => {
  // --- FONCTION DE DÉCONNEXION ---
  const [isLoggingOut, setIsLoggingOut] = useState(false); // État pour l'animation de sortie
    const location = useLocation();
    const navigate = useNavigate();
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Simuler un petit délai pour l'effet visuel de sécurité
    setTimeout(() => {
      // 1. Nettoyage du stockage (Token, infos user)
      localStorage.clear();
      sessionStorage.clear();
      
      // 2. Redirection vers la page de login
      navigate('/login');
    }, 1200);
  };
  
  // Liste des items pour l'admin (identifiant id pour correspondre à activePage)
  const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, to: '/admin' },
    { id: 'electeurs', label: 'Électeurs', icon: Users, to: '/electeurs' },
    { id: 'votes', label: 'Votes & Élections', icon: Vote, to: '/votes-elections' },
    { id: 'parametres', label: 'Paramètres', icon: Settings, to: '/parametres' },
    { id: 'adminresultsPage', label: 'resultats', icon: ChartPie, to: '/adminresultsPage' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={toggle} />}
      
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-50
       transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* LOGO SECTION */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
             <img className="w-9 h-9  rounded-xl flex items-center justify-center
               text-white font-black text-xs" src={Logocts} alt='logocts'/>
              <div className="leading-tight">
                <span className="block text-[10px] font-[900] uppercase text-slate-300 ">Cyber Tech</span>
                <span className="block text-base font-[900] uppercase text-emerald-500 ">Squad</span>
              </div>
            </div>
            <button className="lg:hidden text-slate-300" onClick={toggle}><X size={24} /></button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 mt-4 space-y-1">
            {adminMenuItems.map((item) => (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                to={item.to} 
                active={activePage === item.id || location.pathname === item.to}
              />
            ))}
          </nav>

          {/* DÉCONNEXION */}
           <div className="p-8 border-t border-slate-50">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-4 px-6 py-4 text-red-500 font-[900] text-[11px] 
                      hover:bg-red-50 rounded-2xl w-full transition-all active:scale-95 group"
                    >
                      <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                      Déconnexion
                    </button>
                  </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
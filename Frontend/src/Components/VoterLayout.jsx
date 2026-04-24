import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router'; // Ajout de useNavigate
import Logocts from "../assets/logo-cts2-removebg-preview.png"
import { LayoutDashboard, CheckCircle, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

const VoterLayout = ({ children, activePage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // État pour l'animation de sortie
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, to: "/voterDashboard" },
    { id: 'votes', label: 'Mes Votes', icon: CheckCircle, to: "/voterHistory" },
    { id: 'profile', label: 'Profil', icon: User, to: "/voterProfile" },
  ];

  // --- FONCTION DE DÉCONNEXION ---
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

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 transition-opacity duration-500 
    ${isLoggingOut ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Overlay de déconnexion (Cyber effect) */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center
         justify-center text-white animate-in fade-in duration-300">
          <ShieldAlert size={48} className="text-emerald-500 animate-bounce mb-4" />
          <p className="text-[10px] font-black  text-emerald-500">
            Fermeture de la session sécurisée...</p>
        </div>
      )}

      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 md:hidden" 
        onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex
         flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-9 h-9 object-contain" src={Logocts} alt='logocts'/>
            <div className="leading-none">
              <span className="block text-[10px] font-[900]  text-slate-300 ">Cyber Tech</span>
              <span className="block text-base font-[900]  text-emerald-500">Squad</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400"><X size={24}/></button>
        </div>

        <nav className="flex-1 mt-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = activePage === item.id || location.pathname === item.to;
            return (
              <Link 
                to={item.to || "#"} 
                key={item.id} 
                className={`relative flex items-center gap-4 px-8 py-4 transition-all duration-300 group ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-600 font-[900]' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-r-md
                   shadow-[2px_0_12px_rgba(16,185,129,0.4)]" />
                )}
                
                <item.icon 
                  size={20} 
                  className={`transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600'}`} 
                />
                <span className="text-[11px] font-[900] ">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bouton Déconnexion avec handleLogout */}
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
      </aside>

      {/* Main Content */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        <header className="h-24 px-6 md:px-12 flex items-center justify-between sticky
         top-0 bg-slate-50/80 backdrop-blur-md z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-3 bg-white rounded-xl
           shadow-sm border border-slate-100 text-slate-500">
            <Menu size={20}/>
          </button>
          
          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-[900] text-slate-400 ">Technologie-Sécurité-Innovation</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-[900] text-slate-800 leading-none">Marc Dupon</p>
              <p className="text-[9px] font-bold text-emerald-500 mt-1 ">Électeur</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100
             shadow-sm flex items-center justify-center font-[900] text-slate-300
              text-xs border-b-2 border-b-emerald-500/20">
              MD
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default VoterLayout;
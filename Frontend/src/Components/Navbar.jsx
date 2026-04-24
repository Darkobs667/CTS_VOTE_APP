import { Menu, Bell, Search, UserCircle,Currency } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex 
    items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Bouton Menu Burger - Visible uniquement sur Mobile */}
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600">
          <Menu size={24} />
        </button>
        
        {/* Barre de recherche - Cachée sur petit mobile */}
         <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black  text-slate-400 ">Technologie-Sécurité-Innovation</span>
          </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-emerald-500 transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900  ">Admin CTS</p>
            <p className="text-[10px] text-emerald-500 font-bold">En ligne</p>
          </div>
          <UserCircle size={32} className="text-slate-300" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
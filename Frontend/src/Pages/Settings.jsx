import React, { useState, useEffect } from 'react';
import AdminLayout from '../Components/AdminLayout';
import { User, Shield, Save, Lock, Eye, EyeOff, CheckCircle2, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '../services/api';

const SettingsSection = ({ title, description, children }) => (
  <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30">
      <h3 className="text-sm font-black text-slate-900 ">{title}</h3>
      <p className="text-[11px] text-slate-400 mt-1 font-medium">{description}</p>
    </div>
    <div className="p-6 md:p-8">{children}</div>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. État initialisé avec les données du localStorage ou vide
  const [settings, setSettings] = useState({
    nom: "",
    email: "",
    twoFA: true,
    anonymat: true,
    notifications: false,
    role: "Administrateur"
  });

  // 2. Charger les données au montage du composant
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setSettings(prev => ({
        ...prev,
        nom: userData.nom || "Admin CTS",
        email: userData.email || "admin@cts.sn",
        role: userData.role || "Administrateur"
      }));
    }
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // 3. Sauvegarde Réelle
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Appel API vers Laravel
      const response = await api.patch('/admin/profile/update', settings);
      
      if (response.status === 200) {
        // Mettre à jour le localStorage pour que le nom change partout (Header, etc.)
        const currentUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...currentUser, nom: settings.nom, email: settings.email }));
        
        alert("Profil mis à jour avec succès !");
      }
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      alert("Erreur lors de la mise à jour des paramètres.");
    } finally {
      setIsSaving(false);
    }
  };

  /* 4. Fonction de Déconnexion (Crucial pour la sécurité)
  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };
  */

  return (
    <AdminLayout activePage="parametres">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 ">Paramètres Profil</h2>
            <p className="text-slate-500 text-sm font-medium">Gérez votre identité et la sécurité de l'accès admin</p>
          </div>
         
        </div>

        {/* Section Profil */}
        <SettingsSection 
          title="Identité Numérique" 
          description="Ces informations sont utilisées pour l'audit des actions administratives."
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              <div className="w-28 h-28 rounded-[35px] bg-gradient-to-br from-slate-100
               to-slate-200 flex items-center justify-center text-slate-400 border-2 
               border-dashed border-slate-300 group-hover:border-emerald-400
                transition-all cursor-pointer overflow-hidden shadow-inner">
                 <User size={40} className="group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-0 bg-black/40 flex items-center
                  justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <Camera size={24} />
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500
               text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                <CheckCircle2 size={16} />
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400  px-2 ">Nom Complet</label>
                <input 
                  type="text" 
                  value={settings.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl text-sm 
                  font-bold p-4 focus:ring-2 focus:ring-emerald-400 transition-all text-slate-700" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400  px-2 ">Rôle Système</label>
                <div className="w-full bg-slate-100/50 border-none rounded-2xl
                 text-sm font-black p-4 text-emerald-600 flex items-center gap-2">
                  <Shield size={16} /> {settings.role}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400  px-2 ">Email Académique</label>
                <input 
                  type="email" 
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl text-sm
                   font-bold p-4 focus:ring-2 focus:ring-emerald-400 transition-all text-slate-700" 
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Section Sécurité */}
        <SettingsSection 
          title="Protection du Compte" 
          description="Modifiez votre mot de passe pour maintenir la sécurité du système."
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400  px-2 ">Nouveau mot de passe</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Laisser vide pour ne pas changer" 
                  className="w-full bg-slate-50 border-none rounded-2xl
                   text-sm font-bold p-4 pr-12 focus:ring-2 focus:ring-emerald-400" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end mt-12 mb-20">
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`btn min-h-[56px] h-14 bg-emerald-500 hover:bg-emerald-600
               text-white border-none rounded-2xl px-12 font-black shadow-xl 
               shadow-emerald-100/50 transition-all flex items-center gap-3 active:scale-95 ${isSaving ? 'opacity-70' : ''}`}
          >
            {isSaving ? <span className="loading loading-spinner"></span> : <Save size={20} />}
            {isSaving ? 'Mise à jour...' : 'Sauvegarder mon profil'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
import React, { useState, useEffect } from 'react';
import VoterLayout from "../Components/VoterLayout";
import { User, ShieldCheck, Fingerprint, Lock, Mail, CreditCard, RefreshCw } from 'lucide-react';
import api from '../services/api'; // Ton instance Axios

const VoterProfile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState(null);

  // 1. Charger les données du profil au montage
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // APPEL RÉEL :
        // const response = await api.get('/voter/profile');
        // setUserData(response.data);

        // Simulation pour test
        await new Promise(resolve => setTimeout(resolve, 1500));
        setUserData({
          nom: "Marc Dupon",
          email: "m.dupon@cts.sn",
          uid: "CTS-2026-001",
          isVerified: true,
          twoFactorEnabled: true,
          initials: "MD",
          photo: null // On pourra ajouter l'URL d'une photo ici
        });
      } catch (error) {
        console.error("Erreur de chargement du profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // 2. Fonction pour basculer la 2FA (Double Auth)
  const toggle2FA = async () => {
    try {
      setUpdating(true);
      const newStatus = !userData.twoFactorEnabled;
      
      // APPEL RÉEL :
      // await api.post('/voter/profile/toggle-2fa', { enabled: newStatus });
      
      // Mise à jour locale pour la fluidité
      setUserData({ ...userData, twoFactorEnabled: newStatus });
    } catch (error) {
      alert("Erreur lors de la mise à jour de la sécurité.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VoterLayout activePage="profile">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
            <Fingerprint className="absolute text-emerald-500 animate-pulse" size={32} />
          </div>
          <p className="mt-8 text-[10px] font-black text-slate-400 animate-pulse">
            Accès au coffre-fort numérique...
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
          {/* HEADER */}
          <div className="mb-10 md:mb-14">
            <h1 className="text-2xl md:text-4xl font-[900] text-slate-900 ">
              Mon identité électeur
            </h1>
            <p className="text-slate-400 font-bold mt-2 text-xs ">
              Données biométriques
            </p>
          </div>

          <div className="space-y-8">
            {/* CARTE IDENTITÉ CYBER */}
            <div className="bg-white rounded-[45px] border border-slate-100 p-8 md:p-12
             shadow-2xl shadow-slate-100/50 group overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                  <ShieldCheck size={120} />
               </div>
               
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="w-32 h-32 bg-slate-50 rounded-[40px] 
                flex items-center justify-center border-4 border-white shadow-2xl relative">
                  {userData.photo ? (
                    <img src={userData.photo} className="w-full h-full object-cover rounded-[35px]" alt="Profil" />
                  ) : (
                    <span className="text-4xl font-black text-slate-200">{userData.initials}</span>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-xl rotate-12">
                    <ShieldCheck size={20} strokeWidth={3} />
                  </div>
                </div>
                
                <div className="text-center md:text-left space-y-3">
                  <p className="text-[10px] font-black text-emerald-500 ">Membre Certifié CTS</p>
                  <h2 className="text-3xl font-[900] text-slate-900 ">{userData.uid}</h2>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl
                     text-[10px] font-black  border border-emerald-100">
                      {userData.isVerified ? "Vérification Complète" : "En attente"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* GRILLE D'INFORMATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Informations de base */}
              <div className="bg-white rounded-[45px] border border-slate-100 p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                  <User size={18} className="text-slate-400" />
                  <h3 className="text-[11px] font-black text-slate-900 ">Fiche electeur</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="text-[9px] font-black text-slate-300  ml-1 mb-2 block">Nom Complet</label>
                    <div className="flex items-center gap-3 p-5 bg-slate-50 rounded-[25px]
                     border border-slate-100 group-hover:bg-white group-hover:border-emerald-200 transition-all">
                      <CreditCard size={16} className="text-slate-300" />
                      <span className="font-bold text-slate-700">{userData.nom}</span>
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="text-[9px] font-black text-slate-300 ml-1 mb-2 block">Adresse Institutionnelle</label>
                    <div className="flex items-center gap-3 p-5 bg-slate-50 rounded-[25px]
                     border border-slate-100 group-hover:bg-white group-hover:border-emerald-200 transition-all">
                      <Mail size={16} className="text-slate-300" />
                      <span className="font-bold text-slate-700">{userData.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paramètres de Sécurité */}
              <div className="bg-white rounded-[45px] border border-slate-100 p-10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-8">
                    <Lock size={18} className="text-slate-400" />
                    <h3 className="text-[11px] font-black text-slate-900 ">Centre de Sécurité</h3>
                  </div>

                  {/* Toggle 2FA */}
                  <div 
                    onClick={!updating ? toggle2FA : undefined}
                    className={`group cursor-pointer p-6 rounded-[30px] border transition-all duration-300 ${
                      userData.twoFactorEnabled ? 'bg-emerald-50/50 border-emerald-100' : 
                      'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl transition-colors
                           ${userData.twoFactorEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 ">Double Authentification</p>
                          <p className={`text-[9px] font-bold mt-0.5 
                            ${userData.twoFactorEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {userData.twoFactorEnabled ? "PROTÉGÉ PAR 2FA" : "NON SÉCURISÉ"}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`w-14 h-7 rounded-full relative p-1 transition-colors duration-500 
                        ${userData.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        {updating ? (
                          <RefreshCw size={14} className="animate-spin text-white absolute right-1.5" />
                        ) : (
                          <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 
                            ${userData.twoFactorEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-8 py-5 border-2 border-dashed border-slate-100
                 rounded-[30px] text-[10px] font-black text-slate-400 
                  hover:bg-slate-900 hover:text-white hover:border-slate-900
                   transition-all flex items-center justify-center gap-3 group">
                   <Lock size={14} className="group-hover:rotate-12 transition-transform" />
                   Réinitialiser les accès
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </VoterLayout>
  );
};

export default VoterProfile;
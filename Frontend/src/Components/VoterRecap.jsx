import React, { useState } from 'react';
import VoterLayout from "../Components/VoterLayout";
import { useLocation, useNavigate } from "react-router";
import { ShieldCheck, ArrowLeft, Send, CheckCircle, User } from 'lucide-react';
import api from '../services/api'; // Ton instance axios

const VoterRecap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // RÉCUPÉRATION : On récupère l'élection et le candidat choisi
  const { election, selectedCandidate } = location.state || {};

  // Si l'utilisateur arrive ici sans avoir fait de choix (bug ou accès direct)
  if (!election || !selectedCandidate) {
    return (
      <VoterLayout activePage="dashboard">
        <div className="text-center py-20">
          <p className="text-slate-400 font-black uppercase tracking-widest">Aucune donnée de vote trouvée.</p>
          <button onClick={() => navigate('/voterDashboard')} className="mt-4 text-emerald-500 font-bold underline">Retour au tableau de bord</button>
        </div>
      </VoterLayout>
    );
  }

  const handleFinalConfirm = async () => {
    setLoading(true);
    try {
      // APPEL API RÉEL :
      // await api.post('/voter/submit-vote', {
      //   election_id: election.id,
      //   candidate_id: selectedCandidate.id
      // });

      // Simulation du délai de sécurisation (Cyber style)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      alert("Erreur lors de l'enregistrement du vote. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VoterLayout activePage="dashboard">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        
        {/* Titre Dynamique */}
        {!isSubmitted && (
          <div className="animate-in fade-in slide-in-from-top-4">
            <h1 className="text-2xl xl:text-4xl font-[900] text-slate-900 ">Récapitulatif de votre choix</h1>
            <p className="text-slate-400 font-black text-[10px]  mt-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
               Vérification finale avant signature numérique
            </p>
          </div>
        )}

        {!isSubmitted ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm space-y-8">
              <h2 className="text-xs font-black text-slate-900 
               border-b border-slate-50 pb-4">Détails du scrutin : {election.titre}</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className={`flex-1 p-8 rounded-[35px] border-2 flex gap-6 items-center transition-all
                   ${selectedCandidate.id === 'blanc' ? 'bg-slate-900 border-slate-900' :
                    'bg-emerald-50 border-emerald-100'}`}>
                   <div className="w-20 h-20 rounded-[25px] bg-white shadow-lg overflow-hidden
                    flex items-center justify-center shrink-0 border-4 border-white">
                      {selectedCandidate.photo ? (
                        <img src={selectedCandidate.photo} className="w-full h-full object-cover" alt="Candidat" />
                      ) : (
                        <User className={selectedCandidate.id === 'blanc' ? 'text-slate-200' : 'text-emerald-200'} size={32} />
                      )}
                   </div>
                   <div>
                     <p className={`text-[10px] font-black 
                       ${selectedCandidate.id === 'blanc' ? 'text-slate-400' : 
                       'text-emerald-500'}`}>Candidat Sélectionné :</p>
                     <p className={`font-[900] text-lg mt-1 
                       ${selectedCandidate.id === 'blanc' ? 'text-white' : 'text-slate-900'}`}>
                        {selectedCandidate.nom || selectedCandidate.name}
                     </p>
                     <p className={`text-[10px] font-bold mt-1 
                      ${selectedCandidate.id === 'blanc' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {selectedCandidate.profession || selectedCandidate.job || '---'}
                     </p>
                   </div>
                </div>
              </div>

              <div className="p-5 bg-amber-50 rounded-[25px] flex items-start gap-4 border border-amber-100/50">
                <span className="text-xl">🛡️</span>
                <p className="text-[11px] font-bold text-amber-700 leading-relaxed ">
                  Important : En cliquant sur confirmer, votre bulletin sera chiffré et envoyé au serveur. 
                  <span className="block font-black mt-1">Cette action est irréversible.</span>
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col md:flex-row gap-4">
               <button 
                 disabled={loading}
                 onClick={() => navigate(-1)} 
                 className="flex-1 py-5 bg-white border border-slate-100 text-slate-400 rounded-[25px]
                  font-black  text-[10px]  hover:bg-slate-50 transition-all
                   flex items-center justify-center gap-2"
               > 
                 <ArrowLeft size={16} /> Modifier le choix 
               </button>
               <button 
                 disabled={loading}
                 onClick={handleFinalConfirm}
                 className="flex-[2] py-5 bg-emerald-500 text-white rounded-[25px] font-[900] 
                  text-[10px] shadow-2xl shadow-emerald-100
                  hover:bg-emerald-600 hover:-translate-y-1 active:scale-95 transition-all 
                  flex items-center justify-center gap-3"
               >
                 {loading ? "Chiffrement en cours..." : "Confirmer le vote"}
                 {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
                  <Send size={16} />}
               </button>
            </div>
          </div>
        ) : (
          /* ÉCRAN DE SUCCÈS - Basé sur ton design */
          <div className="bg-white rounded-[50px] border border-slate-100 p-12 text-center 
          space-y-8 animate-in zoom-in duration-500 shadow-2xl shadow-emerald-50">
             <div className="w-24 h-24 bg-emerald-500 text-white rounded-[35px]
              flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 rotate-12">
                <CheckCircle size={48} strokeWidth={3} />
             </div>
             
             <div className="space-y-2">
               <h3 className="text-3xl font-[900] text-slate-900 ">Voté avec succès</h3>
               <p className="text-emerald-500 font-black  text-[10px] ">Votre voix a été enregistrée</p>
             </div>

             <div className="bg-slate-50 p-8 rounded-[35px] border border-slate-100 inline-block w-full max-w-md">
               <p className="text-[9px] font-black text-slate-400  mb-4">
                Reçu de transaction numérique
                </p>
               <div className="font-mono text-[11px] font-black text-slate-800 bg-white p-4 
               rounded-2xl border border-slate-200 break-all shadow-inner">
                  CTS-TX-{Math.random().toString(36).substring(2, 15).toUpperCase()}
               </div>
               <p className="mt-4 text-[9px] font-bold text-slate-400 ">
                Un justificatif a été envoyé à votre adresse institutionnelle.
                </p>
             </div>

             <div className="pt-4">
                <button 
                  onClick={() => navigate('/voterDashboard')}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black
                    text-[10px]  hover:bg-emerald-500 
                   transition-all shadow-xl shadow-slate-200"
                >
                  Retour au Dashboard
                </button>
             </div>
          </div>
        )}
      </div>
    </VoterLayout>
  );
};

export default VoterRecap;
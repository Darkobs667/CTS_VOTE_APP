import React, { useState, useEffect } from 'react';
import VoterLayout from "../Components/VoterLayout";
import { ShieldCheck, Download, History, Search, ExternalLink, RefreshCw } from 'lucide-react';
import api from '../services/api'; // Import de ton instance Axios

const VoterHistory = () => {
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [votes, setVotes] = useState([]);

  // 1. Fonction de récupération réelle
  const fetchHistory = async (showSync = false) => {
    try {
      if (showSync) setIsSyncing(true);
      else setLoading(true);

      // Appel à ton endpoint backend
      const response = await api.get('/voter/history');
      
      // On s'attend à recevoir un array d'objets : 
      // { id, election_title, date_voted, transaction_ref }
      setVotes(response.data);
      
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 2. Fonction pour télécharger le reçu (Génération PDF ou Image côté serveur)
  const handleDownloadReceipt = async (voteId) => {
    try {
      const response = await api.get(`/voter/receipt/${voteId}`, {
        responseType: 'blob', // Important pour le téléchargement de fichier
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Recu_Vote_${voteId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Impossible de générer le reçu pour le moment.");
    }
  };

  return (
    <VoterLayout activePage="votes">
      {loading ? (
        /* LOADER CYBER TECH SQUAD (Identique à ta vidéo) */
        <div className="flex flex-col items-center justify-center min-h-[70vh] ">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
            <ShieldCheck className="absolute text-emerald-500 animate-pulse" size={24} />
          </div>
          <p className="mt-6 text-[10px] font-[900] text-slate-400  animate-pulse text-center">
            Vérification de l'intégrité du registre...
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-4xl font-[900] text-slate-900 ">
                    Mes Participations
                  </h1>
                  {isSyncing && <RefreshCw size={16} className="animate-spin text-emerald-500" />}
                </div>
                <p className="text-slate-400 font-bold mt-1 text-xs ">
                  Preuves de vote stockées sur la plateforme sécurisée
                </p>
              </div>
              
              {/* Badge compteur dynamique */}
              <div className="flex items-center gap-4 bg-white p-5 rounded-[30px] border
               border-slate-100 shadow-xl shadow-slate-100/50">
                <div className="text-right">
                  <span className="text-3xl font-[900] text-emerald-500 leading-none">
                    {votes.length < 10 ? `0${votes.length}` : votes.length}
                  </span>
                  <p className="text-[9px] font-black text-slate-300 mt-1 uppercase">Actions</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                  <History size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
            {/* TABLE HEADER - Desktop */}
            <div className="hidden md:grid grid-cols-4 px-10 py-8 text-[10px] font-black
             text-slate-300 border-b border-slate-50 ">
              <div>Scrutin</div>
              <div>Date de signature</div>
              <div>Référence Numérique</div>
              <div className="text-right">Justificatif</div>
            </div>

            <div className="divide-y divide-slate-50">
              {votes.map((v) => (
                <div key={v.id} className="p-8 md:px-10 md:py-10 group hover:bg-emerald-50/30 transition-all duration-300">
                  <div className="flex flex-col md:grid md:grid-cols-4 gap-6 md:gap-0 md:items-center">
                    
                    {/* ÉLECTION */}
                    <div className="flex flex-col">
                      <span className="md:hidden text-[9px] font-black text-slate-300 mb-2 ">Scrutin</span>
                      <span className="font-black text-slate-900 text-base md:text-lg ">
                        {v.election_title || v.election}
                      </span>
                    </div>

                    {/* DATE */}
                    <div className="flex flex-col">
                      <span className="md:hidden text-[9px] font-black text-slate-300 mb-2 ">Date</span>
                      <span className="text-slate-400 text-xs font-bold italic">
                        {v.date_voted || v.date}
                      </span>
                    </div>

                    {/* RÉFÉRENCE ANONYME */}
                    <div className="flex flex-col">
                      <span className="md:hidden text-[9px] font-black text-slate-300 mb-2 ">ID Transaction</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-slate-900 text-[10px] px-3 py-1.5 rounded-xl
                         font-bold text-emerald-400 border border-slate-800 shadow-inner">
                          {v.transaction_ref || v.id}
                        </code>
                      </div>
                    </div>

                    {/* ACTION TELECHARGEMENT */}
                    <div className="md:text-right">
                      <button 
                        onClick={() => handleDownloadReceipt(v.id)}
                        className="w-full md:w-auto px-8 py-4 bg-white border
                         border-slate-100 text-slate-900 rounded-[20px] text-[10px]
                          font-black  hover:bg-emerald-500
                           hover:text-white hover:border-emerald-500 transition-all 
                           shadow-lg shadow-slate-100 flex items-center justify-center
                            gap-3 active:scale-95 group/btn"
                      >
                        <Download size={16} className="group-hover/btn:translate-y-0.5 transition-transform" />
                        Obtenir le reçu
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            
            {/* EMPTY STATE */}
            {votes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center
                 justify-center text-slate-200 mb-6 border border-dashed border-slate-200">
                  <History size={40} />
                </div>
                <h3 className="text-slate-900 font-black  text-xl">Aucune activité</h3>
                <p className="text-slate-400 font-bold text-[10px]  mt-2">Vous n'avez pas encore participé à un scrutin</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex items-center gap-3 justify-center text-[9px]
           font-bold text-slate-300 ">
            <ShieldCheck size={14} className="text-emerald-500" />
            Registre audité par Cyber Tech Squad
          </div>
        </div>
      )}
    </VoterLayout>
  );
};

export default VoterHistory;
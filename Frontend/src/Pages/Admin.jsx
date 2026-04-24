import React, { useState, useEffect } from 'react';
import AdminLayout from '../Components/AdminLayout';
import StatCard from '../Components/StatCard';
import { Users, Vote, CheckCircle, Clock, Loader2 } from 'lucide-react';
import api from '../services/api'; // Utilisation de l'instance API de base

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalElecteurs: 0,
    votesClotures: 0,
    votesEnCours: 0,
    participation: "0%"
  });
  const [recentElections, setRecentElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Récupération des données du Dashboard
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // On imagine que ton collègue crée un point d'entrée unique pour le dashboard
      // ou alors tu fais plusieurs appels simultanés
      const [statsRes, electionsRes] = await Promise.all([
        api.get('/admin/stats-globales'),
        api.get('/admin/elections-recentes')
      ]);

      setStats(statsRes.data);
      setRecentElections(electionsRes.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du dashboard:", error);
      // Fallback : données par défaut si l'API n'est pas prête
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Optionnel : Rafraîchir toutes les 2 minutes pour le temps réel
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête de page avec bouton rafraîchir */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 ">Tableau de bord</h2>
            <p className="text-slate-500 font-medium text-sm">Vue d'ensemble de la plateforme</p>
          </div>
          {isLoading && <Loader2 className="animate-spin text-emerald-500 mb-2" size={20} />}
        </div>

        {/* Grille de Statistiques Dynamique */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="Électeurs Inscrits" 
            value={stats.totalElecteurs.toLocaleString()} 
            icon={Users} 
            color="bg-emerald-500 shadow-lg shadow-emerald-100" 
          />
          <StatCard 
            label="Votes Clôturés" 
            value={stats.votesClotures} 
            icon={CheckCircle} 
            color="bg-blue-500 shadow-lg shadow-blue-100" 
          />
          <StatCard 
            label="Votes en Cours" 
            value={stats.votesEnCours} 
            icon={Clock} 
            color="bg-amber-500 shadow-lg shadow-amber-100" 
          />
          <StatCard 
            label="Taux de Participation" 
            value={stats.participation} 
            icon={Vote} 
            color="bg-purple-500 shadow-lg shadow-purple-100" 
          />
        </div>

        {/* Section Contenu Dynamique */}
        <div className="bg-white rounded-3xl p-4 md:p-8 border border-slate-100 shadow-sm min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black uppercase text-[10px] md:text-xs tracking-widest text-slate-900">
              Élections Récentes {recentElections.length > 0 && `(${recentElections.length})`}
            </h3>
            <button className="text-emerald-600 text-xs font-bold hover:underline">Voir tout</button>
          </div>

          {isLoading && recentElections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300  text-sm">
              Chargement des données...
            </div>
          ) : recentElections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 font-medium text-sm">
              Aucune élection enregistrée pour le moment.
            </div>
          ) : (
            <>
              {/* VERSION MOBILE */}
              <div className="space-y-4 md:hidden">
                {recentElections.map((election) => (
                  <div key={election.id} className="p-4 border border-slate-50 rounded-2xl bg-slate-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-slate-700">{election.titre}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase ${
                        election.statut === 'Actif' ? 'bg-emerald-100 text-emerald-600' :
                         'bg-slate-100 text-slate-500'
                      }`}>
                        {election.statut}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] text-slate-400 font-bold ">Fin:
                         {new Date(election.date_fin).toLocaleDateString()}</span>
                      <button className="text-emerald-500 font-black text-[11px]
                       hover:bg-emerald-50 px-3 py-1 rounded-lg transition-colors">
                        Détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* VERSION DESKTOP */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="pb-4 text-[10px] font-black  text-slate-400">Titre de l'élection</th>
                      <th className="pb-4 text-[10px] font-black  text-slate-400">Statut</th>
                      <th className="pb-4 text-[10px] font-black  text-slate-400">Date de fin</th>
                      <th className="pb-4 text-[10px] font-black  text-slate-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentElections.map((election) => (
                      <tr key={election.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-bold text-sm text-slate-700">{election.titre}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                            election.statut === 'Actif' ? 'bg-emerald-100 text-emerald-600' : 
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {election.statut}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-slate-500 font-medium">
                          {new Date(election.date_fin).toLocaleDateString('fr-FR', 
                            { day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-slate-400 hover:text-emerald-500 transition-colors font-bold text-xs">
                            Détails
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import VoterLayout from "../Components/VoterLayout";
import { useNavigate } from "react-router"; // Utilisation de navigate pour passer l'état
import StatCard from "../Components/StatCard";
import { Users, Vote, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api'; // Ton instance axios

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalElecteurs: "0",
      votesClotures: "0",
      votesEnCours: "0",
      tauxParticipation: "0%"
    },
    elections: []
  });

  // Récupération réelle des données
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // APPEL API RÉEL :
        // const response = await api.get('/voter/dashboard');
        // setDashboardData(response.data);

        // Simulation pour le test (à supprimer après connexion backend)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDashboardData({
          stats: {
            totalElecteurs: "2,543",
            votesClotures: "12",
            votesEnCours: "3",
            tauxParticipation: "87%"
          },
          elections: [
            { 
              id: 1, 
              titre: "Élection des Délégués L3", 
              date: "12 Avril 2026", 
              statut: "En Cours", 
              type: "active",
              // On simule les candidats qui viendraient du backend
              candidates: [
                { id: 101, nom: "Marie Dubois", profession: "Architecte", slogan: "L'innovation au service de tous", photo: null },
                { id: 102, nom: "Ahmed Yade", profession: "L3 Génie Logiciel", slogan: "Ensemble pour demain", photo: null }
              ]
            },
            { id: 2, titre: "Consultation Budget 2025", date: "10 Mai 2026", statut: "En Attente", type: "waiting" }
          ]
        });
      } catch (error) {
        console.error("Erreur de synchronisation :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fonction pour lancer le vote avec les données de l'élection
  const handleStartVote = (election) => {
    // On passe l'objet election complet à la page VoterChoice via le state de react-router
    navigate('/voterChoice', { state: { election } });
  };

  return (
    <VoterLayout activePage="dashboard">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
            <Vote className="absolute text-emerald-500 animate-pulse" size={24} />
          </div>
          <p className="mt-6 text-[10px] font-[900] text-slate-400  animate-pulse">
            Synchronisation du registre...
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-[900] text-slate-900 ">
              Tableau de bord électeur
            </h1>
            <p className="text-slate-400 font-medium mt-1 text-sm">
              Bienvenue dans votre espace de vote sécurisé
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Électeurs Inscrits" value={dashboardData.stats.totalElecteurs} icon={Users} color="bg-emerald-500 shadow-lg shadow-emerald-100" />
            <StatCard label="Votes Clôturés" value={dashboardData.stats.votesClotures} icon={CheckCircle} color="bg-blue-500 shadow-lg shadow-blue-100" />
            <StatCard label="Votes en Cours" value={dashboardData.stats.votesEnCours} icon={Clock} color="bg-amber-500 shadow-lg shadow-amber-100" />
            <StatCard label="Participation" value={dashboardData.stats.tauxParticipation} icon={Vote} color="bg-purple-500 shadow-lg shadow-purple-100" />
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-[900] text-slate-900 ">Scrutins disponibles</h2>
            </div>

            <div className="hidden md:grid grid-cols-4 px-8 py-5 text-[10px] font-black
             text-slate-300  border-b border-slate-50">
              <div>Poste à pourvoir</div>
              <div>Date de clôture</div>
              <div className="text-center">Statut</div>
              <div className="text-right">Action</div>
            </div>

            <div className="divide-y divide-slate-50">
              {dashboardData.elections.map((election) => (
                <div key={election.id} className="group hover:bg-slate-50/50 transition-all p-6 md:px-8 md:py-7">
                  <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:items-center">
                    <div>
                      <span className="md:hidden text-[9px] font-black text-slate-300  mb-1 block">Titre</span>
                      <span className="font-bold text-slate-800">{election.titre}</span>
                    </div>

                    <div>
                      <span className="md:hidden text-[9px] font-black text-slate-300  mb-1 block">Fin</span>
                      <span className="text-slate-400 text-xs font-bold">{election.date}</span>
                    </div>

                    <div className="flex items-center md:justify-center">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black  ${
                         election.type === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                       }`}>
                         {election.statut}
                       </span>
                    </div>

                    <div className="md:text-right">
                      {election.type === 'active' ? (
                        <button 
                          onClick={() => handleStartVote(election)} 
                          className="w-full md:w-auto px-8 py-3 bg-emerald-500 text-white rounded-xl 
                          text-[10px] font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 
                          active:scale-95 transition-all"
                        >
                          Voter Maintenant 
                        </button>
                      ) : (
                        <button className="w-full md:text-right text-slate-300 text-[10px] font-black 
                         hover:text-slate-400">
                          En attente 
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </VoterLayout>
  );
};

export default VoterDashboard;
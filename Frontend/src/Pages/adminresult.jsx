import React, { useState, useEffect } from 'react';
import AdminLayout from '../Components/AdminLayout';
import { Doughnut } from 'react-chartjs-2';
import { Timer, Users, Trophy, CheckCircle2, TrendingUp, ShieldCheck, Loader2, User } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminresultsPage = () => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [resultsData, setResultsData] = useState({
    titre: "Élection en cours",
    votersCount: 0,
    totalInscrits: 0,
    candidates: []
  });

  const fetchResults = async () => {
    try {
      // Dans ton projet réel, tu passeras peut-être l'ID de l'élection
      const response = await api.get('/admin/results/current-election');
      const { titre, time_remaining, status, voters, total_inscrits, candidates } = response.data;
      
      setTimeLeft(time_remaining);
      setIsLive(status === 'active');
      setResultsData({
        titre: titre || "Scrutin sans titre",
        votersCount: voters,
        totalInscrits: total_inscrits,
        candidates: candidates 
      });
    } catch (error) {
      console.error("Erreur résultats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // Rafraîchissement automatique toutes les 10 secondes (Polling)
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && isLive) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isLive]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? hours + ':' : ''}${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const participationRate = resultsData.totalInscrits > 0 
    ? ((resultsData.votersCount / resultsData.totalInscrits) * 100).toFixed(1) 
    : 0;

  const participationData = {
    datasets: [{
      data: [resultsData.votersCount, Math.max(0, resultsData.totalInscrits - resultsData.votersCount)],
      backgroundColor: ['#10b981', '#f1f5f9'],
      borderWidth: 0,
      cutout: '80%',
    }],
  };

  // On trie pour identifier le gagnant actuel
  const sortedCandidates = [...resultsData.candidates].sort((a, b) => b.votes - a.votes);

  return (
    <AdminLayout activePage="results">
      {loading ? (
        <div className="flex h-[70vh] flex-col items-center justify-center">
          <div className="relative">
             <Loader2 className="animate-spin text-emerald-500" size={56} />
             <TrendingUp className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-200" size={20} />
          </div>
          <p className="mt-4 text-[10px] font-black text-slate-400 
          animate-pulse">Calcul des voix en temps réel...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-700">
          <div className="mb-10 ">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-[900] text-slate-900 ">
                  Live Monitoring
                </h1>
                <p className="text-slate-400 font-bold mt-1 text-sm ">{resultsData.titre}</p>
              </div>
              {isLive ? (
                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[25px]
                 border border-emerald-100 shadow-xl shadow-emerald-50">
                  <div className="relative">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                    <div className="w-3 h-3 bg-emerald-500 rounded-full absolute top-0" />
                  </div>
                  <span className="text-emerald-600 font-black text-[10px] ">Flux de données actif</span>
                </div>
              ) : (
                <div className="bg-slate-100 px-6 py-4 rounded-[25px] text-slate-400 
                font-black text-[10px] ">
                  Scrutin clôturé
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* STATS GLOBALES */}
            <div className="lg:col-span-4 space-y-8">
              {/* TIMER CARD */}
              <div className={`p-8 rounded-[45px] border shadow-2xl transition-all duration-700 relative overflow-hidden
                ${isLive ? 'bg-slate-900 border-slate-800 text-white shadow-slate-200' : 
                'bg-white border-slate-100 text-slate-900'}`}>
                <div className="relative z-10 text-center">
                  <p className={`text-[9px] font-black  mb-4 ${isLive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isLive ? "Temps restant" : "Statut final"}
                  </p>
                  <h2 className="text-6xl font-[900] mb-2">
                    {isLive ? formatTime(timeLeft) : "FINI"}
                  </h2>
                  <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full mt-4 opacity-50" />
                </div>
              </div>

              {/* PARTICIPATION CARD */}
              <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-300 mb-10 text-center ">
                  Quorum de participation</h3>
                <div className="relative h-52 w-52 mx-auto">
                  <Doughnut data={participationData} options={{ maintainAspectRatio: false, plugins:
                     { legend: { display: false } }, cutout: '85%' }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-[900] text-slate-900 ">{participationRate}%</span>
                    <TrendingUp className="text-emerald-500 mt-1" size={16} />
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-3xl">
                    <p className="text-2xl font-[900] text-slate-900">{resultsData.votersCount}</p>
                    <p className="text-[8px] font-black text-slate-400  mt-1">Votants</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-3xl">
                    <p className="text-2xl font-[900] text-slate-400">{resultsData.totalInscrits}</p>
                    <p className="text-[8px] font-black text-slate-400  mt-1">Inscrits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CLASSEMENT CANDIDATS */}
            <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[50px] border
             border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-16">
                <h3 className="text-[12px] font-black text-slate-900 ">Classement des suffrages</h3>
                <Users size={20} className="text-slate-200" />
              </div>

              <div className="space-y-12">
                {sortedCandidates.map((c, index) => {
                  const percent = resultsData.votersCount > 0 
                    ? ((c.votes / resultsData.votersCount) * 100).toFixed(1) 
                    : 0;
                  const isLeader = index === 0 && c.votes > 0;

                  return (
                    <div key={index} className="group relative">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-5">
                          {/* Photo du candidat dynamique */}
                          <div className={`w-16 h-16 rounded-[22px] overflow-hidden 
                          border-4 shadow-xl transition-all duration-500 group-hover:-rotate-6
                            ${isLeader ? 'border-emerald-500 scale-110' : 'border-white'}`}>
                            {c.photo ? (
                              <img src={c.photo} className="w-full h-full object-cover" alt={c.name} />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center
                               justify-center text-slate-300">
                                <User size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                               <h4 className="text-xl font-[900] text-slate-900 ">{c.name}</h4>
                               {isLeader && <Trophy size={18} className="text-amber-500 animate-bounce" />}
                            </div>
                            <p className="text-[9px] font-black text-slate-400 ">
                              {c.votes} bulletins • {c.profession || 'Candidat'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-3xl font-[900] italic ${isLeader ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {percent}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Barre de progression stylisée */}
                      <div className="w-full h-4 bg-slate-50 rounded-full p-1 border border-slate-100 shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg 
                            ${isLeader ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-emerald-100' :
                              'bg-slate-300 shadow-slate-50'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER SECURITE */}
              <div className="mt-20 p-8 bg-emerald-50/30 rounded-[35px] border-2 border-dashed
               border-emerald-100 flex flex-col md:flex-row items-center gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg 
                flex items-center justify-center text-emerald-500 shrink-0">
                  <ShieldCheck size={32} />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[11px] font-[900] text-emerald-700  mb-1">Algorithme de dépouillement vérifié</p>
                  <p className="text-[10px] font-bold text-emerald-600/60 leading-relaxed ">
                    Anonymat stricte, le double comptage est techniquement impossible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminresultsPage;
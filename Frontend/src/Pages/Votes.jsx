import React, { useState, useEffect } from 'react';
import AdminLayout from '../Components/AdminLayout';
import { Plus, Play, Trash2, Users, Calendar } from 'lucide-react';
import CreateElectionModal from '../Components/CreateElectionModal';
import Logocts from "../assets/logo-cts2-removebg-preview.png";
import api from '../services/api';

const Votes = () => {
  const [showModal, setShowModal] = useState(false);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les élections depuis le serveur
  const fetchElections = async () => {
    try {
      const response = await api.get('/admin/elections');
      setElections(response.data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchElections(); }, []);

  const handleAddElection = async (formData) => {
    try {
      // formData sera un objet FormData (incluant les images)
      const response = await api.post('/admin/elections', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setElections([response.data, ...elections]);
      setShowModal(false);
    } catch (error) {
      alert("Erreur lors de la création");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Supprimer ce scrutin et tous ses candidats ?")) {
      try {
        await api.delete(`/admin/elections/${id}`);
        setElections(elections.filter(el => el.id !== id));
      } catch (error) { alert("Erreur suppression"); }
    }
  };

  return (
    <AdminLayout activePage="votes">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-[900] text-slate-900 ">Élections & Scrutins</h2>
            <p className="text-slate-400 font-medium text-sm">Configuration des candidats et des périodes de vote</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn h-14 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-2xl
             flex items-center gap-3 px-8 shadow-xl shadow-emerald-100 transition-all
              font-black  text-xs "
          >
            <Plus size={20} /> Nouveau scrutin
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {elections.map((election) => (
            <div key={election.id} className="bg-white p-6 rounded-[40px] border
             border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center
              justify-between gap-6 group hover:border-emerald-200 transition-all">
              
              {/* Infos Gauche */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center
                 justify-center border border-slate-100 group-hover:bg-emerald-50
                  group-hover:border-emerald-100 transition-colors">
                  <img src={Logocts} className="w-12 opacity-20 group-hover:opacity-100 transition-opacity" alt="Logo" />
                </div>
                <div>
                  <h4 className="font-[900] text-lg text-slate-800  leading-tight">{election.titre}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px]
                     font-black rounded-lg ">{election.code}</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black rounded-lg ">En ligne</span>
                  </div>
                </div>
              </div>

              {/* Liste miniature des candidats (Photos) */}
              <div className="flex -space-x-4 overflow-hidden px-4 border-l border-slate-100">
                {election.candidates?.map((cand, i) => (
                  <img 
                    key={i}
                    className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white object-cover bg-slate-200"
                    src={cand.photo || `https://ui-avatars.com/api/?name=${cand.nom_complet}`}
                    alt={cand.nom_complet}
                    title={`${cand.nom_complet} - ${cand.niveau}`}
                  />
                ))}
                <div className="h-12 w-12 rounded-2xl bg-slate-50 ring-4 ring-white 
                flex items-center justify-center text-[10px] font-black text-slate-400">
                  +{election.candidates?.length}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 justify-end lg:w-48">
                <button onClick={() => handleDelete(election.id)} className="p-4 text-slate-300
                 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
                  <Trash2 size={20} />
                </button>
                <button className="p-4 bg-emerald-500 text-white hover:bg-emerald-600
                 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <CreateElectionModal 
          close={() => setShowModal(false)} 
          onSubmit={handleAddElection} 
        />
      )}
    </AdminLayout>
  );
};

export default Votes;
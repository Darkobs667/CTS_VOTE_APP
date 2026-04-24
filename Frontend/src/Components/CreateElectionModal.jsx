import React, { useState } from 'react';
import { X, UserPlus, Camera, Trash2, CheckCircle2, Quote } from 'lucide-react';

const CreateElectionModal = ({ close, onSubmit }) => {
  const [titre, setTitre] = useState('');
  const [candidates, setCandidates] = useState([]);

  const addCandidate = () => {
    const newCand = { 
      id: Date.now(), 
      nom: '', 
      profession: '', // Niveau / Classe
      slogan: '',     // Ajout du slogan
      description: '', 
      image: null, 
      preview: null 
    };
    setCandidates([...candidates, newCand]);
  };

  const handleImageChange = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCandidates(candidates.map(c => 
        c.id === id ? { ...c, image: file, preview: reader.result } : c
      ));
    };
    reader.readAsDataURL(file);
  };

  const removeCandidate = (id) => setCandidates(candidates.filter(c => c.id !== id));

  const updateCandidate = (id, field, value) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (candidates.length < 2) return alert("Une élection nécessite au moins 2 candidats.");
    
    // On utilise FormData pour envoyer les fichiers et les textes au backend
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('code', `CTS-${Math.floor(Math.random() * 9000) + 1000}`);

    candidates.forEach((cand, index) => {
      formData.append(`candidates[${index}][nom]`, cand.nom);
      formData.append(`candidates[${index}][profession]`, cand.profession);
      formData.append(`candidates[${index}][slogan]`, cand.slogan);
      formData.append(`candidates[${index}][description]`, cand.description);
      if (cand.image) {
        formData.append(`candidates[${index}][photo]`, cand.image);
      }
    });

    onSubmit(formData); // Envoi vers Votes.jsx qui fera l'appel API
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl 
      overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-[900] text-slate-900 ">Lancer un Scrutin</h3>
            <p className="text-[10px] text-emerald-500 font-black ">Configuration des candidats</p>
          </div>
          <button onClick={close} className="p-3 hover:bg-white rounded-2xl transition-all
           text-slate-300 hover:text-red-500 shadow-sm">
            <X size={24}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
          {/* Titre de l'élection */}
          <div className="mb-10">
            <label className="text-[10px] font-black text-slate-400 ml-2 mb-3 block ">Poste ou Intitulé de l'élection</label>
            <input 
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold
               text-slate-700 focus:ring-2 focus:ring-emerald-400 transition-all 
               shadow-inner placeholder:text-slate-300" 
              placeholder="ex: Président du Bureau des Étudiants" 
            />
          </div>

          {/* Section Candidats */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-xs font-[900] text-slate-900 ">Candidats en lice ({candidates.length})</h4>
              <button 
                type="button" 
                onClick={addCandidate}
                className="flex items-center gap-2 text-emerald-600 bg-emerald-50
                 hover:bg-emerald-500 hover:text-white font-black text-[10px]
                   px-6 py-3 rounded-2xl transition-all shadow-sm"
              >
                <UserPlus size={16} /> Ajouter un candidat
              </button>
            </div>

            {candidates.map((cand, index) => (
              <div key={cand.id} className="p-6 bg-white rounded-[32px] border
               border-slate-100 flex flex-col gap-6 group relative
                hover:border-emerald-200 transition-all shadow-sm hover:shadow-md">
                
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Photo Upload */}
                  <div className="relative shrink-0 mx-auto md:mx-0">
                    <div 
                      onClick={() => document.getElementById(`file-${cand.id}`).click()}
                      className="w-24 h-24 rounded-[30px] bg-slate-50 border-2 border-dashed
                       border-slate-200 flex items-center justify-center 
                       cursor-pointer overflow-hidden hover:border-emerald-400
                        hover:text-emerald-400 transition-all group/img shadow-inner"
                    >
                      {cand.preview ? (
                        <img src={cand.preview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="text-center">
                          <Camera className="mx-auto text-slate-300 group-hover/img:scale-110 transition-transform" size={28} />
                          <span className="text-[8px] font-black uppercase mt-1 block">Ajouter Photo</span>
                        </div>
                      )}
                    </div>
                    <input 
                      id={`file-${cand.id}`}
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => handleImageChange(cand.id, e.target.files[0])}
                    />
                  </div>

                  {/* Infos Principales */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400  ml-1">Nom du candidat</label>
                      <input 
                        required
                        placeholder="Prénom & Nom" 
                        className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm
                         font-bold focus:ring-1 focus:ring-emerald-400"
                        value={cand.nom}
                        onChange={(e) => updateCandidate(cand.id, 'nom', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400  ml-1">Niveau d'étude / Classe</label>
                      <input 
                        required
                        placeholder="ex: L3 Génie Logiciel" 
                        className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm 
                        font-bold focus:ring-1 focus:ring-emerald-400"
                        value={cand.profession}
                        onChange={(e) => updateCandidate(cand.id, 'profession', e.target.value)}
                      />
                    </div>
                    {/* SLOGAN */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400
                        ml-1 flex items-center gap-1">
                        <Quote size={10} className="text-emerald-500" /> Slogan de campagne
                      </label>
                      <input 
                        required
                        placeholder="Votre promesse phare en une phrase..." 
                        className="w-full bg-emerald-50/30 border-none rounded-xl p-4
                         text-sm font-bold  text-emerald-700 focus:ring-1 focus:ring-emerald-400"
                        value={cand.slogan}
                        onChange={(e) => updateCandidate(cand.id, 'slogan', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => removeCandidate(cand.id)}
                  className="absolute top-4 right-4 bg-white text-slate-200 hover:text-red-500 
                  p-2 rounded-xl shadow-sm border border-slate-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 bg-white border-t border-slate-50 flex gap-4">
          <button type="button" onClick={close} className="flex-1 py-4 font-black text-slate-400
            text-[10px]  hover:text-slate-600 transition-colors">
            Annuler
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="flex-1 bg-emerald-500 py-5 rounded-[24px] text-white
             font-[900]  text-[11px]  shadow-xl
              shadow-emerald-100 flex items-center justify-center gap-3
               hover:bg-emerald-600 hover:-translate-y-1 transition-all active:scale-95"
          >
            <CheckCircle2 size={20} /> Diffuser l'élection
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateElectionModal;
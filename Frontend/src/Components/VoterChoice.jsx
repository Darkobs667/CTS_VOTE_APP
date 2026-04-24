import { useState } from "react";
import VoterLayout from "../Components/VoterLayout"; // Vérifie le chemin
import { Link, useLocation } from "react-router"; // Pour récupérer les données passées
import { User, ShieldAlert, Check } from "lucide-react";

const VoterChoice = ({ onConfirm }) => {
  const location = useLocation();
  const [selected, setSelected] = useState(null);

  // RÉCUPÉRATION DYNAMIQUE : On récupère l'élection passée par le dashboard
  // Si aucune élection n'est passée (accès direct), on met un objet vide par sécurité
  const election = location.state?.election || { 
    titre: "Chargement...", 
    candidates: [] 
  };

  const handleValidation = () => {
    // On trouve l'objet complet du candidat sélectionné
    const monChoix = selected === 'blanc' 
      ? { id: 'blanc', nom: 'Vote Blanc' }
      : election.candidates.find(c => c.id === selected);
    
    // On passe le choix au parent ou au récapitulatif
    if (onConfirm) onConfirm(monChoix);
  };

  return (
    <VoterLayout activePage="dashboard">
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        
        {/* HEADER DYNAMIQUE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-[900] text-slate-900 ">
              Vote en cours : {election.titre}
            </h1>
            <div className="h-2 w-full max-w-md bg-slate-100 rounded-full mt-6 overflow-hidden shadow-inner">
               <div className="h-full w-1/2 bg-emerald-500 rounded-full transition-all duration-1000 animate-pulse" />
            </div>
            <p className="text-[11px] font-black text-slate-400 mt-3 flex items-center gap-2">
              <span className="bg-slate-900 text-white px-2 py-0.5 rounded">ÉTAPE 1 SUR 2</span> 
              <span className="">Sélection du candidat</span>
            </p>
          </div>
        </div>

        {/* GRILLE DES CANDIDATS DYNAMIQUE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {election.candidates.map((c) => (
            <div 
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`group relative p-8 rounded-[45px] border-2 cursor-pointer transition-all duration-500 ${
                selected === c.id 
                ? 'border-emerald-500 bg-white shadow-2xl shadow-emerald-100 scale-[1.02]' 
                : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                {/* Photo du Candidat */}
                <div className="w-28 h-28 shrink-0 rounded-[35px] bg-slate-50 overflow-hidden border-4
                 border-white shadow-lg group-hover:rotate-3 transition-transform duration-500">
                  {c.photo || c.preview ? (
                    <img src={c.photo || c.preview} className="w-full h-full object-cover" alt={c.nom} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-300">
                      <User size={40} />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-[900] text-slate-800 text-xl leading-tight ">
                        {c.nom || c.name}
                      </h3>
                      <p className="text-emerald-500 text-[10px] font-black  mt-1">
                        {c.profession || c.job}
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      selected === c.id ? 'border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-200 rotate-12'
                       : 'border-slate-100 group-hover:border-emerald-300'
                    }`}>
                      {selected === c.id && <Check className="text-white" size={18} strokeWidth={4} />}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                    <p className="text-[10px] font-black  text-slate-400 mb-1">Profession de foi</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed ">
                      "{c.slogan}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VOTE BLANC */}
        <div 
          onClick={() => setSelected('blanc')}
          className={`p-6 rounded-[30px] border-2 flex justify-between items-center cursor-pointer transition-all duration-300 ${
            selected === 'blanc' 
            ? 'border-slate-900 bg-white shadow-xl scale-[1.01]' 
            : 'border-slate-50 bg-slate-50/50 hover:bg-white'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selected === 'blanc' ? 'bg-slate-900 text-white' : 'bg-white text-slate-300'}`}>
              <ShieldAlert size={20} />
            </div>
            <span className="font-black text-slate-800  text-xs ">S'abstenir / Vote Blanc</span>
          </div>
          <div className={`w-6 h-6 rounded-xl border-2 transition-all ${selected === 'blanc' ? 'border-slate-900 bg-slate-900' : 'border-slate-200'}`}>
             {selected === 'blanc' && <Check className="text-white" size={14} strokeWidth={4} />}
          </div>
        </div>

        {/* BOUTON DE VALIDATION */}
        <div className="flex flex-col items-center justify-center pt-10 border-t border-slate-50">
          {selected ? (
            <Link 
              to="/voterRecap" 
              state={{ election, selectedCandidate: selected === 'blanc' ? {id: 'blanc', nom: 'VOTE BLANC'}
               : election.candidates.find(c => c.id === selected) }}
              className="w-full md:w-[60%] py-5 text-center bg-emerald-500 text-white rounded-[25px]
               font-black shadow-2xl shadow-emerald-100
                hover:bg-emerald-600 hover:-translate-y-1 transition-all active:scale-95"
            >
              Confirmer mon choix
            </Link>
          ) : (
            <div className="flex items-center gap-3 text-amber-500 p-4 bg-amber-50/50 rounded-2xl border
             border-amber-100 animate-bounce">
               <ShieldAlert size={18} />
               <span className="font-black text-[10px] ">Veuillez sélectionner un candidat pour continuer</span>
            </div>
          )}
        </div>
      </div>
    </VoterLayout>
  );
};

export default VoterChoice;
import React, { useState, useEffect } from 'react';
import AdminLayout from '../Components/AdminLayout';
import { UserPlus, Search, MoreVertical, ShieldCheck, ShieldAlert, Loader2, Trash2 } from 'lucide-react';
import AddElectorModal from '../Components/AddElectorModal';
import { electeurService } from '../services/electeurService'; // Ton service Axios

const Electeurs = () => {
    const [electeurs, setElecteurs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("Tous les statuts");

    // 1. Récupération réelle des données via l'API
    const fetchElecteurs = async () => {
        setIsLoading(true);
        try {
            // Appel à ton service Axios
            const data = await electeurService.getAll();
            setElecteurs(data);
        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
            // Optionnel: afficher une notification d'erreur ici
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchElecteurs();
    }, []);

    // 2. Gestion de l'ajout via l'API
    const handleAddElector = async (newElectorData) => {
        try {
            const savedElector = await electeurService.create(newElectorData);
            setElecteurs([savedElector, ...electeurs]);
            setShowModal(false);
        } catch (error) {
            alert("Erreur lors de l'ajout de l'électeur");
        }
    };

    // 3. Suppression d'un électeur
    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet électeur ?")) {
            try {
                await electeurService.delete(id);
                setElecteurs(electeurs.filter(e => e.id !== id));
            } catch (error) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    // 4. Filtrage dynamique (Recherche + Status)
    const filteredElecteurs = electeurs.filter(e => {
        const matchesSearch = e.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             e.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (statusFilter === "Tous les statuts") return matchesSearch;
        return matchesSearch && e.status === statusFilter;
    });

    return (
        <AdminLayout>
            {showModal && (
                <AddElectorModal 
                    close={() => setShowModal(false)} 
                    onAdd={handleAddElector} 
                />
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 ">Registre Électoral</h1>
                        <p className="text-slate-500 text-xs font-medium mt-1">Gérez la liste des membres</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowModal(true)}
                            className="flex-1 md:flex-none p-3 bg-emerald-500 text-white
                             rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-600
                              transition-all flex items-center justify-center gap-2 font-bold text-xs"
                        >
                            <UserPlus size={18} /> Ajouter un électeur
                        </button>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white p-4 rounded-[28px] border border-slate-100
                 mb-6 flex flex-col md:flex-row gap-4 items-center shadow-sm">
                    <div className="relative w-full md:flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher par nom ou email..." 
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl
                             text-sm focus:ring-2 focus:ring-emerald-400 font-medium"
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-48 py-3 bg-slate-50 border-none rounded-xl 
                        text-sm font-bold text-slate-600 focus:ring-2 focus:ring-emerald-400"
                    >
                        <option>Tous les statuts</option>
                        <option>Validé</option>
                        <option>En attente</option>
                    </select>
                </div>

                {/* Liste des Électeurs */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm
                 overflow-hidden min-h-[400px] flex flex-col">
                    {isLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                            <Loader2 className="animate-spin text-emerald-500" size={40} />
                            <p className="font-bold text-xs ">
                                Synchronisation avec la base de données...
                                </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-50">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-black  text-slate-400">Électeur</th>
                                        <th className="px-6 py-5 text-[10px] font-black  text-slate-400">Status Security</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredElecteurs.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/80 transition-all group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50
                                                     to-emerald-100 flex items-center justify-center text-emerald-600
                                                      font-black text-sm border border-emerald-200/50 shadow-sm">
                                                        {user.nom.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{user.nom}</p>
                                                        <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {user.status === "Validé" ? (
                                                        <span className="flex items-center gap-1.5 text-emerald-600
                                                         bg-emerald-50 px-3 py-1 rounded-full text-[9px] 
                                                         font-black ">
                                                            <ShieldCheck size={14} /> {user.status}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-amber-500
                                                         bg-amber-50 px-3 py-1 rounded-full text-[9px] 
                                                         font-black ">
                                                            <ShieldAlert size={14} /> {user.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2.5 text-slate-300 hover:text-red-500
                                                         hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <button className="p-2.5 text-slate-300 hover:text-emerald-500
                                                     hover:bg-emerald-50 rounded-xl transition-all">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Electeurs;
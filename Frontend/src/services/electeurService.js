import api from './api';

export const electeurService = {
    // Récupérer tous les électeurs
    getAll: async () => {
        const response = await api.get('/admin/electeurs');
        return response.data;
    },

    // Ajouter un nouvel électeur (si tu as une modale pour ça)
    create: async (electeurData) => {
        const response = await api.post('/admin/electeurs', electeurData);
        return response.data;
    },

    // Supprimer un électeur
    delete: async (id) => {
        const response = await api.delete(`/admin/electeurs/${id}`);
        return response.data;
    }
};
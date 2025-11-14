// Sistema de storage usando localStorage do navegador
const storage = {
  async get(key, shared = false) {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return { value };
      }
      return null;
    } catch (error) {
      console.error('Erro ao ler do storage:', error);
      return null;
    }
  },

  async set(key, value, shared = false) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
      throw error;
    }
  },

  async delete(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao deletar do storage:', error);
      throw error;
    }
  }
};

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
  window.storage = storage;
}

export default storage;

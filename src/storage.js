// Sistema de storage usando Supabase
import { supabaseStorage } from './supabaseClient'

const storage = {
  async get(key, shared = false) {
    try {
      console.log(`[Storage] GET: ${key}`)
      
      switch(key) {
        case 'system-users':
          const users = await supabaseStorage.getUsers()
          return { value: JSON.stringify(users) }
        
        case 'calendar-events':
          const events = await supabaseStorage.getEvents()
          return { value: JSON.stringify(events) }
        
        case 'event-types':
          const types = await supabaseStorage.getEventTypes()
          return { value: JSON.stringify(types) }
        
        case 'system-logo':
          const logoConfig = await supabaseStorage.getConfig('system-logo')
          return logoConfig ? { value: logoConfig.value } : null
        
        case 'current-session':
          // Sessão continua em localStorage por segurança
          const session = localStorage.getItem(key)
          return session ? { value: session } : null
        
        default:
          return null
      }
    } catch (error) {
      console.error(`[Storage] Erro ao ler ${key}:`, error)
      return null
    }
  },

  async set(key, value, shared = false) {
    try {
      console.log(`[Storage] SET: ${key}`)
      
      switch(key) {
        case 'system-users':
          // Usuários são gerenciados individualmente, não em massa
          // Esta função não é mais usada para usuários
          return true
        
        case 'calendar-events':
          // Eventos são gerenciados individualmente
          // Esta função não é mais usada para eventos
          return true
        
        case 'event-types':
          // Tipos são gerenciados individualmente
          // Esta função não é mais usada para tipos
          return true
        
        case 'system-logo':
          await supabaseStorage.setConfig('system-logo', value)
          return true
        
        case 'current-session':
          // Sessão continua em localStorage
          localStorage.setItem(key, value)
          return true
        
        default:
          return false
      }
    } catch (error) {
      console.error(`[Storage] Erro ao salvar ${key}:`, error)
      throw error
    }
  },

  async delete(key) {
    try {
      console.log(`[Storage] DELETE: ${key}`)
      
      if (key === 'current-session') {
        localStorage.removeItem(key)
        return true
      }
      
      return true
    } catch (error) {
      console.error(`[Storage] Erro ao deletar ${key}:`, error)
      throw error
    }
  }
}

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
  window.storage = storage
}

export default storage


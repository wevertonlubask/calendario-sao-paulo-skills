import { createClient } from '@supabase/supabase-js'

// CONFIGURAÇÃO DO SUPABASE
// Substitua pelas suas credenciais após criar o projeto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gfyhghzdkmnhnhudkobg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeWhnaHpka21uaG5odWRrb2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwODQyNDAsImV4cCI6MjA3ODY2MDI0MH0.1cQF9afN5gASKojEVbpdztVhmow7dYRkxQ0nIC5qtKU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções auxiliares para o sistema de storage
export const supabaseStorage = {
  // Usuários
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateUser(id, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Eventos
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateEvent(id, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteEvent(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Tipos de Eventos
  async getEventTypes() {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createEventType(typeData) {
    const { data, error } = await supabase
      .from('event_types')
      .insert([typeData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateEventType(id, typeData) {
    const { data, error } = await supabase
      .from('event_types')
      .update(typeData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteEventType(value) {
    const { error } = await supabase
      .from('event_types')
      .delete()
      .eq('value', value)
    
    if (error) throw error
  },

  // Configurações do Sistema
  async getConfig(key) {
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async setConfig(key, value) {
    const { data, error } = await supabase
      .from('system_config')
      .upsert({ key, value }, { onConflict: 'key' })
      .select()
    
    if (error) throw error
    return data[0]
  }
}

export default supabase

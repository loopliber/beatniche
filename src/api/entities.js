import { supabase } from './supabaseClient';

// Keywords entity
export const Keyword = {
  // Get all keywords
  async getAll() {
    const { data, error } = await supabase
      .from('keywords')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get keyword by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('keywords')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new keyword
  async create(keywordData) {
    const { data, error } = await supabase
      .from('keywords')
      .insert([keywordData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update keyword
  async update(id, updates) {
    const { data, error } = await supabase
      .from('keywords')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete keyword
  async delete(id) {
    const { error } = await supabase
      .from('keywords')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Search keywords
  async search(query) {
    const { data, error } = await supabase
      .from('keywords')
      .select('*')
      .or(`keyword.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Trending Artists entity
export const TrendingArtist = {
  // Get all trending artists
  async getAll() {
    const { data, error } = await supabase
      .from('trending_artists')
      .select('*')
      .order('rank', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get artist by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('trending_artists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new trending artist
  async create(artistData) {
    const { data, error } = await supabase
      .from('trending_artists')
      .insert([artistData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update artist
  async update(id, updates) {
    const { data, error } = await supabase
      .from('trending_artists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete artist
  async delete(id) {
    const { error } = await supabase
      .from('trending_artists')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Get trending artists by genre
  async getByGenre(genre) {
    const { data, error } = await supabase
      .from('trending_artists')
      .select('*')
      .eq('genre', genre)
      .order('rank', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Auth utilities
export const User = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Sign up
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  // Reset password
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  },

  // Update user
  async updateUser(updates) {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  }
};
import { supabase } from './supabaseClient';
import { mockKeywords, mockTrendingArtists } from './mockData';

// Keywords entity
export const Keyword = {
  // Get all keywords with optional sorting and limit
  async getAll(orderBy = 'created_at', limit = null) {
    try {
      let query = supabase
        .from('keywords')
        .select('*');

      // Handle sorting
      if (orderBy.startsWith('-')) {
        const field = orderBy.substring(1);
        query = query.order(field, { ascending: false });
      } else {
        query = query.order(orderBy, { ascending: true });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data && data.length > 0 ? data : mockKeywords.slice(0, limit || mockKeywords.length);
    } catch (error) {
      console.warn('Using mock data for keywords:', error.message);
      return mockKeywords.slice(0, limit || mockKeywords.length);
    }
  },

  // Alias for getAll with different parameter order (for backward compatibility)
  async list(orderBy = 'created_at', limit = null) {
    return this.getAll(orderBy, limit);
  },

  // Get keyword by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data || mockKeywords.find(k => k.id === id);
    } catch (error) {
      console.warn('Using mock data for keyword:', error.message);
      return mockKeywords.find(k => k.id === id);
    }
  },

  // Create new keyword
  async create(keywordData) {
    try {
      const { data, error } = await supabase
        .from('keywords')
        .insert([{
          ...keywordData,
          opportunity_score: keywordData.opportunity_score || Math.floor(Math.random() * 40) + 60
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating keyword:', error);
      throw error;
    }
  },

  // Update keyword
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('keywords')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating keyword:', error);
      throw error;
    }
  },

  // Delete keyword
  async delete(id) {
    try {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting keyword:', error);
      throw error;
    }
  },

  // Search keywords
  async search(query) {
    try {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .or(`keyword.ilike.%${query}%, description.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data && data.length > 0 ? data : mockKeywords.filter(k => 
        k.keyword.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.warn('Using mock data for search:', error.message);
      return mockKeywords.filter(k => 
        k.keyword.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
};

// Trending Artists entity
export const TrendingArtist = {
  // Get all trending artists with optional sorting and limit
  async getAll(orderBy = 'rank', limit = null) {
    try {
      let query = supabase
        .from('trending_artists')
        .select('*');

      // Handle sorting
      if (orderBy.startsWith('-')) {
        const field = orderBy.substring(1);
        query = query.order(field, { ascending: false });
      } else {
        query = query.order(orderBy, { ascending: true });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data && data.length > 0 ? data : mockTrendingArtists.slice(0, limit || mockTrendingArtists.length);
    } catch (error) {
      console.warn('Using mock data for trending artists:', error.message);
      return mockTrendingArtists.slice(0, limit || mockTrendingArtists.length);
    }
  },

  // Alias for getAll with different parameter order (for backward compatibility)
  async list(orderBy = 'rank', limit = null) {
    return this.getAll(orderBy, limit);
  },

  // Get artist by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('trending_artists')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data || mockTrendingArtists.find(a => a.id === id);
    } catch (error) {
      console.warn('Using mock data for artist:', error.message);
      return mockTrendingArtists.find(a => a.id === id);
    }
  },

  // Create new trending artist
  async create(artistData) {
    try {
      const { data, error } = await supabase
        .from('trending_artists')
        .insert([{
          ...artistData,
          trend_momentum: artistData.trend_momentum || Math.floor(Math.random() * 30) + 70,
          opportunity_level: artistData.opportunity_level || ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating artist:', error);
      throw error;
    }
  },

  // Update artist
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('trending_artists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating artist:', error);
      throw error;
    }
  },

  // Delete artist
  async delete(id) {
    try {
      const { error } = await supabase
        .from('trending_artists')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting artist:', error);
      throw error;
    }
  },

  // Get trending artists by genre
  async getByGenre(genre) {
    try {
      const { data, error } = await supabase
        .from('trending_artists')
        .select('*')
        .eq('genre', genre)
        .order('rank', { ascending: true });
      
      if (error) throw error;
      return data && data.length > 0 ? data : mockTrendingArtists.filter(a => a.genre === genre);
    } catch (error) {
      console.warn('Using mock data for genre:', error.message);
      return mockTrendingArtists.filter(a => a.genre === genre);
    }
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
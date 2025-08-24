import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

export function useSupabaseQuery(table, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    select = '*',
    filters = [],
    orderBy = null,
    limit = null,
    dependencies = []
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from(table).select(select);

        // Apply filters
        filters.forEach(filter => {
          const { column, operator, value } = filter;
          query = query[operator](column, value);
        });

        // Apply ordering
        if (orderBy) {
          const { column, ascending = true } = orderBy;
          query = query.order(column, { ascending });
        }

        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }

        const { data: result, error } = await query;

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err.message);
        console.error(`Supabase query error for table ${table}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(options), ...dependencies]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // The useEffect will handle the refetch
  };

  return { data, loading, error, refetch };
}

export function useSupabaseMutation(table) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const insert = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (err) {
      setError(err.message);
      console.error(`Supabase insert error for table ${table}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (err) {
      setError(err.message);
      console.error(`Supabase update error for table ${table}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message);
      console.error(`Supabase delete error for table ${table}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    insert,
    update,
    remove
  };
}

export function useKeywords(userId = null) {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('keywords')
          .select('*')
          .order('created_at', { ascending: false });

        // If userId is provided, filter by user, otherwise get public keywords
        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          query = query.eq('is_public', true);
        }

        const { data, error } = await query;

        if (error) throw error;
        setKeywords(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching keywords:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywords();
  }, [userId]);

  return { keywords, loading, error, refetch: () => setLoading(true) };
}

export function useTrendingArtists(genre = null) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('trending_artists')
          .select('*')
          .order('rank', { ascending: true });

        if (genre) {
          query = query.eq('genre', genre);
        }

        const { data, error } = await query;

        if (error) throw error;
        setArtists(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching trending artists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [genre]);

  return { artists, loading, error, refetch: () => setLoading(true) };
}

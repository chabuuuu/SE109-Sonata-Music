import { useState, useEffect } from 'react';
import { Artist, getArtistsForHome, getAllArtists, searchArtists, getArtistsByInstrument, ArtistSearchResponse } from '@/services/artistService';

interface UseArtistsOptions {
  searchTerm?: string;
  instrumentFilter?: string;
  pageSize?: number;
  autoFetch?: boolean;
}

interface UseArtistsReturn {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  totalArtists: number;
  refreshArtists: () => Promise<void>;
  searchResults: ArtistSearchResponse | null;
}

export const useArtists = (options: UseArtistsOptions = {}): UseArtistsReturn => {
  const {
    searchTerm = '',
    instrumentFilter = '',
    pageSize = 20,
    autoFetch = true
  } = options;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalArtists, setTotalArtists] = useState(0);
  const [searchResults, setSearchResults] = useState<ArtistSearchResponse | null>(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);

      let result: Artist[] = [];
      let total = 0;

      if (searchTerm.trim()) {
        // Tìm kiếm nghệ sĩ
        const searchResponse = await searchArtists(searchTerm.trim(), pageSize, 1);
        setSearchResults(searchResponse);
        
        if (searchResponse.success) {
          result = searchResponse.data.items;
          total = searchResponse.data.total;
        }
      } else if (instrumentFilter && instrumentFilter !== 'All Instruments') {
        // Lọc theo nhạc cụ
        const instrumentResponse = await getArtistsByInstrument(instrumentFilter, 1, pageSize);
        
        if (instrumentResponse.success) {
          result = instrumentResponse.data.items;
          total = instrumentResponse.data.total;
        }
        setSearchResults(null);
      } else {
        // Lấy tất cả nghệ sĩ
        const allArtistsResponse = await getAllArtists(1, pageSize);
        
        if (allArtistsResponse.success) {
          result = allArtistsResponse.data.items;
          total = allArtistsResponse.data.total;
        }
        setSearchResults(null);
      }

      setArtists(result);
      setTotalArtists(total);
    } catch (err) {
      console.error('Lỗi khi fetch artists:', err);
      setError('Có lỗi xảy ra khi tải danh sách nghệ sĩ');
    } finally {
      setLoading(false);
    }
  };

  const refreshArtists = async () => {
    await fetchArtists();
  };

  useEffect(() => {
    if (autoFetch) {
      const timeoutId = setTimeout(() => {
        fetchArtists();
      }, searchTerm ? 300 : 0); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, instrumentFilter, pageSize, autoFetch]);

  return {
    artists,
    loading,
    error,
    totalArtists,
    refreshArtists,
    searchResults
  };
};

// Hook riêng cho Home page
export const useHomeArtists = (count: number = 5) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeArtists = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getArtistsForHome(count);
      setArtists(result);
    } catch (err) {
      console.error('Lỗi khi fetch home artists:', err);
      setError('Có lỗi xảy ra khi tải danh sách nghệ sĩ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeArtists();
  }, [count]);

  return {
    artists,
    loading,
    error,
    refreshArtists: fetchHomeArtists
  };
}; 
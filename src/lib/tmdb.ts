const TMDB_API_KEY = '2c806e0ce14975fe836832ea8668d6d1';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  media_type?: 'movie' | 'tv';
}

export interface TVShow extends Omit<Movie, 'title' | 'release_date'> {
  name: string;
  original_name?: string;
  first_air_date: string;
}

export type Content = Movie | TVShow;

export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const tmdbApi = {
  async getTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<Content[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}&language=ru-RU`
    );
    const data = await response.json();
    return data.results || [];
  },

  async getPopular(mediaType: 'movie' | 'tv' = 'movie'): Promise<Content[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`
    );
    const data = await response.json();
    return data.results || [];
  },

  async getTopRated(mediaType: 'movie' | 'tv' = 'movie'): Promise<Content[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`
    );
    const data = await response.json();
    return data.results || [];
  },

  async searchMulti(query: string): Promise<Content[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=ru-RU&query=${encodeURIComponent(query)}&page=1`
    );
    const data = await response.json();
    return data.results || [];
  },

  async getDetails(id: number, mediaType: 'movie' | 'tv'): Promise<Movie | TVShow> {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=ru-RU&append_to_response=credits,videos`
    );
    return await response.json();
  },

  async getGenres(mediaType: 'movie' | 'tv' = 'movie'): Promise<{ id: number; name: string }[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/${mediaType}/list?api_key=${TMDB_API_KEY}&language=ru-RU`
    );
    const data = await response.json();
    return data.genres || [];
  },

  async discoverByGenre(genreId: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<Content[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}&language=ru-RU&with_genres=${genreId}&page=1&sort_by=popularity.desc`
    );
    const data = await response.json();
    return data.results || [];
  },

  async discoverWithFilters(
    mediaType: 'movie' | 'tv' = 'movie',
    filters: {
      genres?: number[];
      yearFrom?: number;
      yearTo?: number;
      ratingFrom?: number;
    }
  ): Promise<Content[]> {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'ru-RU',
      page: '1',
      sort_by: 'popularity.desc',
    });

    if (filters.genres && filters.genres.length > 0) {
      params.append('with_genres', filters.genres.join(','));
    }

    if (filters.yearFrom) {
      params.append(mediaType === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte', `${filters.yearFrom}-01-01`);
    }

    if (filters.yearTo) {
      params.append(mediaType === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte', `${filters.yearTo}-12-31`);
    }

    if (filters.ratingFrom && filters.ratingFrom > 0) {
      params.append('vote_average.gte', filters.ratingFrom.toString());
    }

    const response = await fetch(`${TMDB_BASE_URL}/discover/${mediaType}?${params.toString()}`);
    const data = await response.json();
    return data.results || [];
  },
};

export const getLumexUrl = (tmdbId: number, mediaType: 'movie' | 'tv'): string => {
  return `//p.lumex.cloud/pBHgzGTxFN54/${mediaType}/${tmdbId}`;
};
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { tmdbApi, getImageUrl, type Content } from '@/lib/tmdb';
import { useNavigate } from 'react-router-dom';
import FiltersDialog from '@/components/FiltersDialog';

const categories = [
  { name: 'Все', icon: 'Grid3x3', type: 'all' as const },
  { name: 'Фильмы', icon: 'Film', type: 'movie' as const },
  { name: 'Сериалы', icon: 'Tv', type: 'tv' as const },
  { name: 'Аниме', icon: 'Sparkles', genreId: 16 },
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingContent, setTrendingContent] = useState<Content[]>([]);
  const [popularMovies, setPopularMovies] = useState<Content[]>([]);
  const [popularShows, setPopularShows] = useState<Content[]>([]);
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(async () => {
        setIsSearching(true);
        const results = await tmdbApi.searchMulti(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadContent = async () => {
    const [trending, movies, shows] = await Promise.all([
      tmdbApi.getTrending('all', 'week'),
      tmdbApi.getPopular('movie'),
      tmdbApi.getPopular('tv'),
    ]);
    setTrendingContent(trending.slice(0, 10));
    setPopularMovies(movies.slice(0, 10));
    setPopularShows(shows.slice(0, 10));
  };

  const getTitle = (item: Content) => {
    return 'title' in item ? item.title : item.name;
  };

  const getReleaseYear = (item: Content) => {
    const date = 'release_date' in item ? item.release_date : item.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  const handleApplyFilters = async (filters: {
    genres: number[];
    yearFrom: number;
    yearTo: number;
    ratingFrom: number;
  }) => {
    const hasFilters = filters.genres.length > 0 || filters.ratingFrom > 0;
    setHasActiveFilters(hasFilters);

    if (hasFilters) {
      const mediaType = selectedCategory === 'Фильмы' ? 'movie' : selectedCategory === 'Сериалы' ? 'tv' : 'movie';
      const results = await tmdbApi.discoverWithFilters(mediaType, filters);
      setFilteredContent(results);
    } else {
      setFilteredContent([]);
    }
  };

  const displayedContent = searchQuery.trim() 
    ? searchResults 
    : hasActiveFilters
      ? filteredContent
      : selectedCategory === 'Все' 
        ? trendingContent 
        : selectedCategory === 'Фильмы' 
          ? popularMovies 
          : popularShows;

  const handleContentClick = (item: Content) => {
    const mediaType = 'title' in item ? 'movie' : 'tv';
    navigate(`/watch/${mediaType}/${item.id}`);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Icon name="Play" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Taloka
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Главная</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Каталог</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Подборки</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Друзья</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button className="glass-hover bg-gradient-to-r from-primary to-secondary border-0">
              <Icon name="Users" size={18} className="mr-2" />
              Смотреть вместе
            </Button>
            <Button variant="ghost" size="icon" className="glass-hover">
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </header>

      {trendingContent.length > 0 && (
        <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={getImageUrl(trendingContent[0]?.backdrop_path, 'original')}
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
            <Badge className="mb-4 glass text-lg px-4 py-1 bg-accent/80 border-0">
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Тренд недели
            </Badge>
            <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
              {getTitle(trendingContent[0])}
            </h2>
            <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              {trendingContent[0]?.overview?.slice(0, 150)}...
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                onClick={() => handleContentClick(trendingContent[0])}
                className="glass-hover bg-gradient-to-r from-primary to-secondary text-lg px-8 border-0 hover:scale-105 transition-transform"
              >
                <Icon name="Play" size={24} className="mr-2" />
                Смотреть сейчас
              </Button>
              <Button size="lg" className="glass-hover text-lg px-8 border-white/20">
                <Icon name="Plus" size={20} className="mr-2" />
                В избранное
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Поиск фильмов, сериалов, аниме..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 glass border-white/10 text-lg"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Icon name="Loader" size={20} className="animate-spin" />
              </div>
            )}
          </div>
          <FiltersDialog
            onApplyFilters={handleApplyFilters}
            mediaType={selectedCategory === 'Фильмы' ? 'movie' : 'tv'}
          />
        </div>

        <div className="flex gap-3 mb-12 overflow-x-auto pb-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center gap-2 whitespace-nowrap transition-all border-white/10 ${
                selectedCategory === category.name
                  ? 'glass-hover bg-gradient-to-r from-primary to-secondary scale-105 border-0'
                  : 'glass-hover'
              }`}
            >
              <Icon name={category.icon as any} size={18} />
              {category.name}
            </Button>
          ))}
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            {searchQuery ? 'Результаты поиска' : selectedCategory === 'Все' ? 'Популярное сейчас' : `Популярные ${selectedCategory.toLowerCase()}`}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedContent.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleContentClick(item)}
                className="group relative rounded-2xl overflow-hidden glass-hover cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={getImageUrl(item.poster_path, 'w500')}
                    alt={getTitle(item)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full glass-hover bg-primary/80 flex items-center justify-center">
                        <Icon name="Play" size={32} />
                      </div>
                    </div>
                  </div>
                  <Badge className="absolute top-3 right-3 glass bg-accent/90 border-0 font-bold">
                    <Icon name="Star" size={14} className="mr-1" />
                    {item.vote_average.toFixed(1)}
                  </Badge>
                </div>
                <div className="p-4 bg-card/60 backdrop-blur-sm">
                  <h4 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {getTitle(item)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {getReleaseYear(item)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!searchQuery && (
          <>
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
                Популярные сериалы
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {popularShows.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleContentClick(item)}
                    className="group relative rounded-2xl overflow-hidden glass-hover cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={getTitle(item)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full glass-hover bg-secondary/80 flex items-center justify-center">
                            <Icon name="Play" size={32} />
                          </div>
                        </div>
                      </div>
                      <Badge className="absolute top-3 right-3 glass bg-secondary/90 border-0 font-bold">
                        <Icon name="Star" size={14} className="mr-1" />
                        {item.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="p-4 bg-card/60 backdrop-blur-sm">
                      <h4 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-secondary transition-colors">
                        {getTitle(item)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {getReleaseYear(item)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-20">
              <div className="glass-hover p-8 rounded-3xl border-white/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                  <Icon name="Film" size={32} className="text-primary" />
                </div>
                <h4 className="text-2xl font-bold mb-3">70 000+ Контента</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Огромная библиотека фильмов, сериалов, мультфильмов и аниме с русской озвучкой
                </p>
              </div>
              <div className="glass-hover p-8 rounded-3xl border-white/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-6">
                  <Icon name="Users" size={32} className="text-secondary" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Совместный просмотр</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Смотрите фильмы с друзьями в реальном времени с видео и голосовым чатом
                </p>
              </div>
              <div className="glass-hover p-8 rounded-3xl border-white/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6">
                  <Icon name="Sparkles" size={32} className="text-accent" />
                </div>
                <h4 className="text-2xl font-bold mb-3">AI-рекомендации</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Умные персональные подборки на основе ваших предпочтений и настроения
                </p>
              </div>
            </div>
          </>
        )}
      </section>

      <footer className="glass border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                  <Icon name="Play" size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Taloka
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Умный онлайн-кинотеатр нового поколения с социальными функциями
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Разделы</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Главная</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Каталог</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Подборки</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Новинки</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Категории</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-secondary transition-colors">Фильмы</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Сериалы</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Мультфильмы</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Аниме</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Социальные сети</h4>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl glass-hover flex items-center justify-center cursor-pointer">
                  <Icon name="Instagram" size={20} />
                </div>
                <div className="w-10 h-10 rounded-xl glass-hover flex items-center justify-center cursor-pointer">
                  <Icon name="Twitter" size={20} />
                </div>
                <div className="w-10 h-10 rounded-xl glass-hover flex items-center justify-center cursor-pointer">
                  <Icon name="Youtube" size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2024 Taloka. Powered by TMDB & Lumex</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
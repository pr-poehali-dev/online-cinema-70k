import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { tmdbApi, getImageUrl, getLumexUrl, type Content, type Movie, type TVShow } from '@/lib/tmdb';

const Watch = () => {
  const { mediaType, id } = useParams<{ mediaType: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<Movie | TVShow | null>(null);
  const [similar, setSimilar] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mediaType && id) {
      loadContent();
    }
  }, [mediaType, id]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const details = await tmdbApi.getDetails(Number(id), mediaType!);
      setContent(details);
      
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${id}/similar?api_key=2c806e0ce14975fe836832ea8668d6d1&language=ru-RU`
      );
      const data = await response.json();
      setSimilar(data.results?.slice(0, 10) || []);
    } catch (error) {
      console.error('Error loading content:', error);
    }
    setLoading(false);
  };

  const getTitle = (item: Movie | TVShow) => {
    return 'title' in item ? item.title : item.name;
  };

  const getReleaseYear = (item: Movie | TVShow) => {
    const date = 'release_date' in item ? item.release_date : item.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  const handleSimilarClick = (item: Content) => {
    const type = 'title' in item ? 'movie' : 'tv';
    navigate(`/watch/${type}/${item.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Контент не найден</h2>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="glass-hover">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Icon name="Play" size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Taloka
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="glass-hover">
              <Icon name="Heart" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="glass-hover">
              <Icon name="Share2" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <div className="relative">
        <div className="absolute inset-0 z-0">
          <img
            src={getImageUrl(content.backdrop_path, 'original')}
            alt={getTitle(content)}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="aspect-video w-full max-w-6xl mx-auto mb-8 rounded-2xl overflow-hidden glass border-white/10">
            <iframe
              src={getLumexUrl(Number(id), mediaType!)}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="glass-hover p-8 rounded-3xl border-white/10 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <img
                    src={getImageUrl(content.poster_path, 'w500')}
                    alt={getTitle(content)}
                    className="w-full rounded-2xl"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-start gap-4 mb-4">
                    <h2 className="text-4xl md:text-5xl font-bold flex-1">
                      {getTitle(content)}
                    </h2>
                    <Badge className="glass bg-accent/90 border-0 text-xl px-4 py-2">
                      <Icon name="Star" size={20} className="mr-2" />
                      {content.vote_average.toFixed(1)}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge variant="outline" className="border-white/20 text-base px-3 py-1">
                      {getReleaseYear(content)}
                    </Badge>
                    {'runtime' in content && content.runtime && (
                      <Badge variant="outline" className="border-white/20 text-base px-3 py-1">
                        <Icon name="Clock" size={16} className="mr-1" />
                        {content.runtime} мин
                      </Badge>
                    )}
                    {content.genres?.map((genre) => (
                      <Badge key={genre.id} variant="outline" className="border-white/20 text-base px-3 py-1">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {content.overview || 'Описание отсутствует'}
                  </p>

                  <div className="flex gap-4 flex-wrap">
                    <Button className="glass-hover bg-gradient-to-r from-primary to-secondary border-0">
                      <Icon name="Users" size={20} className="mr-2" />
                      Смотреть с друзьями
                    </Button>
                    <Button className="glass-hover border-white/20">
                      <Icon name="Plus" size={20} className="mr-2" />
                      В избранное
                    </Button>
                    <Button className="glass-hover border-white/20">
                      <Icon name="Download" size={20} className="mr-2" />
                      Скачать
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {similar.length > 0 && (
              <div>
                <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                  Похожее
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {similar.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSimilarClick(item)}
                      className="group relative rounded-2xl overflow-hidden glass-hover cursor-pointer"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={getImageUrl(item.poster_path, 'w500')}
                          alt={'title' in item ? item.title : item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full glass-hover bg-primary/80 flex items-center justify-center">
                              <Icon name="Play" size={28} />
                            </div>
                          </div>
                        </div>
                        <Badge className="absolute top-3 right-3 glass bg-accent/90 border-0 text-sm">
                          <Icon name="Star" size={12} className="mr-1" />
                          {item.vote_average.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="p-3 bg-card/60 backdrop-blur-sm">
                        <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {'title' in item ? item.title : item.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const categories = [
  { name: 'Все', icon: 'Grid3x3' },
  { name: 'Фильмы', icon: 'Film' },
  { name: 'Сериалы', icon: 'Tv' },
  { name: 'Мультфильмы', icon: 'Sparkles' },
  { name: 'Аниме', icon: 'Heart' },
];

const movies = [
  {
    id: 1,
    title: 'Интерстеллар',
    year: 2014,
    rating: 8.9,
    genre: 'Фантастика',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Начало',
    year: 2010,
    rating: 8.8,
    genre: 'Триллер',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Темный рыцарь',
    year: 2008,
    rating: 9.0,
    genre: 'Боевик',
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
  },
  {
    id: 4,
    title: 'Побег из Шоушенка',
    year: 1994,
    rating: 9.3,
    genre: 'Драма',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
  },
  {
    id: 5,
    title: 'Форрест Гамп',
    year: 1994,
    rating: 8.8,
    genre: 'Драма',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
  },
  {
    id: 6,
    title: 'Матрица',
    year: 1999,
    rating: 8.7,
    genre: 'Фантастика',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
  },
  {
    id: 7,
    title: 'Зеленая миля',
    year: 1999,
    rating: 8.9,
    genre: 'Драма',
    image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
  },
  {
    id: 8,
    title: 'Криминальное чтиво',
    year: 1994,
    rating: 8.9,
    genre: 'Криминал',
    image: 'https://images.unsplash.com/photo-1574267432644-f610a4ab528b?w=400&h=600&fit=crop',
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Film" size={32} className="text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              CinemaX
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Главная</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Каталог</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Подборки</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">О нас</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Контакты</a>
          </nav>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
            <Icon name="User" size={18} className="mr-2" />
            Войти
          </Button>
        </div>
      </header>

      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cdn.poehali.dev/projects/a7d1dd82-b2fc-4946-a366-cf53e5c6670f/files/d6a90d4d-24d8-49e3-8113-84a6c7ae0df4.jpg"
            alt="Cinema"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            70 000+ Фильмов
          </h2>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Смотрите лучшие фильмы, сериалы, мультфильмы и аниме в одном месте
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-lg px-8 hover:scale-105 transition-transform">
              <Icon name="Play" size={20} className="mr-2" />
              Начать просмотр
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-2 hover:bg-accent hover:border-accent hover:scale-105 transition-all">
              <Icon name="Info" size={20} className="mr-2" />
              Узнать больше
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск фильмов, сериалов, актёров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border text-lg"
            />
          </div>
          <Button size="lg" className="bg-accent hover:bg-accent/90">
            <Icon name="SlidersHorizontal" size={20} className="mr-2" />
            Фильтры
          </Button>
        </div>

        <div className="flex gap-3 mb-12 overflow-x-auto pb-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center gap-2 whitespace-nowrap transition-all ${
                selectedCategory === category.name
                  ? 'bg-gradient-to-r from-primary to-secondary scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <Icon name={category.icon as any} size={18} />
              {category.name}
            </Button>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Icon name="TrendingUp" size={28} className="text-accent" />
            Популярное сейчас
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="lg" className="bg-primary/90 backdrop-blur-sm hover:bg-primary">
                        <Icon name="Play" size={24} />
                      </Button>
                    </div>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-bold">
                    <Icon name="Star" size={14} className="mr-1" />
                    {movie.rating}
                  </Badge>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{movie.year}</span>
                    <Badge variant="outline" className="text-xs">
                      {movie.genre}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all hover:scale-105 animate-fade-in">
            <Icon name="Tv" size={48} className="text-primary mb-4" />
            <h4 className="text-2xl font-bold mb-3">70 000+ Контента</h4>
            <p className="text-muted-foreground">
              Огромная библиотека фильмов, сериалов, мультфильмов и аниме на любой вкус
            </p>
          </div>
          <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 p-8 rounded-2xl border border-secondary/20 hover:border-secondary/40 transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Icon name="Zap" size={48} className="text-secondary mb-4" />
            <h4 className="text-2xl font-bold mb-3">HD Качество</h4>
            <p className="text-muted-foreground">
              Смотрите в высоком качестве без задержек и буферизации
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-8 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Icon name="Heart" size={48} className="text-accent mb-4" />
            <h4 className="text-2xl font-bold mb-3">Персональные подборки</h4>
            <p className="text-muted-foreground">
              Получайте рекомендации на основе ваших предпочтений
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Film" size={28} className="text-primary" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CinemaX
                </h3>
              </div>
              <p className="text-muted-foreground">
                Ваш лучший онлайн-кинотеатр с огромной коллекцией контента
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Разделы</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Главная</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Каталог</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Подборки</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Новинки</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Категории</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-secondary transition-colors">Фильмы</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Сериалы</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Мультфильмы</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Аниме</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@cinemax.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (999) 123-45-67
                </li>
                <li className="flex items-center gap-2 mt-4">
                  <Icon name="Instagram" size={20} className="hover:text-accent cursor-pointer transition-colors" />
                  <Icon name="Twitter" size={20} className="hover:text-accent cursor-pointer transition-colors" />
                  <Icon name="Youtube" size={20} className="hover:text-accent cursor-pointer transition-colors" />
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2024 CinemaX. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

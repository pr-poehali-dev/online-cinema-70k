import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { tmdbApi } from '@/lib/tmdb';

interface Genre {
  id: number;
  name: string;
}

interface FiltersDialogProps {
  onApplyFilters: (filters: {
    genres: number[];
    yearFrom: number;
    yearTo: number;
    ratingFrom: number;
  }) => void;
  mediaType: 'movie' | 'tv';
}

const FiltersDialog = ({ onApplyFilters, mediaType }: FiltersDialogProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [yearRange, setYearRange] = useState([1990, new Date().getFullYear()]);
  const [ratingFrom, setRatingFrom] = useState([0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadGenres();
  }, [mediaType]);

  const loadGenres = async () => {
    const genresList = await tmdbApi.getGenres(mediaType);
    setGenres(genresList);
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      genres: selectedGenres,
      yearFrom: yearRange[0],
      yearTo: yearRange[1],
      ratingFrom: ratingFrom[0],
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setYearRange([1990, new Date().getFullYear()]);
    setRatingFrom([0]);
    onApplyFilters({
      genres: [],
      yearFrom: 1990,
      yearTo: new Date().getFullYear(),
      ratingFrom: 0,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="glass-hover border-white/10">
          <Icon name="SlidersHorizontal" size={20} className="mr-2" />
          Фильтры
          {(selectedGenres.length > 0 || ratingFrom[0] > 0) && (
            <Badge className="ml-2 bg-primary border-0 text-xs px-2">
              {selectedGenres.length + (ratingFrom[0] > 0 ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="glass border-white/10 w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Фильтры поиска
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="Film" size={20} className="text-primary" />
              Жанры
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`cursor-pointer transition-all ${
                    selectedGenres.includes(genre.id)
                      ? 'bg-gradient-to-r from-primary to-secondary border-0'
                      : 'glass-hover border-white/20 bg-transparent'
                  }`}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="Calendar" size={20} className="text-secondary" />
              Год выпуска
            </h3>
            <div className="glass-hover p-6 rounded-2xl border-white/10">
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-muted-foreground">От</span>
                <span className="font-bold text-primary">{yearRange[0]}</span>
                <span className="text-muted-foreground">До</span>
                <span className="font-bold text-primary">{yearRange[1]}</span>
              </div>
              <Slider
                min={1950}
                max={new Date().getFullYear()}
                step={1}
                value={yearRange}
                onValueChange={setYearRange}
                className="mb-2"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="Star" size={20} className="text-accent" />
              Минимальный рейтинг
            </h3>
            <div className="glass-hover p-6 rounded-2xl border-white/10">
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-muted-foreground">Рейтинг от</span>
                <span className="font-bold text-accent">{ratingFrom[0].toFixed(1)}</span>
              </div>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={ratingFrom}
                onValueChange={setRatingFrom}
                className="mb-2"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 sticky bottom-0 bg-background/80 backdrop-blur-lg py-4">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 glass-hover border-white/20"
          >
            Сбросить
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 glass-hover bg-gradient-to-r from-primary to-secondary border-0"
          >
            Применить
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersDialog;

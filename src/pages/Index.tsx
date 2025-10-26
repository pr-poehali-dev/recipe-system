import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { recipes, Recipe } from '@/data/recipes';
import RecipeModal from '@/components/RecipeModal';
import RecipeFilters, { FilterOptions } from '@/components/RecipeFilters';

const categories = [
  { name: 'Все рецепты', icon: 'ChefHat' },
  { name: 'Слойки', icon: 'Croissant' },
  { name: 'Пироги', icon: 'PieChart' },
  { name: 'Печенье', icon: 'Cookie' },
  { name: 'Торты', icon: 'Cake' }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все рецепты');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [userRatings, setUserRatings] = useState<Map<number, number>>(new Map());
  const [filters, setFilters] = useState<FilterOptions>({
    maxTime: 180,
    difficulty: [],
    tags: [],
    sortBy: 'rating'
  });

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    const savedRatings = localStorage.getItem('userRatings');
    if (savedRatings) {
      setUserRatings(new Map(Object.entries(JSON.parse(savedRatings)).map(([k, v]) => [Number(k), v as number])));
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const handleRate = (id: number, rating: number) => {
    setUserRatings(prev => {
      const newRatings = new Map(prev);
      newRatings.set(id, rating);
      const obj = Object.fromEntries(newRatings);
      localStorage.setItem('userRatings', JSON.stringify(obj));
      return newRatings;
    });
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Все рецепты' || recipe.category === selectedCategory;
    const matchesTime = recipe.totalTime <= filters.maxTime;
    const matchesDifficulty = filters.difficulty.length === 0 || filters.difficulty.includes(recipe.difficulty);
    const matchesTags = filters.tags.length === 0 || filters.tags.some(tag => recipe.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTime && matchesDifficulty && matchesTags;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'time':
        return a.totalTime - b.totalTime;
      case 'difficulty':
        const diffOrder = { 'легко': 1, 'средне': 2, 'сложно': 3 };
        return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const activeFiltersCount = 
    (filters.maxTime < 180 ? 1 : 0) + 
    filters.difficulty.length + 
    filters.tags.length;

  const difficultyColors = {
    'легко': 'bg-green-100 text-green-700',
    'средне': 'bg-yellow-100 text-yellow-700',
    'сложно': 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary to-accent/20 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-primary leading-tight tracking-tight">
                  ПЕЧЕм<br />КАК ДЫШИ
                </h1>
                <p className="text-xl md:text-2xl text-foreground/80 max-w-lg font-medium">
                  Превратите самые простые<br />ингредиенты в шедевры.<br />Мы поможем.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Найти по названию или ингредиентам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 focus:border-primary rounded-xl"
                  />
                </div>
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg font-semibold rounded-xl"
                  onClick={() => {
                    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
                    setSelectedRecipe(randomRecipe);
                  }}
                >
                  <Icon name="Shuffle" className="mr-2" size={20} />
                  Случайный рецепт
                </Button>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <img 
                src="https://cdn.poehali.dev/projects/9977a5f9-8a55-4bd0-952d-9a6dbd17e3e4/files/543af566-5d57-40b3-ab1b-2c5110177f11.jpg" 
                alt="Синнабоны"
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">Категории</h2>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4 h-auto bg-transparent mb-12">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.name}
                  value={cat.name}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card hover:bg-accent/50 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-lg"
                >
                  <Icon name={cat.icon as any} size={32} />
                  <span className="font-semibold text-sm">{cat.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              {selectedCategory === 'Все рецепты' ? 'Популярные рецепты' : selectedCategory}
            </h2>
            <RecipeFilters 
              onFilterChange={setFilters} 
              activeFiltersCount={activeFiltersCount}
            />
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="Search" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">Рецепты не найдены</h3>
              <p className="text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-2xl relative group"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <CardHeader className="p-0">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge className={difficultyColors[recipe.difficulty]}>
                          {recipe.difficulty}
                        </Badge>
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className={`absolute top-4 left-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                          favorites.has(recipe.id) ? 'opacity-100 bg-red-100' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(recipe.id);
                        }}
                      >
                        <Icon
                          name="Heart"
                          size={18}
                          className={favorites.has(recipe.id) ? 'fill-red-500 text-red-500' : ''}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">{recipe.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        <span>{recipe.totalTime} мин</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Users" size={16} />
                        <span>{recipe.servings} порций</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                        <span>{recipe.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {recipe.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recipe.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full rounded-xl" size="lg">
                      Смотреть рецепт
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="text-sm px-4 py-2">Сезонное предложение</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                Осенние десерты
              </h2>
              <p className="text-xl text-foreground/80">
                Тёплые ароматные выпечки с яблоками, тыквой и корицей. 
                Идеально для уютных осенних вечеров!
              </p>
              <Button size="lg" className="rounded-xl" onClick={() => setSelectedCategory('Пироги')}>
                Посмотреть коллекцию
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {recipes.slice(0, 2).map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="overflow-hidden hover:shadow-lg transition-all rounded-2xl cursor-pointer"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h4 className="font-bold text-sm line-clamp-2">{recipe.title}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">О нас</h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Мы — команда энтузиастов, влюблённых в выпечку. Наша миссия — 
            сделать домашнюю выпечку доступной каждому. Здесь вы найдёте 
            проверенные рецепты, пошаговые инструкции и вдохновение для 
            создания кулинарных шедевров.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="outline" size="lg" className="rounded-xl">
              <Icon name="Instagram" className="mr-2" size={20} />
              Instagram
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl">
              <Icon name="Youtube" className="mr-2" size={20} />
              YouTube
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl">
              <Icon name="Mail" className="mr-2" size={20} />
              Написать нам
            </Button>
          </div>
        </div>
      </section>

      {favorites.size > 0 && (
        <Button
          size="icon"
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl z-40"
          onClick={() => {
            const favoriteRecipes = recipes.filter(r => favorites.has(r.id));
            if (favoriteRecipes.length > 0) {
              setSelectedRecipe(favoriteRecipes[0]);
            }
          }}
        >
          <div className="relative">
            <Icon name="Heart" size={24} className="fill-white" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center rounded-full">
              {favorites.size}
            </Badge>
          </div>
        </Button>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onToggleFavorite={toggleFavorite}
          isFavorite={favorites.has(selectedRecipe.id)}
          onRate={handleRate}
          userRating={userRatings.get(selectedRecipe.id)}
        />
      )}
    </div>
  );
}

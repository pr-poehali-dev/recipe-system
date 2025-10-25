import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  time: number;
  difficulty: 'легко' | 'средне' | 'сложно';
  servings: number;
  rating: number;
  category: string;
  ingredients: string[];
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: 'Синнабоны с корицей',
    description: 'Воздушные булочки с ароматной корицей и нежным кремом',
    image: 'https://cdn.poehali.dev/projects/9977a5f9-8a55-4bd0-952d-9a6dbd17e3e4/files/543af566-5d57-40b3-ab1b-2c5110177f11.jpg',
    time: 90,
    difficulty: 'средне',
    servings: 8,
    rating: 5,
    category: 'Слойки',
    ingredients: ['мука', 'молоко', 'корица', 'сливочный сыр']
  },
  {
    id: 2,
    title: 'Яблочный пирог',
    description: 'Классический пирог с сочной яблочной начинкой',
    image: 'https://cdn.poehali.dev/projects/9977a5f9-8a55-4bd0-952d-9a6dbd17e3e4/files/4e42097f-8f21-4948-be70-932a90f8ff3c.jpg',
    time: 60,
    difficulty: 'легко',
    servings: 6,
    rating: 5,
    category: 'Пироги',
    ingredients: ['яблоки', 'мука', 'сахар', 'корица']
  },
  {
    id: 3,
    title: 'Ассорти круассанов',
    description: 'Слоистые французские круассаны с разными начинками',
    image: 'https://cdn.poehali.dev/projects/9977a5f9-8a55-4bd0-952d-9a6dbd17e3e4/files/32d62afd-b192-4cfb-a704-b2d646648ae4.jpg',
    time: 120,
    difficulty: 'сложно',
    servings: 10,
    rating: 5,
    category: 'Слойки',
    ingredients: ['мука', 'масло', 'дрожжи', 'шоколад']
  }
];

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
  const [servings, setServings] = useState<number>(8);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все рецепты' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                    placeholder="Найти рецепт..."
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
                    setServings(randomRecipe.servings);
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
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-primary">
            {selectedCategory === 'Все рецепты' ? 'Популярные рецепты' : selectedCategory}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-2xl"
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setServings(recipe.servings);
                }}
              >
                <CardHeader className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className={difficultyColors[recipe.difficulty]}>
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">{recipe.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={16} />
                      <span>{recipe.time} мин</span>
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
                    {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {ing}
                      </Badge>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{recipe.ingredients.length - 3}
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
              <Button size="lg" className="rounded-xl">
                Посмотреть коллекцию
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {recipes.slice(0, 2).map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-all rounded-2xl">
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
          <div className="flex justify-center gap-4">
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

      {selectedRecipe && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelectedRecipe(null)}
        >
          <Card 
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="p-0 relative">
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title}
                className="w-full h-80 object-cover"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 rounded-full"
                onClick={() => setSelectedRecipe(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-2">{selectedRecipe.title}</h2>
                <p className="text-lg text-muted-foreground">{selectedRecipe.description}</p>
              </div>

              <div className="flex gap-4 flex-wrap">
                <Badge className={difficultyColors[selectedRecipe.difficulty]}>
                  {selectedRecipe.difficulty}
                </Badge>
                <Badge variant="secondary">
                  <Icon name="Clock" size={14} className="mr-1" />
                  {selectedRecipe.time} минут
                </Badge>
                <Badge variant="secondary">
                  <Icon name="Star" size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                  {selectedRecipe.rating}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-lg font-semibold">Порций:</label>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="text-xl font-bold w-12 text-center">{servings}</span>
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => setServings(servings + 1)}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {servings === selectedRecipe.servings ? 'По рецепту' : `×${(servings / selectedRecipe.servings).toFixed(1)}`}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Ингредиенты</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <Icon name="Check" size={18} className="text-primary" />
                        <span className="text-lg">{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 rounded-xl" size="lg">
                  <Icon name="Heart" className="mr-2" size={20} />
                  В избранное
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl" size="lg">
                  <Icon name="Share2" className="mr-2" size={20} />
                  Поделиться
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

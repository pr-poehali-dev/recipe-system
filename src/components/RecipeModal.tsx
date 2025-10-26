import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Recipe } from '@/data/recipes';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
  onRate: (id: number, rating: number) => void;
  userRating?: number;
}

export default function RecipeModal({
  recipe,
  onClose,
  onToggleFavorite,
  isFavorite,
  onRate,
  userRating
}: RecipeModalProps) {
  const [servings, setServings] = useState(recipe.servings);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [hoverRating, setHoverRating] = useState(0);

  const multiplier = servings / recipe.servings;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            playNotificationSound();
            setActiveTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timeLeft]);

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUA0PVq/n77BdGAg+ltryxnMpBSuAzvLaizsIHGS36+OaUxALTKXh8bllHAU2jdTyy3kqBSh+zPDdkUAKFluz6O2oVhULR53e8r9uIgU1htDy04U0Bx5qvO7kmFIOD1Ks5O+wXxcIPpXa8sdyKQUrfs3w3I9ACRVZsujuqVYVC0ed3vK/biIFNYbQ8tOFNAcearzv5ZhTDg9SrOTvsl4WBz6U2vLIcikFK37N8NyPQAkVWbLo7qlWFQtHnd7yv24iBTWG0PLThTQHHmq87+WYUw4PUqzk77JeFgc+lNryynIpBSt+zfDcj0AJFVmy6O6pVhULR53e8r9uIgU1htDy04U0Bx5qvO/lmFMOD1Ks5O+yXhYHPpTa8spyKQUrfs3w3I9ACRVZsujuqVYVC0ed3vK/biIFNYbQ8tOFNAcearzv5ZhTDg9SrOTvsl4WBz6U2vLKcikFK37N8NyPQAkVWbLo7qlWFQtHnd7yv24iBTWG0PLThTQHHmq87+WYUw4PUqzk77JeFgc+lNryynIpBSt+zfDcj0AJFVmy6O6pVhULR53e8r9uIgU1htDy04U0Bx5qvO/lmFMOD1Ks5O+yXhYHPpTa8spyKQUrfs3w3I9ACRVZsujuqVYVC0ed3vK/biIFNYbQ8tOFNAcearzv5ZhTDg9SrOTvsl4WBz6U2vLKcikFK37N8NyPQAkVWbLo7qlWFQtHnd7yv24iBTWG0PLThTQHHmq87+WYUw4PUqzk77JeFgc+lNryynIpBSt+zfDcj0AJFVmy6O6pVhULR53e8r9uIgU1htDy04U0Bx5qvO/lmFMOD1Ks5O+yXhYHPpTa8spyKQUrfs3w3I9ACRVZsujuqVYVC0ed3vK/biIFNYbQ8tOFNAcearzv5ZhTDg9SrOTvsl4WBz6U2vLKcikFK37N8NyPQAkVWbLo7qlWFQtHnd7yv24iBTWG0PLThTQHHmq87+WYUw4PUqzk77JeFgc+lNryynIpBSt+zfDcj0AJFVmy6O6pVhULR53e8r9uIgU1htDy04U0Bx5qvO/lmFMOD1Ks5O+yXhYHPpTa8spyKQUrfs3w3I9ACRVZsujuqVYVC0ed3vK/biIFNYbQ8tOFNAcearzv5ZhTDg9SrOTvsl4WBz6U2vLKcikFK37N8NyPQAkVWbLo7qlWFQ==');
    audio.play().catch(() => {});
  };

  const startTimer = (stepId: number, duration: number) => {
    setActiveTimer(stepId);
    setTimeLeft(duration * 60);
  };

  const stopTimer = () => {
    setActiveTimer(null);
    setTimeLeft(0);
  };

  const toggleStepComplete = (stepId: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (completedSteps.size / recipe.steps.length) * 100;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href
        });
      } catch (err) {}
    }
  };

  const difficultyColors = {
    'легко': 'bg-green-100 text-green-700',
    'средне': 'bg-yellow-100 text-yellow-700',
    'сложно': 'bg-red-100 text-red-700'
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <Card
        className="max-w-4xl w-full max-h-[95vh] overflow-y-auto animate-scale-in rounded-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="p-0 relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-80 object-cover"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 rounded-full shadow-lg"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={`absolute top-4 left-4 rounded-full shadow-lg ${isFavorite ? 'bg-red-100' : ''}`}
            onClick={() => onToggleFavorite(recipe.id)}
          >
            <Icon
              name="Heart"
              size={20}
              className={isFavorite ? 'fill-red-500 text-red-500' : ''}
            />
          </Button>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-lg text-muted-foreground">{recipe.description}</p>
          </div>

          <div className="flex gap-4 flex-wrap items-center">
            <Badge className={difficultyColors[recipe.difficulty]}>
              {recipe.difficulty}
            </Badge>
            <Badge variant="secondary">
              <Icon name="Clock" size={14} className="mr-1" />
              {recipe.totalTime} мин
            </Badge>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRate(recipe.id, star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="hover:scale-110 transition-transform"
                >
                  <Icon
                    name="Star"
                    size={20}
                    className={
                      star <= (hoverRating || userRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {recipe.rating} ({recipe.ratingsCount})
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {recipe.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold">Порций:</label>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                >
                  <Icon name="Minus" size={16} />
                </Button>
                <span className="text-2xl font-bold w-16 text-center">{servings}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setServings(servings + 1)}
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
              {servings !== recipe.servings && (
                <Badge variant="secondary">×{multiplier.toFixed(1)}</Badge>
              )}
            </div>
          </div>

          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ingredients">Ингредиенты</TabsTrigger>
              <TabsTrigger value="steps">
                Приготовление
                {progress > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {Math.round(progress)}%
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="space-y-3 mt-6">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="Check" size={18} className="text-primary" />
                    <span className="text-lg">{ing.name}</span>
                  </div>
                  <span className="font-semibold">
                    {(ing.amount * multiplier).toFixed(ing.unit === 'г' || ing.unit === 'мл' ? 0 : 1)}{' '}
                    {ing.unit}
                  </span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="steps" className="space-y-4 mt-6">
              {progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Прогресс</span>
                    <span>{completedSteps.size} из {recipe.steps.length}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {recipe.steps.map((step) => (
                <Card
                  key={step.id}
                  className={`p-4 transition-all ${
                    completedSteps.has(step.id) ? 'bg-primary/5 border-primary' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <Button
                      size="icon"
                      variant={completedSteps.has(step.id) ? 'default' : 'outline'}
                      className="rounded-full flex-shrink-0"
                      onClick={() => toggleStepComplete(step.id)}
                    >
                      {completedSteps.has(step.id) ? (
                        <Icon name="Check" size={18} />
                      ) : (
                        <span className="font-bold">{step.id}</span>
                      )}
                    </Button>

                    <div className="flex-1 space-y-3">
                      <p className={completedSteps.has(step.id) ? 'line-through text-muted-foreground' : ''}>
                        {step.text}
                      </p>

                      {step.timer && (
                        <div className="flex items-center gap-3">
                          {activeTimer === step.id ? (
                            <>
                              <div className="flex items-center gap-2 flex-1">
                                <Icon name="Timer" size={16} className="text-primary animate-pulse" />
                                <span className="font-mono font-bold text-lg">
                                  {formatTime(timeLeft)}
                                </span>
                              </div>
                              <Button size="sm" variant="outline" onClick={stopTimer}>
                                <Icon name="Square" size={14} className="mr-1" />
                                Стоп
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startTimer(step.id, step.timer!)}
                            >
                              <Icon name="Timer" size={14} className="mr-1" />
                              Запустить таймер ({step.timer} мин)
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {recipe.tips && recipe.tips.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Icon name="Lightbulb" size={20} className="text-primary" />
                  Советы
                </h3>
                <ul className="space-y-2">
                  {recipe.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                      <Icon name="ChefHat" size={16} className="text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 rounded-xl" size="lg" onClick={handlePrint}>
              <Icon name="Printer" className="mr-2" size={20} />
              Печать
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl" size="lg" onClick={handleShare}>
              <Icon name="Share2" className="mr-2" size={20} />
              Поделиться
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

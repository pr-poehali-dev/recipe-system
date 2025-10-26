import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface FilterOptions {
  maxTime: number;
  difficulty: string[];
  tags: string[];
  sortBy: string;
}

interface RecipeFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFiltersCount: number;
}

export default function RecipeFilters({ onFilterChange, activeFiltersCount }: RecipeFiltersProps) {
  const [maxTime, setMaxTime] = useState<number[]>([180]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('rating');

  const difficulties = ['легко', 'средне', 'сложно'];
  const dietaryTags = [
    'без глютена',
    'без лактозы',
    'веганские',
    'без сахара',
    'низкокалорийные'
  ];

  const sortOptions = [
    { value: 'rating', label: 'По рейтингу', icon: 'Star' },
    { value: 'time', label: 'По времени', icon: 'Clock' },
    { value: 'difficulty', label: 'По сложности', icon: 'TrendingUp' },
    { value: 'newest', label: 'Новые', icon: 'Calendar' }
  ];

  const handleDifficultyToggle = (diff: string) => {
    const updated = selectedDifficulty.includes(diff)
      ? selectedDifficulty.filter(d => d !== diff)
      : [...selectedDifficulty, diff];
    setSelectedDifficulty(updated);
    applyFilters({ difficulty: updated });
  };

  const handleTagToggle = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
    applyFilters({ tags: updated });
  };

  const handleTimeChange = (value: number[]) => {
    setMaxTime(value);
    applyFilters({ maxTime: value[0] });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters({ sortBy: value });
  };

  const applyFilters = (updates: Partial<FilterOptions>) => {
    onFilterChange({
      maxTime: updates.maxTime !== undefined ? updates.maxTime : maxTime[0],
      difficulty: updates.difficulty !== undefined ? updates.difficulty : selectedDifficulty,
      tags: updates.tags !== undefined ? updates.tags : selectedTags,
      sortBy: updates.sortBy !== undefined ? updates.sortBy : sortBy
    });
  };

  const resetFilters = () => {
    setMaxTime([180]);
    setSelectedDifficulty([]);
    setSelectedTags([]);
    setSortBy('rating');
    onFilterChange({
      maxTime: 180,
      difficulty: [],
      tags: [],
      sortBy: 'rating'
    });
  };

  return (
    <div className="flex gap-3 flex-wrap items-center">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange(option.value)}
            className="rounded-full whitespace-nowrap"
          >
            <Icon name={option.icon as any} size={14} className="mr-1" />
            {option.label}
          </Button>
        ))}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full relative">
            <Icon name="SlidersHorizontal" size={14} className="mr-1" />
            Фильтры
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">Фильтры</SheetTitle>
            <SheetDescription>
              Найдите идеальный рецепт
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8 mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Время приготовления</Label>
                <Badge variant="secondary">{maxTime[0]} мин</Badge>
              </div>
              <Slider
                value={maxTime}
                onValueChange={handleTimeChange}
                max={180}
                min={15}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>15 мин</span>
                <span>3 часа</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Сложность</Label>
              <div className="space-y-3">
                {difficulties.map((diff) => (
                  <div key={diff} className="flex items-center space-x-3">
                    <Checkbox
                      id={`diff-${diff}`}
                      checked={selectedDifficulty.includes(diff)}
                      onCheckedChange={() => handleDifficultyToggle(diff)}
                    />
                    <Label
                      htmlFor={`diff-${diff}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Диетические ограничения</Label>
              <div className="space-y-3">
                {dietaryTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-3">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={resetFilters}
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Сбросить фильтры
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

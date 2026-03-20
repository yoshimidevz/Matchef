import { useState, useMemo, useCallback } from "react";
import { recipes, type Recipe } from "../data/recipe";

export interface MatchedRecipe extends Recipe {
  matchCount: number;
  matchPercent: number;
  missingIngredients: string[];
}

export function useMatchChef() {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [activeVibes, setActiveVibes] = useState<Set<string>>(new Set());
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [completedRecipes, setCompletedRecipes] = useState<number>(0);

  const toggleIngredient = useCallback((id: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleVibe = useCallback((id: string) => {
    setActiveVibes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const addToShoppingList = useCallback((items: string[]) => {
    setShoppingList((prev) => [...new Set([...prev, ...items])]);
  }, []);

  const removeFromShoppingList = useCallback((item: string) => {
    setShoppingList((prev) => prev.filter((i) => i !== item));
  }, []);

  const completeRecipe = useCallback(() => {
    setCompletedRecipes((c) => c + 1);
  }, []);

  const chefLevel = useMemo(() => {
    if (completedRecipes >= 20) return { level: 5, titleKey: "chef.master",    progress: 100 };
    if (completedRecipes >= 15) return { level: 4, titleKey: "chef.sous",      progress: ((completedRecipes - 15) / 5) * 100 };
    if (completedRecipes >= 10) return { level: 3, titleKey: "chef.cook",      progress: ((completedRecipes - 10) / 5) * 100 };
    if (completedRecipes >= 5)  return { level: 2, titleKey: "chef.apprentice",progress: ((completedRecipes - 5) / 5) * 100 };
    return { level: 1, titleKey: "chef.beginner", progress: (completedRecipes / 5) * 100 };
    }, [completedRecipes]);    

  const matchedRecipes = useMemo((): MatchedRecipe[] => {
    if (selectedIngredients.size === 0) return [];
    return recipes
      .map((recipe) => {
        const matchCount = recipe.ingredients.filter((i) => selectedIngredients.has(i)).length;
        const matchPercent = Math.round((matchCount / recipe.ingredients.length) * 100);
        const missingIngredients = recipe.ingredients.filter((i) => !selectedIngredients.has(i));
        return { ...recipe, matchCount, matchPercent, missingIngredients };
      })
      .filter((r) => {
        if (r.matchPercent < 50) return false;
        if (activeVibes.size > 0) return r.vibes.some((v) => activeVibes.has(v));
        return true;
      })
      .sort((a, b) => b.matchPercent - a.matchPercent);
  }, [selectedIngredients, activeVibes]);

  const perfectMatches = useMemo(
    () => matchedRecipes.filter((r) => r.matchPercent === 100),
    [matchedRecipes]
  );

  const almostMatches = useMemo(
    () => matchedRecipes.filter((r) => r.matchPercent < 100 && r.missingIngredients.length <= 2),
    [matchedRecipes]
  );

  return {
    selectedIngredients,
    toggleIngredient,
    activeVibes,
    toggleVibe,
    matchedRecipes,
    perfectMatches,
    almostMatches,
    shoppingList,
    addToShoppingList,
    removeFromShoppingList,
    completedRecipes,
    completeRecipe,
    chefLevel,
  };
}
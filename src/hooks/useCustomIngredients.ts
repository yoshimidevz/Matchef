import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "matchchef:custom-ingredients";

export interface CustomIngredient {
  id: string;        // lowercase, ex: "shoyo"
  name: string;      // como o usuário digitou, ex: "Shoyo"
  category: string;  // ex: "Molhos", "Bebidas"
  alwaysBuy: boolean;
}

export function useCustomIngredients() {
  const [customIngredients, setCustomIngredients] = useState<CustomIngredient[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setCustomIngredients(JSON.parse(raw));
      })
      .finally(() => setLoaded(true));
  }, []);

  const persist = useCallback((list: CustomIngredient[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addCustomIngredient = useCallback((ingredient: CustomIngredient) => {
    setCustomIngredients((prev) => {
      const exists = prev.find((i) => i.id === ingredient.id);
      const next = exists
        ? prev.map((i) => (i.id === ingredient.id ? ingredient : i))
        : [...prev, ingredient];
      persist(next);
      return next;
    });
  }, [persist]);

  const removeCustomIngredient = useCallback((id: string) => {
    setCustomIngredients((prev) => {
      const next = prev.filter((i) => i.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  const updateCustomIngredient = useCallback((id: string, updates: Partial<CustomIngredient>) => {
    setCustomIngredients((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, ...updates } : i));
      persist(next);
      return next;
    });
  }, [persist]);

  const alwaysBuyIds = customIngredients.filter((i) => i.alwaysBuy).map((i) => i.id);
  const customCategories = Array.from(
    new Set(customIngredients.map((i) => i.category).filter(Boolean))
  );

  return {
    customIngredients,
    loaded,
    addCustomIngredient,
    removeCustomIngredient,
    updateCustomIngredient,
    alwaysBuyIds,
    customCategories,
  };
}
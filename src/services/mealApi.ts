import { toApiIngredient } from "../i18n/ingredientMap";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strYoutube: string;
  strTags: string | null;
  ingredients: { ingredient: string; measure: string }[];
}

function parseMealDetail(meal: Record<string, string | null>): MealDetail {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({ ingredient: ing.trim(), measure: measure?.trim() || "" });
    }
  }
  return {
    idMeal: meal.idMeal!,
    strMeal: meal.strMeal!,
    strMealThumb: meal.strMealThumb!,
    strCategory: meal.strCategory || "",
    strArea: meal.strArea || "",
    strInstructions: meal.strInstructions || "",
    strYoutube: meal.strYoutube || "",
    strTags: meal.strTags || null,
    ingredients,
  };
}

export async function searchByIngredient(ingredient: string): Promise<MealSummary[]> {
  const apiIngredient = toApiIngredient(ingredient);
  const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(apiIngredient)}`);
  const data = await res.json();
  return data.meals || [];
}

export async function getMealById(id: string): Promise<MealDetail | null> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
  const data = await res.json();
  if (!data.meals || data.meals.length === 0) return null;
  return parseMealDetail(data.meals[0]);
}

export async function getRandomMeals(count: number = 6): Promise<MealDetail[]> {
  const promises = Array.from({ length: count }, () =>
    fetch(`${BASE_URL}/random.php`).then((r) => r.json())
  );
  const results = await Promise.all(promises);
  return results
    .filter((d) => d.meals && d.meals.length > 0)
    .map((d) => parseMealDetail(d.meals[0]));
}

export async function searchByName(name: string): Promise<MealDetail[]> {
  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
  const data = await res.json();
  if (!data.meals) return [];
  return data.meals.map(parseMealDetail);
}
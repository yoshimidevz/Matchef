export interface Ingredient {
  id: string;
  name: string;    
  nameEn: string;   
  emoji: string;
  category: IngredientCategory;
}

export type IngredientCategory = "proteinas" | "vegetais" | "despensa" | "temperos";

export const categoryInfo: Record<IngredientCategory, { label: string; labelEn: string }> = {
  proteinas: { label: "🥩 Proteínas",  labelEn: "🥩 Proteins"   },
  vegetais:  { label: "🥬 Vegetais",   labelEn: "🥬 Vegetables" },
  despensa:  { label: "🏪 Despensa",   labelEn: "🏪 Pantry"     },
  temperos:  { label: "🌿 Temperos",   labelEn: "🌿 Seasonings" },
};

export const ingredients: Ingredient[] = [
  { id: "ovo",    name: "Ovo",    nameEn: "Egg",    emoji: "🥚", category: "proteinas" },
  { id: "frango", name: "Frango", nameEn: "Chicken",emoji: "🍗", category: "proteinas" },
  { id: "carne",  name: "Carne",  nameEn: "Beef",   emoji: "🥩", category: "proteinas" },
  { id: "peixe",  name: "Peixe",  nameEn: "Fish",   emoji: "🐟", category: "proteinas" },
  { id: "leite",  name: "Leite",  nameEn: "Milk",   emoji: "🥛", category: "proteinas" },
  { id: "queijo", name: "Queijo", nameEn: "Cheese", emoji: "🧀", category: "proteinas" },

  { id: "tomate",  name: "Tomate",  nameEn: "Tomato",  emoji: "🍅", category: "vegetais" },
  { id: "cebola",  name: "Cebola",  nameEn: "Onion",   emoji: "🧅", category: "vegetais" },
  { id: "alho",    name: "Alho",    nameEn: "Garlic",  emoji: "🧄", category: "vegetais" },
  { id: "batata",  name: "Batata",  nameEn: "Potato",  emoji: "🥔", category: "vegetais" },
  { id: "cenoura", name: "Cenoura", nameEn: "Carrot",  emoji: "🥕", category: "vegetais" },
  { id: "alface",  name: "Alface",  nameEn: "Lettuce", emoji: "🥬", category: "vegetais" },

  { id: "arroz",    name: "Arroz",    nameEn: "Rice",    emoji: "🍚", category: "despensa" },
  { id: "macarrao", name: "Macarrão", nameEn: "Pasta",   emoji: "🍝", category: "despensa" },
  { id: "farinha",  name: "Farinha",  nameEn: "Flour",   emoji: "🌾", category: "despensa" },
  { id: "oleo",     name: "Óleo",     nameEn: "Oil",     emoji: "🫒", category: "despensa" },
  { id: "feijao",   name: "Feijão",   nameEn: "Beans",   emoji: "🫘", category: "despensa" },
  { id: "pao",      name: "Pão",      nameEn: "Bread",   emoji: "🍞", category: "despensa" },
  
  { id: "sal",        name: "Sal",        nameEn: "Salt",     emoji: "🧂", category: "temperos" },
  { id: "pimenta",    name: "Pimenta",    nameEn: "Pepper",   emoji: "🌶️", category: "temperos" },
  { id: "oregano",    name: "Orégano",    nameEn: "Oregano",  emoji: "🌿", category: "temperos" },
  { id: "azeite",     name: "Azeite",     nameEn: "Olive oil",emoji: "🫒", category: "temperos" },
  { id: "limao",      name: "Limão",      nameEn: "Lemon",    emoji: "🍋", category: "temperos" },
  { id: "manjericao", name: "Manjericão", nameEn: "Basil",    emoji: "🌿", category: "temperos" },
];

export function getIngredientName(ing: Ingredient, lang: "pt" | "en"): string {
  return lang === "en" ? ing.nameEn : ing.name;
}

export function getCategoryLabel(cat: IngredientCategory, lang: "pt" | "en"): string {
  return lang === "en" ? categoryInfo[cat].labelEn : categoryInfo[cat].label;
}
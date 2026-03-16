export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: IngredientCategory;
}

export type IngredientCategory = "proteinas" | "vegetais" | "despensa" | "temperos";

export const categoryInfo: Record<IngredientCategory, { label: string }> = {
  proteinas: { label: "🥩 Proteínas" },
  vegetais:  { label: "🥬 Vegetais" },
  despensa:  { label: "🏪 Despensa" },
  temperos:  { label: "🌿 Temperos" },
};

export const ingredients: Ingredient[] = [
  // Proteínas
  { id: "ovo",    name: "Ovo",    emoji: "🥚", category: "proteinas" },
  { id: "frango", name: "Frango", emoji: "🍗", category: "proteinas" },
  { id: "carne",  name: "Carne",  emoji: "🥩", category: "proteinas" },
  { id: "peixe",  name: "Peixe",  emoji: "🐟", category: "proteinas" },
  { id: "leite",  name: "Leite",  emoji: "🥛", category: "proteinas" },
  { id: "queijo", name: "Queijo", emoji: "🧀", category: "proteinas" },
  // Vegetais
  { id: "tomate",  name: "Tomate",  emoji: "🍅", category: "vegetais" },
  { id: "cebola",  name: "Cebola",  emoji: "🧅", category: "vegetais" },
  { id: "alho",    name: "Alho",    emoji: "🧄", category: "vegetais" },
  { id: "batata",  name: "Batata",  emoji: "🥔", category: "vegetais" },
  { id: "cenoura", name: "Cenoura", emoji: "🥕", category: "vegetais" },
  { id: "alface",  name: "Alface",  emoji: "🥬", category: "vegetais" },
  // Despensa
  { id: "arroz",   name: "Arroz",   emoji: "🍚", category: "despensa" },
  { id: "macarrao",name: "Macarrão",emoji: "🍝", category: "despensa" },
  { id: "farinha", name: "Farinha", emoji: "🌾", category: "despensa" },
  { id: "oleo",    name: "Óleo",    emoji: "🫒", category: "despensa" },
  { id: "feijao",  name: "Feijão",  emoji: "🫘", category: "despensa" },
  { id: "pao",     name: "Pão",     emoji: "🍞", category: "despensa" },
  // Temperos
  { id: "sal",        name: "Sal",        emoji: "🧂", category: "temperos" },
  { id: "pimenta",    name: "Pimenta",    emoji: "🌶️", category: "temperos" },
  { id: "oregano",    name: "Orégano",    emoji: "🌿", category: "temperos" },
  { id: "azeite",     name: "Azeite",     emoji: "🫒", category: "temperos" },
  { id: "limao",      name: "Limão",      emoji: "🍋", category: "temperos" },
  { id: "manjericao", name: "Manjericão", emoji: "🌿", category: "temperos" },
];
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Translations ──────────────────────────────────────────────────────────────
export type Language = "pt" | "en";

export type TranslationKey =
  | "header.subtitle"
  | "hero.title_prefix"
  | "hero.title_highlight"
  | "hero.subtitle"
  | "hero.placeholder"
  | "hero.add"
  | "popular.title"
  | "cat.proteins"
  | "cat.vegetables"
  | "cat.pantry"
  | "cat.dairy"
  | "daily.title"
  | "daily.reuse"
  | "nav.search"
  | "nav.community"
  | "nav.profile"
  | "zerowaste.label"
  | "zerowaste.magic_title"
  | "zerowaste.description_prefix"
  | "zerowaste.description_mid"
  | "urgent.tooltip"
  | "cta.see_recipes"
  | "cta.item"
  | "cta.items"
  | "cta.urgent"
  | "cta.urgents"
  | "detail.loading"
  | "detail.ingredients_title"
  | "detail.preparation"
  | "detail.youtube"
  | "detail.not_found"
  | "detail.start_cooking"
  | "substitution.title"
  | "substitution.missing_prefix"
  | "substitution.swap";

export const translations: Record<TranslationKey, Record<Language, string>> = {
  "header.subtitle":              { pt: "Cozinhe com o que você tem", en: "Cook with what you have" },
  "hero.title_prefix":            { pt: "O que você tem", en: "What do you" },
  "hero.title_highlight":         { pt: "na geladeira", en: "have at home" },
  "hero.subtitle":                { pt: "Digite ou selecione os ingredientes que você tem", en: "Type or select the ingredients you have" },
  "hero.placeholder":             { pt: "Ex: frango, arroz, tomate...", en: "E.g.: chicken, rice, tomato..." },
  "hero.add":                     { pt: "Adicionar", en: "Add" },
  "popular.title":                { pt: "Ingredientes populares", en: "Popular ingredients" },
  "cat.proteins":                 { pt: "Proteínas", en: "Proteins" },
  "cat.vegetables":               { pt: "Vegetais", en: "Vegetables" },
  "cat.pantry":                   { pt: "Despensa", en: "Pantry" },
  "cat.dairy":                    { pt: "Laticínios", en: "Dairy" },
  "daily.title":                  { pt: "Receitas do dia", en: "Daily recipes" },
  "daily.reuse":                  { pt: "♻️", en: "♻️" },
  "nav.search":                   { pt: "Buscar", en: "Search" },
  "nav.community":                { pt: "Comunidade", en: "Community" },
  "nav.profile":                  { pt: "Perfil", en: "Profile" },
  "zerowaste.label":              { pt: "Zero Desperdício", en: "Zero Waste" },
  "zerowaste.magic_title":        { pt: "✨ Magia Zero Waste", en: "✨ Zero Waste Magic" },
  "zerowaste.description_prefix": { pt: "Use os", en: "Use the" },
  "zerowaste.description_mid":    { pt: "para fazer", en: "to make" },
  "urgent.tooltip":               { pt: "Marque ingredientes que precisam ser usados logo!", en: "Mark ingredients that need to be used soon!" },
  "cta.see_recipes":              { pt: "Ver receitas", en: "See recipes" },
  "cta.item":                     { pt: "ingrediente", en: "ingredient" },
  "cta.items":                    { pt: "ingredientes", en: "ingredients" },
  "cta.urgent":                   { pt: "urgente", en: "urgent" },
  "cta.urgents":                  { pt: "urgentes", en: "urgent" },
  "detail.loading":               { pt: "Carregando...", en: "Loading..." },
  "detail.ingredients_title":     { pt: "Ingredientes", en: "Ingredients" },
  "detail.preparation":           { pt: "Modo de preparo", en: "Preparation" },
  "detail.youtube":               { pt: "Ver no YouTube", en: "Watch on YouTube" },
  "detail.not_found":             { pt: "Receita não encontrada", en: "Recipe not found" },
  "detail.start_cooking":         { pt: "🍳 Iniciar modo cozinha", en: "🍳 Start cooking mode" },
  "substitution.title":           { pt: "Substituição sugerida", en: "Suggested substitution" },
  "substitution.missing_prefix":  { pt: "Sem", en: "No" },
  "substitution.swap":            { pt: "Tente:", en: "Try:" },
};

// ── Ingredient map (PT) ───────────────────────────────────────────────────────
const ingredientMap: Record<string, string> = {
  chicken: "Frango", beef: "Carne bovina", pork: "Porco", fish: "Peixe", egg: "Ovo",
  onion: "Cebola", garlic: "Alho", tomato: "Tomate", potato: "Batata", carrot: "Cenoura",
  broccoli: "Brócolis", pepper: "Pimentão", lettuce: "Alface",
  rice: "Arroz", pasta: "Macarrão", beans: "Feijão", flour: "Farinha",
  sugar: "Açúcar", salt: "Sal", oil: "Óleo",
  milk: "Leite", butter: "Manteiga", cheese: "Queijo",
};

export function translateIngredient(name: string, lang: Language): string {
  if (lang === "en") return name;
  return ingredientMap[name.toLowerCase()] ?? name;
}

// ── Context ───────────────────────────────────────────────────────────────────
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  tIngredient: (name: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt");

  useEffect(() => {
    AsyncStorage.getItem("matchchef-lang").then((stored) => {
      if (stored === "en" || stored === "pt") setLanguageState(stored);
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem("matchchef-lang", lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[key]?.[language] ?? key,
    [language]
  );

  const tIngredient = useCallback(
    (name: string): string => translateIngredient(name, language),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tIngredient }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
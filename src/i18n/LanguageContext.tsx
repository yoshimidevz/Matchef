import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toDisplayIngredient } from "./ingredientMap";

// ── Translations ──────────────────────────────────────────────────────────────
export type Language = "pt" | "en";

export type TranslationKey = keyof typeof translations;
  

export const translations = {
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
  "nav.pantry": { pt: "Despensa", en: "Pantry" },
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
  "chef.level":                   { pt: "Nível", en: "Level" },
  "despensa.recipes": { pt: "receitas", en: "recipes" },
  "cooking.step":     { pt: "Passo", en: "Step" },
  "cooking.of":       { pt: "de", en: "of" },
  "kitchen.back":     { pt: "Voltar", en: "Back" },
  "kitchen.next":     { pt: "Próximo", en: "Next" },
  "kitchen.finish":   { pt: "Finalizar", en: "Finish" },
  "community.title":        { pt: "Compartilhe suas receitas", en: "Share your recipes" },
  "community.success":      { pt: "Receita publicada com sucesso!", en: "Recipe published successfully!" },
  "community.fail":         { pt: "Falha ao publicar receita. Tente novamente.", en: "Failed to publish recipe. Please try again." },
  "community.recipe_used":  { pt: "Essa receita já foi usada recentemente. Tente outra!", en: "This recipe has already been used recently. Try another one!" },
  "community.photo_alt":    { pt: "Foto da receita", en: "Recipe photo" },
  "comments.title":        { pt: "Comentários", en: "Comments" },
  "comments.empty":        { pt: "Seja o primeiro a comentar!", en: "Be the first to comment!" },
  "comments.placeholder":  { pt: "Escreva seu comentário...", en: "Write your comment..." },
  "create.title":         { pt: "Criar nova receita", en: "Create new recipe" },
  "create.photo_placeholder": { pt: "Tire uma foto ou escolha da galeria", en: "Take a photo or choose from gallery" },
  "create.link_recipe":    { pt: "Link da receita (opcional)", en: "Recipe link (optional)" },
  "create.how_was_it":     { pt: "Como foi sua experiência?", en: "How was your experience?" },
  "create.description":    { pt: "Descrição", en: "Description" },
  "create.description_placeholder": { pt: "Escreva uma descrição para sua receita...", en: "Write a description for your recipe..." },
  "create.publish":       { pt: "Publicar", en: "Publish" },
  "create.published_title": { pt: "Receita publicada!", en: "Recipe published!" },
  "create.published_desc": { pt: "Obrigado por compartilhar sua receita com a comunidade MatchChef!", en: "Thank you for sharing your recipe with the MatchChef community!" },
  "auth.title":          { pt: "Bem-vindo ao MatchChef", en: "Welcome to MatchChef" },
  "auth.subtitle":       { pt: "Faça login para começar a cozinhar com o que você tem!", en: "Log in to start cooking with what you have!" },
  "auth.email":          { pt: "Email", en: "Email" },
  "auth.password":       { pt: "Senha", en: "Password" },
  "auth.login":          { pt: "Entrar", en: "Log In" },
  "profile.posts":       { pt: "Publicações", en: "Posts" },
  "profile.followers":   { pt: "Seguidores", en: "Followers" },
  "profile.following":   { pt: "Seguindo", en: "Following" },
  "profile.edit":        { pt: "Editar perfil", en: "Edit profile" },
  "profile.my_posts":    { pt: "Minhas publicações", en: "My posts" },
  "profile.saved":       { pt: "Receitas salvas", en: "Saved recipes" },
  "profile.saved_label": { pt: "Salvas", en: "Saved" },
  "profile.no_posts":    { pt: "Nenhuma publicação ainda.", en: "No posts yet." },
  "profile.no_saved":    { pt: "Nenhuma receita salva ainda.", en: "No saved recipes yet." },
  "profile.cover_alt":   { pt: "Foto de capa do perfil", en: "Profile cover photo" },
  "settings.title":          { pt: "Configurações", en: "Settings" },
  "settings.account":        { pt: "Conta", en: "Account" },
  "settings.personal_data":  { pt: "Dados pessoais", en: "Personal data" },
  "settings.change_password": { pt: "Alterar senha", en: "Change password" },
  "settings.preferences":    { pt: "Preferências", en: "Preferences" },
  "settings.language":       { pt: "Idioma", en: "Language" },
  "settings.dark_mode":      { pt: "Modo escuro", en: "Dark mode" },
  "settings.dietary":        { pt: "Restrições alimentares", en: "Dietary restrictions" },
  "settings.vegetarian":     { pt: "Vegetariano", en: "Vegetarian" },
  "settings.lactose_free":   { pt: "Sem lactose", en: "Lactose-free" },
  "settings.notifications":   { pt: "Notificações", en: "Notifications" },
  "settings.likes_notif":     { pt: "Curtidas", en: "Likes" },
  "settings.new_followers":  { pt: "Novos seguidores", en: "New followers" },
  "settings.logout":         { pt: "Sair da conta", en: "Log out" },
  "settings.logout_title":   { pt: "Confirmação de logout", en: "Logout confirmation" },
  "settings.logout_desc":    { pt: "Tem certeza de que deseja sair da sua conta?", en: "Are you sure you want to log out of your account?" },
  "results.title":          { pt: "Resultados da busca", en: "Search results" },
  "results.ingredient":     { pt: "ingrediente", en: "ingredient" },
  "results.ingredients":    { pt: "ingredientes", en: "ingredients" },
  "results.selected":       { pt: "Selecionado", en: "Selected" },
  "results.selected_plural": { pt: "Selecionados", en: "Selected" },
  "results.urgent_count":   { pt: "{count} urgente", en: "{count} urgent" },
  "results.urgent_count_plural": { pt: "{count} urgentes", en: "{count} urgent" },
  "results.analyzing":      { pt: "Analisando ingredientes...", en: "Analyzing ingredients..." },
  "results.you_have":       { pt: "Você tem", en: "You have" },
  "results.of":            { pt: "de", en: "of" },
  "results.missing":       { pt: "faltando", en: "missing" },
  "results.save_your":     { pt: "Salve suas receitas favoritas para acessá-las facilmente depois!", en: "Save your favorite recipes to access them easily later!" },
  "results.no_results":    { pt: "Nenhuma receita encontrada. Tente adicionar mais ingredientes ou verificar a ortografia.", en: "No recipes found. Try adding more ingredients or checking the spelling." },
  "results.go_back":       { pt: "Voltar para a busca", en: "Go back to search" },
} as const;

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
    (name: string): string => toDisplayIngredient(name, language),
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
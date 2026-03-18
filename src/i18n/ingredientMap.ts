/**
 * Dicionário bidirecional de ingredientes PT ↔ EN
 *
 * PT_TO_EN: usado na BUSCA — converte o que o usuário digitou para o que a API entende
 * EN_TO_PT: usado na EXIBIÇÃO — converte o que a API retorna para PT
 */

export const PT_TO_EN: Record<string, string> = {
  // Proteínas
  "frango":         "chicken",
  "frango assado":  "roast chicken",
  "peito de frango":"chicken breast",
  "carne":          "beef",
  "carne moída":    "ground beef",
  "bife":           "steak",
  "porco":          "pork",
  "bacon":          "bacon",
  "peixe":          "fish",
  "salmão":         "salmon",
  "atum":           "tuna",
  "camarão":        "shrimp",
  "ovo":            "eggs",
  "ovos":           "eggs",
  "leite":          "milk",
  "queijo":         "cheese",
  "manteiga":       "butter",
  "creme de leite": "cream",
  "iogurte":        "yogurt",
  "requeijão":      "cream cheese",

  // Vegetais
  "cebola":         "onion",
  "alho":           "garlic",
  "tomate":         "tomato",
  "batata":         "potato",
  "cenoura":        "carrot",
  "brócolis":       "broccoli",
  "pimentão":       "pepper",
  "pimenta":        "chilli",
  "alface":         "lettuce",
  "espinafre":      "spinach",
  "abobrinha":      "zucchini",
  "berinjela":      "aubergine",
  "couve":          "kale",
  "pepino":         "cucumber",
  "beterraba":      "beetroot",
  "milho":          "corn",
  "ervilha":        "peas",
  "vagem":          "green beans",
  "cogumelo":       "mushroom",
  "cogumelos":      "mushroom",
  "champignon":     "mushroom",
  "chuchu":         "chayote",
  "mandioca":       "cassava",
  "inhame":         "yam",

  // Despensa
  "arroz":          "rice",
  "macarrão":       "pasta",
  "farinha":        "flour",
  "farinha de trigo":"flour",
  "açúcar":         "sugar",
  "sal":            "salt",
  "óleo":           "oil",
  "azeite":         "olive oil",
  "feijão":         "beans",
  "lentilha":       "lentils",
  "grão de bico":   "chickpeas",
  "pão":            "bread",
  "pão de forma":   "bread",
  "biscoito":       "biscuits",
  "aveia":          "oats",
  "amido de milho": "cornstarch",
  "fermento":       "baking powder",
  "bicarbonato":    "baking soda",

  // Temperos e molhos
  "shoyo":          "soy sauce",
  "shoyu":          "soy sauce",
  "molho de soja":  "soy sauce",
  "molho shoyu":    "soy sauce",
  "molho inglês":   "worcestershire sauce",
  "molho de tomate":"tomato sauce",
  "extrato de tomate":"tomato puree",
  "catchup":        "ketchup",
  "maionese":       "mayonnaise",
  "mostarda":       "mustard",
  "vinagre":        "vinegar",
  "limão":          "lemon",
  "laranja":        "orange",
  "alecrim":        "rosemary",
  "tomilho":        "thyme",
  "orégano":        "oregano",
  "manjericão":     "basil",
  "salsinha":       "parsley",
  "coentro":        "coriander",
  "páprica":        "paprika",
  "cúrcuma":        "turmeric",
  "canela":         "cinnamon",
  "gengibre":       "ginger",
  "noz moscada":    "nutmeg",
  "pimenta do reino":"black pepper",
  "pimenta vermelha":"chilli",
  "cominho":        "cumin",
  "curry":          "curry",
  "mel":            "honey",
  "açafrão":        "saffron",

  // Frutas
  "banana":         "banana",
  "maçã":           "apple",
  "pera":           "pear",
  "uva":            "grape",
  "morango":        "strawberry",
  "abacaxi":        "pineapple",
  "manga":          "mango",
  "mamão":          "papaya",
  "coco":           "coconut",
  "abacate":        "avocado",

  // Laticínios
  "leite condensado":"condensed milk",
  "leite de coco":  "coconut milk",
  "nata":           "cream",
  "ricota":         "ricotta",
  "parmesão":       "parmesan",
  "mussarela":      "mozzarella",
};

/**
 * Mapa reverso EN → PT gerado automaticamente do PT_TO_EN
 * Mais entradas podem ser adicionadas manualmente abaixo
 */
export const EN_TO_PT: Record<string, string> = {
  // Gerado do PT_TO_EN (reverso)
  ...Object.fromEntries(Object.entries(PT_TO_EN).map(([pt, en]) => [en.toLowerCase(), pt])),

  // Entradas extras que a API usa e não estão no mapa reverso
  "chicken":          "Frango",
  "beef":             "Carne bovina",
  "pork":             "Porco",
  "fish":             "Peixe",
  "eggs":             "Ovos",
  "egg":              "Ovo",
  "milk":             "Leite",
  "butter":           "Manteiga",
  "cheese":           "Queijo",
  "cream":            "Creme de leite",
  "onion":            "Cebola",
  "garlic":           "Alho",
  "tomato":           "Tomate",
  "potato":           "Batata",
  "carrot":           "Cenoura",
  "pepper":           "Pimentão",
  "chilli":           "Pimenta",
  "lettuce":          "Alface",
  "mushroom":         "Cogumelo",
  "rice":             "Arroz",
  "pasta":            "Macarrão",
  "flour":            "Farinha",
  "sugar":            "Açúcar",
  "salt":             "Sal",
  "oil":              "Óleo",
  "olive oil":        "Azeite",
  "beans":            "Feijão",
  "bread":            "Pão",
  "soy sauce":        "Shoyu",
  "worcestershire sauce": "Molho inglês",
  "tomato sauce":     "Molho de tomate",
  "tomato puree":     "Extrato de tomate",
  "ketchup":          "Catchup",
  "mayonnaise":       "Maionese",
  "mustard":          "Mostarda",
  "vinegar":          "Vinagre",
  "lemon":            "Limão",
  "orange":           "Laranja",
  "rosemary":         "Alecrim",
  "thyme":            "Tomilho",
  "oregano":          "Orégano",
  "basil":            "Manjericão",
  "parsley":          "Salsinha",
  "coriander":        "Coentro",
  "paprika":          "Páprica",
  "turmeric":         "Cúrcuma",
  "cinnamon":         "Canela",
  "ginger":           "Gengibre",
  "nutmeg":           "Noz moscada",
  "black pepper":     "Pimenta do reino",
  "cumin":            "Cominho",
  "curry":            "Curry",
  "honey":            "Mel",
  "banana":           "Banana",
  "apple":            "Maçã",
  "pineapple":        "Abacaxi",
  "mango":            "Manga",
  "coconut":          "Coco",
  "avocado":          "Abacate",
  "condensed milk":   "Leite condensado",
  "coconut milk":     "Leite de coco",
  "parmesan":         "Parmesão",
  "mozzarella":       "Mussarela",
  "salmon":           "Salmão",
  "tuna":             "Atum",
  "shrimp":           "Camarão",
  "spinach":          "Espinafre",
  "broccoli":         "Brócolis",
  "zucchini":         "Abobrinha",
  "corn":             "Milho",
  "peas":             "Ervilha",
  "oats":             "Aveia",
  "cornstarch":       "Amido de milho",
  "baking powder":    "Fermento",
  "baking soda":      "Bicarbonato",
  "yogurt":           "Iogurte",
  "cream cheese":     "Requeijão",
  "ricotta":          "Ricota",
  "steak":            "Bife",
  "ground beef":      "Carne moída",
  "bacon":            "Bacon",
  "saffron":          "Açafrão",
  "chickpeas":        "Grão de bico",
  "lentils":          "Lentilha",
};

/**
 * Converte PT → EN para usar na busca da API
 * Se não encontrar no dicionário, retorna o original (pode já estar em EN)
 */
export function toApiIngredient(input: string): string {
  const lower = input.toLowerCase().trim();
  return PT_TO_EN[lower] ?? input;
}

/**
 * Converte EN → PT para exibição
 * Faz busca parcial para lidar com ingredientes compostos da API
 * Ex: "chicken breast" → "Peito de frango"
 */
export function toDisplayIngredient(apiName: string, lang: "pt" | "en"): string {
  if (lang === "en") return apiName;

  const lower = apiName.toLowerCase().trim();

  // Busca exata primeiro
  if (EN_TO_PT[lower]) return EN_TO_PT[lower];

  // Busca parcial — verifica se alguma chave está contida no nome
  for (const [en, pt] of Object.entries(EN_TO_PT)) {
    if (lower.includes(en)) return pt;
  }

  return apiName; // fallback: retorna original
}
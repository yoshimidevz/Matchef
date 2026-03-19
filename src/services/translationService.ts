/**
 * DeepL Translation Service
 *
 * Usado para traduzir ingredientes PT → EN (busca na API)
 * e EN → PT (exibição ao usuário).
 *
 * Configure a key em .env:
 *   EXPO_PUBLIC_DEEPL_KEY=sua_chave_aqui
 *
 * DeepL Free API usa: api-free.deepl.com
 * DeepL Pro API usa:  api.deepl.com
 */

const DEEPL_KEY = process.env.EXPO_PUBLIC_DEEPL_KEY ?? "";
const DEEPL_URL = "https://api-free.deepl.com/v2/translate";

// Cache em memória para evitar chamadas repetidas na mesma sessão
const cache = new Map<string, string>();

function cacheKey(text: string, targetLang: string) {
  return `${targetLang}:${text.toLowerCase().trim()}`;
}

/**
 * Traduz um texto usando a DeepL API.
 * Retorna o texto original em caso de erro.
 */
async function translate(text: string, targetLang: "EN" | "PT"): Promise<string> {
  if (!text.trim()) return text;

  const key = cacheKey(text, targetLang);
  if (cache.has(key)) return cache.get(key)!;

  try {
    const res = await fetch(DEEPL_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        // source_lang omitido = DeepL detecta automaticamente
      }),
    });

    if (!res.ok) {
      console.warn(`DeepL error ${res.status} for "${text}"`);
      return text;
    }

    const data = await res.json();
    const translated = data.translations?.[0]?.text ?? text;
    cache.set(key, translated);
    return translated;
  } catch (err) {
    console.warn("DeepL fetch failed:", err);
    return text; // fallback: retorna original
  }
}

/**
 * PT → EN: converte ingrediente digitado pelo usuário para
 * o termo que a MealDB API entende.
 *
 * Ex: "shoyo" → "soy sauce"
 *     "frango" → "chicken"
 */
export async function toApiIngredient(input: string): Promise<string> {
  return translate(input, "EN");
}

/**
 * EN → PT: converte ingrediente retornado pela API para PT
 * para exibição ao usuário.
 *
 * Ex: "Soy Sauce" → "Molho de soja"
 *     "Chicken"   → "Frango"
 */
export async function toDisplayIngredient(
  apiName: string,
  lang: "pt" | "en"
): Promise<string> {
  if (lang === "en") return apiName;
  return translate(apiName, "PT");
}

/**
 * Traduz um array de ingredientes de uma vez (mais eficiente).
 * Útil para traduzir todos os ingredientes de uma receita de uma vez.
 */
export async function translateIngredientsBatch(
  names: string[],
  targetLang: "EN" | "PT"
): Promise<string[]> {
  if (!names.length) return [];

  // Separa os que já estão em cache dos que precisam ser traduzidos
  const toFetch: { index: number; text: string }[] = [];
  const results: string[] = new Array(names.length);

  for (let i = 0; i < names.length; i++) {
    const key = cacheKey(names[i], targetLang);
    if (cache.has(key)) {
      results[i] = cache.get(key)!;
    } else {
      toFetch.push({ index: i, text: names[i] });
    }
  }

  if (toFetch.length === 0) return results;

  try {
    const res = await fetch(DEEPL_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: toFetch.map((t) => t.text),
        target_lang: targetLang,
      }),
    });

    if (!res.ok) {
      // fallback: retorna originais
      for (const { index, text } of toFetch) results[index] = text;
      return results;
    }

    const data = await res.json();
    const translations: string[] = data.translations.map((t: { text: string }) => t.text);

    for (let i = 0; i < toFetch.length; i++) {
      const { index, text } = toFetch[i];
      const translated = translations[i] ?? text;
      cache.set(cacheKey(text, targetLang), translated);
      results[index] = translated;
    }
  } catch {
    for (const { index, text } of toFetch) results[index] = text;
  }

  return results;
}
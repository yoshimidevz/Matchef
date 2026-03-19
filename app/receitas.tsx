import { useState, useCallback } from "react";
import {
  View, Text, TextInput, Pressable, FlatList,
  Image, StyleSheet, ActivityIndicator,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../src/components/matchchef/Header";
import { BottomNav } from "../src/components/matchchef/BottomNav";
import { ApiRecipeDetail } from "../src/components/matchchef/ApiRecipeDetail";
import { searchByName, type MealDetail } from "../src/services/mealApi";
import { useLanguage } from "../src/i18n/LanguageContext";

export default function Receitas() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MealDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealDetail | null>(null);
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchByName(query.trim());
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  return (
    <View style={styles.screen}>
      <Header />

      <View style={styles.container}>
        {/* Título */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>🍽️ {t("recipes.title")}</Text>
          <Text style={styles.subtitle}>{t("recipes.subtitle")}</Text>
        </View>

        {/* Campo de busca */}
        <View style={styles.inputRow}>
          <Search size={18} color="#555" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            placeholder={t("recipes.placeholder")}
            placeholderTextColor="#444"
            returnKeyType="search"
            style={styles.input}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={handleClear} style={styles.clearBtn}>
              <X size={16} color="#555" />
            </Pressable>
          )}
          <Pressable
            onPress={handleSearch}
            disabled={!query.trim() || loading}
            style={[styles.searchBtn, (!query.trim() || loading) && styles.searchBtnDisabled]}
          >
            <Text style={styles.searchBtnText}>{t("recipes.search_btn")}</Text>
          </Pressable>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator color="hsl(25,90%,55%)" size="large" />
          </View>
        )}

        {/* Sem resultados */}
        {!loading && searched && results.length === 0 && (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>🤔</Text>
            <Text style={styles.emptyText}>{t("recipes.no_results")}</Text>
            <Text style={styles.emptyHint}>{t("recipes.no_results_hint")}</Text>
          </View>
        )}

        {/* Estado inicial */}
        {!loading && !searched && (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>{t("recipes.initial_text")}</Text>
          </View>
        )}

        {/* Resultados */}
        {!loading && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.idMeal}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: 100 + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedMeal(item)}
                style={styles.card}
              >
                <Image
                  source={{ uri: item.strMealThumb }}
                  style={styles.thumb}
                  resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {item.strMeal}
                  </Text>
                  <View style={styles.tagsRow}>
                    {item.strCategory ? (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.strCategory}</Text>
                      </View>
                    ) : null}
                    {item.strArea ? (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.strArea}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.cardIngredients}>
                    {item.ingredients.length} {t("recipes.ingredients_count")}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>

      <BottomNav />

      <ApiRecipeDetail
        mealId={selectedMeal?.idMeal ?? null}
        meal={selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f0f0f" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  titleRow: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "900", color: "#fff" },
  subtitle: { fontSize: 13, color: "#555", marginTop: 4 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
    paddingVertical: 6,
  },
  clearBtn: {
    width: 28, height: 28,
    alignItems: "center", justifyContent: "center",
  },
  searchBtn: {
    backgroundColor: "hsl(25,90%,55%)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchBtnDisabled: { opacity: 0.4 },
  searchBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  centered: {
    flex: 1, alignItems: "center", justifyContent: "center", gap: 8,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 4 },
  emptyText: { fontSize: 15, fontWeight: "700", color: "#555", textAlign: "center" },
  emptyHint: { fontSize: 12, color: "#444", textAlign: "center" },

  list: { gap: 12 },
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  thumb: { width: 96, height: 96 },
  cardInfo: {
    flex: 1, padding: 12, gap: 4, justifyContent: "center",
  },
  cardName: { fontSize: 14, fontWeight: "800", color: "#fff", lineHeight: 20 },
  tagsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: {
    backgroundColor: "rgba(255,120,50,0.12)",
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99,
  },
  tagText: { fontSize: 10, fontWeight: "700", color: "hsl(25,90%,55%)" },
  cardIngredients: { fontSize: 11, color: "#555" },
});
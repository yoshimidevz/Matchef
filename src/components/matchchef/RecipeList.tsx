import { View, Text, StyleSheet } from "react-native";
import type { MatchedRecipe } from "../../hooks/useMatchChef";
import { RecipeCard } from "./RecipeCard";
import { useLanguage } from "../../i18n/LanguageContext";

interface RecipeListProps {
  perfectMatches: MatchedRecipe[];
  almostMatches: MatchedRecipe[];
  onOpen: (recipe: MatchedRecipe) => void;
  onAddToShoppingList: (items: string[]) => void;
  hasSelection: boolean;
}

export function RecipeList({
  perfectMatches,
  almostMatches,
  onOpen,
  onAddToShoppingList,
  hasSelection,
}: RecipeListProps) {
  const { language, t } = useLanguage();

  if (!hasSelection) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>👆</Text>
        <Text style={styles.emptyText}>{t("recipe_list.empty")}</Text>
      </View>
    );
  }

  if (perfectMatches.length === 0 && almostMatches.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🤔</Text>
        <Text style={styles.emptyText}>{t("recipe_list.not_found")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {perfectMatches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ✅ {t("recipe_list.perfect_matches")} ({perfectMatches.length})
          </Text>
          <View style={styles.list}>
            {perfectMatches.map((r, i) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                index={i}
                onOpen={onOpen}
                onAddToShoppingList={onAddToShoppingList}
              />
            ))}
          </View>
        </View>
      )}

      {almostMatches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🔥 {t("recipe_list.almost_matches")} ({almostMatches.length})
          </Text> 
         <View style={styles.list}>
            {almostMatches.map((r, i) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                index={i + perfectMatches.length}
                onOpen={onOpen}
                onAddToShoppingList={onAddToShoppingList}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
  container: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
  },
  list: {
    gap: 10,
  },
});
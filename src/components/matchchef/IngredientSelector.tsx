import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { ingredients, categoryInfo, type IngredientCategory } from "../../data/ingredients";

interface IngredientSelectorProps {
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export function IngredientSelector({ selected, onToggle }: IngredientSelectorProps) {
  const categories = Object.keys(categoryInfo) as IngredientCategory[];

  return (
    <View>
      <Text style={styles.title}>🧊 O que eu tenho na geladeira?</Text>
      <Text style={styles.subtitle}>Toque nos ingredientes que você tem em casa</Text>

      <View style={styles.categoriesContainer}>
        {categories.map((cat) => {
          const info = categoryInfo[cat];
          const catIngredients = ingredients.filter((i) => i.category === cat);

          return (
            <View key={cat} style={styles.category}>
              <Text style={styles.categoryLabel}>{info.label}</Text>
              <View style={styles.chipsRow}>
                {catIngredients.map((ing) => {
                  const isSelected = selected.has(ing.id);
                  return (
                    <Pressable
                      key={ing.id}
                      onPress={() => onToggle(ing.id)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                    >
                      <Text style={styles.chipEmoji}>{ing.emoji}</Text>
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {ing.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      {selected.size > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            ✨ {selected.size} ingrediente{selected.size > 1 ? "s" : ""} selecionado{selected.size > 1 ? "s" : ""}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
  },
  categoriesContainer: {
    gap: 16,
  },
  category: {
    gap: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  chipSelected: {
    backgroundColor: "hsl(25,90%,55%)",
    borderColor: "hsl(25,90%,55%)",
  },
  chipEmoji: {
    fontSize: 15,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#aaa",
  },
  chipTextSelected: {
    color: "#fff",
  },
  countBadge: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,120,50,0.1)",
    alignItems: "center",
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
    color: "hsl(25,90%,55%)",
  },
});
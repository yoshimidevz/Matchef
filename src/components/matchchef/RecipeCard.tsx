import { View, Text, Pressable, StyleSheet } from "react-native";
import { Clock, Flame, ShoppingCart } from "lucide-react-native";
import type { MatchedRecipe } from "../../hooks/useMatchChef";
import { ingredients } from "../../data/ingredients";

interface RecipeCardProps {
  recipe: MatchedRecipe;
  index: number;
  onOpen: (recipe: MatchedRecipe) => void;
  onAddToShoppingList: (items: string[]) => void;
}

export function RecipeCard({ recipe, index, onOpen, onAddToShoppingList }: RecipeCardProps) {
  const isPerfect = recipe.matchPercent === 100;

  const getIngredientName = (id: string) => {
    const ing = ingredients.find((i) => i.id === id);
    return ing ? ing.name : id;
  };

  return (
    <Pressable onPress={() => onOpen(recipe)} style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{recipe.emoji}</Text>

        <View style={styles.info}>
          {/* Name + badge */}
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{recipe.name}</Text>
            {isPerfect && (
              <View style={styles.perfectBadge}>
                <Text style={styles.perfectBadgeText}>100%</Text>
              </View>
            )}
          </View>

          <Text style={styles.description} numberOfLines={1}>{recipe.description}</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={12} color="#666" />
              <Text style={styles.metaText}>{recipe.prepTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Flame size={12} color="#666" />
              <Text style={styles.metaText}>{recipe.difficulty}</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                { width: `${recipe.matchPercent}%` },
                isPerfect ? styles.barFillPerfect : styles.barFillAlmost,
              ]}
            />
          </View>
          <Text style={styles.matchText}>
            {recipe.matchCount}/{recipe.ingredients.length} ingredientes
          </Text>

          {/* Missing ingredients */}
          {recipe.missingIngredients.length > 0 && (
            <View style={styles.missingRow}>
              <Text style={styles.missingLabel}>Faltam:</Text>
              {recipe.missingIngredients.map((id) => (
                <View key={id} style={styles.missingChip}>
                  <Text style={styles.missingChipText}>{getIngredientName(id)}</Text>
                </View>
              ))}
              <Pressable
                onPress={(e) => {
                  onAddToShoppingList(recipe.missingIngredients);
                }}
                style={styles.addBtn}
              >
                <ShoppingCart size={11} color="hsl(25,90%,55%)" />
                <Text style={styles.addBtnText}>Adicionar</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  emoji: {
    fontSize: 36,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    flex: 1,
  },
  perfectBadge: {
    backgroundColor: "rgba(255,120,50,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  perfectBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "hsl(25,90%,55%)",
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#666",
  },
  barBg: {
    height: 5,
    borderRadius: 99,
    backgroundColor: "#2a2a2a",
    overflow: "hidden",
    marginTop: 6,
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
  },
  barFillPerfect: {
    backgroundColor: "hsl(25,90%,55%)",
  },
  barFillAlmost: {
    backgroundColor: "#facc15",
  },
  matchText: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },
  missingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  missingLabel: {
    fontSize: 11,
    color: "#555",
  },
  missingChip: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  missingChipText: {
    fontSize: 11,
    color: "#666",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "hsl(25,90%,55%)",
  },
});
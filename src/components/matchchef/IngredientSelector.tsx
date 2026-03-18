import { useState, useMemo, useEffect} from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { Search, Plus, X, Star } from "lucide-react-native";
import { ingredients, categoryInfo, type IngredientCategory } from "../../data/ingredients";
import { useCustomIngredients } from "../../hooks/useCustomIngredients";
import { AddCustomIngredientModal } from "../matchchef/AddCustomIngredientModal";

interface IngredientSelectorProps {
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export function IngredientSelector({ selected, onToggle }: IngredientSelectorProps) {
  const [query, setQuery] = useState("");
  const [pendingName, setPendingName] = useState<string | null>(null);
  const categories = Object.keys(categoryInfo) as IngredientCategory[];

  const {
    customIngredients,
    loaded,
    addCustomIngredient,
    removeCustomIngredient,
    alwaysBuyIds,
    customCategories,
  } = useCustomIngredients();

  useEffect(() => {
    if (!loaded) return;
    for (const id of alwaysBuyIds) {
      if (!selected.has(id)) onToggle(id);
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    const fromFixed = ingredients.filter(
      (i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    );
    const fromCustom = customIngredients.filter(
      (i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    );
    return { fixed: fromFixed, custom: fromCustom };
  }, [query, customIngredients]);

  const hasFilteredResults =
    filtered && (filtered.fixed.length > 0 || filtered.custom.length > 0);
  const isCustom = query.trim().length > 0 && !hasFilteredResults;

  const handleSubmit = () => {
    if (filtered?.fixed.length === 1 && filtered.custom.length === 0) {
      onToggle(filtered.fixed[0].id);
      setQuery("");
    } else if (filtered?.custom.length === 1 && filtered.fixed.length === 0) {
      onToggle(filtered.custom[0].id);
      setQuery("");
    } else if (isCustom) {
      setPendingName(query.trim());
    }
  };

  // Agrupa customizados por categoria
  const customByCategory = useMemo(() => {
    const map: Record<string, typeof customIngredients> = {};
    for (const ing of customIngredients) {
      const cat = ing.category || "Outros";
      if (!map[cat]) map[cat] = [];
      map[cat].push(ing);
    }
    return map;
  }, [customIngredients]);

  const fixedIds = new Set(ingredients.map((i) => i.id));
  const totalSelected = selected.size;

  return (
    <View>
      <Text style={styles.title}>🧊 O que eu tenho na geladeira?</Text>
      <Text style={styles.subtitle}>Toque nos ingredientes ou digite para buscar</Text>

      {/* Search input */}
      <View style={styles.inputRow}>
        <Search size={16} color="#555" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          placeholder="Buscar ou adicionar ingrediente..."
          placeholderTextColor="#444"
          returnKeyType="done"
          style={styles.input}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
            <X size={14} color="#555" />
          </Pressable>
        )}
      </View>

      {/* Botão adicionar customizado */}
      {isCustom && (
        <Pressable
          onPress={() => setPendingName(query.trim())}
          style={styles.addCustomBtn}
        >
          <Plus size={16} color="hsl(25,90%,55%)" />
          <Text style={styles.addCustomText}>
            Adicionar <Text style={styles.addCustomHighlight}>"{query.trim()}"</Text>
          </Text>
        </Pressable>
      )}

      {/* Resultados filtrados */}
      {hasFilteredResults && (
        <View style={styles.filteredRow}>
          {filtered.fixed.map((ing) => {
            const isSelected = selected.has(ing.id);
            return (
              <Pressable
                key={ing.id}
                onPress={() => { onToggle(ing.id); setQuery(""); }}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={styles.chipEmoji}>{ing.emoji}</Text>
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {ing.name}
                </Text>
              </Pressable>
            );
          })}
          {filtered.custom.map((ing) => {
            const isSelected = selected.has(ing.id);
            return (
              <Pressable
                key={ing.id}
                onPress={() => { onToggle(ing.id); setQuery(""); }}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                {ing.alwaysBuy && <Star size={11} color={isSelected ? "#fff" : "#facc15"} fill={isSelected ? "#fff" : "#facc15"} />}
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {ing.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Lista por categoria (sem busca) */}
      {!query.trim() && (
        <View style={styles.categoriesContainer}>

          {/* Categorias customizadas do usuário */}
          {Object.entries(customByCategory).map(([cat, items]) => (
            <View key={cat} style={styles.category}>
              <Text style={styles.categoryLabel}>✨ {cat}</Text>
              <View style={styles.chipsRow}>
                {items.map((ing) => {
                  const isSelected = selected.has(ing.id);
                  return (
                    <Pressable
                      key={ing.id}
                      onPress={() => onToggle(ing.id)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onLongPress={() => removeCustomIngredient(ing.id)}
                    >
                      {ing.alwaysBuy && (
                        <Star
                          size={11}
                          color={isSelected ? "#fff" : "#facc15"}
                          fill={isSelected ? "#fff" : "#facc15"}
                        />
                      )}
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {ing.name}
                      </Text>
                      {!isSelected && (
                        <Pressable
                          onPress={() => removeCustomIngredient(ing.id)}
                          hitSlop={8}
                        >
                          <X size={10} color="#555" />
                        </Pressable>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Categorias fixas */}
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
      )}

      {/* Contador */}
      {totalSelected > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            ✨ {totalSelected} ingrediente{totalSelected > 1 ? "s" : ""} selecionado{totalSelected > 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Modal de adicionar customizado */}
      <AddCustomIngredientModal
        visible={!!pendingName}
        ingredientName={pendingName || ""}
        existingCategories={customCategories}
        onConfirm={(ingredient) => {
          addCustomIngredient(ingredient);
          onToggle(ingredient.id);
          setQuery("");
          setPendingName(null);
        }}
        onClose={() => setPendingName(null)}
      />
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
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  clearBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  addCustomBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,120,50,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,120,50,0.25)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  addCustomText: {
    fontSize: 13,
    color: "#aaa",
    fontWeight: "500",
  },
  addCustomHighlight: {
    color: "hsl(25,90%,55%)",
    fontWeight: "700",
  },
  filteredRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
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
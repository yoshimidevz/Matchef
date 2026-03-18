import { useState, useMemo } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { Search, Plus, X } from "lucide-react-native";
import { ingredients, categoryInfo, type IngredientCategory } from "../../data/ingredients";

interface IngredientSelectorProps {
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export function IngredientSelector({ selected, onToggle }: IngredientSelectorProps) {
  const [query, setQuery] = useState("");
  const categories = Object.keys(categoryInfo) as IngredientCategory[];

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return ingredients.filter(
      (i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    );
  }, [query]);

  const isCustom = query.trim().length > 0 && filtered?.length === 0;

  const handleAddCustom = () => {
    if (!query.trim()) return;
    const id = query.trim().toLowerCase();
    onToggle(id);
    setQuery("");
  };

  const handleSubmit = () => {
    if (filtered && filtered.length === 1) {
      onToggle(filtered[0].id);
      setQuery("");
    } else if (isCustom) {
      handleAddCustom();
    }
  };

  const fixedIds = new Set(ingredients.map((i) => i.id));
  const customSelected = Array.from(selected).filter((id) => !fixedIds.has(id));

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

      {/* Adicionar ingrediente customizado */}
      {isCustom && (
        <Pressable onPress={handleAddCustom} style={styles.addCustomBtn}>
          <Plus size={16} color="hsl(25,90%,55%)" />
          <Text style={styles.addCustomText}>
            Adicionar <Text style={styles.addCustomHighlight}>"{query.trim()}"</Text>
          </Text>
        </Pressable>
      )}

      {/* Resultados filtrados */}
      {filtered && filtered.length > 0 && (
        <View style={styles.filteredRow}>
          {filtered.map((ing) => {
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
        </View>
      )}

      {/* Lista por categoria (quando não há busca) */}
      {!query.trim() && (
        <View style={styles.categoriesContainer}>

          {/* Ingredientes customizados selecionados */}
          {customSelected.length > 0 && (
            <View style={styles.customSection}>
              <Text style={styles.categoryLabel}>➕ Adicionados por você</Text>
              <View style={styles.chipsRow}>
                {customSelected.map((id) => (
                  <Pressable
                    key={id}
                    onPress={() => onToggle(id)}
                    style={[styles.chip, styles.chipSelected]}
                  >
                    <Text style={styles.chipTextSelected}>{id}</Text>
                    <X size={12} color="#fff" />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

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
  customSection: {
    gap: 8,
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
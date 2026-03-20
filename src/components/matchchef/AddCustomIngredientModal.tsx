import { useState } from "react";
import {
  View, Text, Pressable, TextInput, Switch,
  Modal, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { X, Plus, Star } from "lucide-react-native";
import type { CustomIngredient } from "../../hooks/useCustomIngredients";
import { useLanguage } from "../../i18n/LanguageContext";

interface AddCustomIngredientModalProps {
  visible: boolean;
  ingredientName: string;
  existingCategories: string[];   // categorias já criadas pelo usuário
  onConfirm: (ingredient: CustomIngredient) => void;
  onClose: () => void;
}

const SUGGESTED_CATEGORIES = [
  "Molhos", "Bebidas", "Grãos", "Massas", "Enlatados",
  "Congelados", "Snacks", "Outros",
];

export function AddCustomIngredientModal({
  visible,
  ingredientName,
  existingCategories,
  onConfirm,
  onClose,
}: AddCustomIngredientModalProps) {
  const { t } = useLanguage();
  const [category, setCategory] = useState("");
  const [alwaysBuy, setAlwaysBuy] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  // Combina categorias existentes + sugeridas, sem duplicatas
  const allCategories = Array.from(
    new Set([...existingCategories, ...SUGGESTED_CATEGORIES])
  );

  const handleConfirm = () => {
    const finalCategory = showNewCategory
      ? newCategoryInput.trim() || "Outros"
      : category || "Outros";

    onConfirm({
      id: ingredientName.toLowerCase().trim(),
      name: ingredientName.trim(),
      category: finalCategory,
      alwaysBuy,
    });

    // Reset
    setCategory("");
    setAlwaysBuy(false);
    setNewCategoryInput("");
    setShowNewCategory(false);
    onClose();
  };

  const handleClose = () => {
    setCategory("");
    setAlwaysBuy(false);
    setNewCategoryInput("");
    setShowNewCategory(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={{flex: 1, justifyContent: "flex-end"}}>
            <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
                <View>
                <Text style={styles.title}>Adicionar ingrediente</Text>
                <Text style={styles.ingredientName}>"{ingredientName}"</Text>
                </View>
                <Pressable onPress={handleClose} style={styles.closeBtn}>
                <X size={16} color="#fff" />
                </Pressable>
            </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                <Text style={styles.label}>{t("add_custom_ingredient_modal.category_label")}</Text>
                <View style={styles.categoriesGrid}>
                {allCategories.map((cat) => (
                    <Pressable
                    key={cat}
                    onPress={() => { setCategory(cat); setShowNewCategory(false); }}
                    style={[
                        styles.categoryChip,
                        category === cat && !showNewCategory && styles.categoryChipActive,
                    ]}
                    >
                    <Text style={[
                        styles.categoryChipText,
                        category === cat && !showNewCategory && styles.categoryChipTextActive,
                    ]}>
                        {cat}
                    </Text>
                    </Pressable>
                ))}

                {/* Botão criar nova categoria */}
                <Pressable
                    onPress={() => { setShowNewCategory(true); setCategory(""); }}
                    style={[styles.categoryChip, showNewCategory && styles.categoryChipActive]}
                >
                    <Plus size={12} color={showNewCategory ? "#fff" : "#666"} />
                    <Text style={[
                    styles.categoryChipText,
                    showNewCategory && styles.categoryChipTextActive,
                    ]}>
                    Nova
                    </Text>
                </Pressable>
                </View>

                {/* Input nova categoria */}
                {showNewCategory && (
                <TextInput
                    value={newCategoryInput}
                    onChangeText={setNewCategoryInput}
                    placeholder="Nome da categoria..."
                    placeholderTextColor="#444"
                    autoFocus
                    style={styles.categoryInput}
                />
                )}

                {/* Sempre tenho em casa */}
                <View style={styles.alwaysBuyRow}>
                <View style={styles.alwaysBuyInfo}>
                    <Star size={18} color={alwaysBuy ? "#facc15" : "#555"} fill={alwaysBuy ? "#facc15" : "transparent"} />
                    <View>
                    <Text style={styles.alwaysBuyTitle}>{t("add_custom_ingredient_modal.always_buy_title")}</Text>
                    <Text style={styles.alwaysBuySubtitle}>{t("add_custom_ingredient_modal.always_buy_subtitle")}</Text>
                    </View>
                </View>
                <Switch
                    value={alwaysBuy}
                    onValueChange={setAlwaysBuy}
                    trackColor={{ false: "#333", true: "hsl(25,90%,55%)" }}
                    thumbColor="#fff"
                />
                </View>

                {/* Botão confirmar */}
                <Pressable
                onPress={handleConfirm}
                style={styles.confirmBtn}
                >
                <Text style={styles.confirmBtnText}>{t("add_custom_ingredient_modal.confirm_btn")}</Text>
                </Pressable>
            </ScrollView>
            </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  wrapper: { 
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32,
    maxHeight: "92%",
    },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "#333", alignSelf: "center", marginBottom: 16,
  },
  header: {
    flexDirection: "row", alignItems: "flex-start",
    justifyContent: "space-between", marginBottom: 24,
  },
  title: { fontSize: 17, fontWeight: "800", color: "#fff" },
  ingredientName: { fontSize: 13, color: "hsl(25,90%,55%)", fontWeight: "600", marginTop: 2 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#2a2a2a", alignItems: "center", justifyContent: "center",
  },
  label: {
    fontSize: 13, fontWeight: "700", color: "#888",
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12,
  },
  categoryChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
    backgroundColor: "#2a2a2a", borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  categoryChipActive: {
    backgroundColor: "hsl(25,90%,55%)", borderColor: "hsl(25,90%,55%)",
  },
  categoryChipText: { fontSize: 13, fontWeight: "600", color: "#666" },
  categoryChipTextActive: { color: "#fff" },
  categoryInput: {
    backgroundColor: "#2a2a2a", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: "#fff", marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(255,120,50,0.3)",
  },
  alwaysBuyRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a", borderRadius: 14,
    padding: 14, marginTop: 8, marginBottom: 24,
  },
  alwaysBuyInfo: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  alwaysBuyTitle: { fontSize: 14, fontWeight: "700", color: "#fff" },
  alwaysBuySubtitle: { fontSize: 11, color: "#555", marginTop: 2 },
  confirmBtn: {
    backgroundColor: "hsl(25,90%,55%)", borderRadius: 14,
    height: 50, alignItems: "center", justifyContent: "center",
  },
  confirmBtnText: { fontSize: 15, fontWeight: "800", color: "#fff" },
});
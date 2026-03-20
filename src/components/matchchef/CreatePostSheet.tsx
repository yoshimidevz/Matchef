import { useState } from "react";
import {
  View, Text, Pressable, TextInput, ScrollView,
  Modal, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform,
} from "react-native";
import { X, Camera, Star } from "lucide-react-native";
import { useLanguage } from "../../i18n/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_RECIPES = [
  { id: "52772", title: "Teriyaki Chicken Casserole" },
  { id: "52771", title: "Spicy Arrabiata Penne" },
  { id: "52773", title: "Honey Teriyaki Salmon" },
  { id: "52774", title: "Pad See Ew" },
];

const DIFFICULTY_OPTIONS: { value: "easy" | "medium" | "hard"; label: string; emoji: string; color: string }[] = [
  { value: "easy",   label: "Fácil",   emoji: "😊", color: "#22c55e" },
  { value: "medium", label: "Médio",   emoji: "😅", color: "#facc15" },
  { value: "hard",   label: "Difícil", emoji: "🔥", color: "#ef4444" },
];

interface CreatePostSheetProps {
  open: boolean;
  onClose: () => void;
  onPublish: (post: {
    caption: string;
    rating?: 1 | 2 | 3 | 4 | 5;
    difficulty?: "easy" | "medium" | "hard";
    recipeId: string;
    recipeTitle: string;
  }) => void;
}

export function CreatePostSheet({ open, onClose, onPublish }: CreatePostSheetProps) {
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [recipeIndex, setRecipeIndex] = useState(0);
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const handlePublish = () => {
    const recipe = MOCK_RECIPES[recipeIndex];
    onPublish({
      caption,
      rating: rating ?? undefined,
      difficulty: difficulty ?? undefined,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
    });
    setCaption("");
    setRating(null);
    setDifficulty(null);
    setRecipeIndex(0);
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetWrapper}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom || 16 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{t("create.title")}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={16} color="#fff" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Photo placeholder */}
            <View style={styles.photoPlaceholder}>
              <Camera size={32} color="#555" />
              <Text style={styles.photoText}>{t("create.photo_placeholder")}</Text>
            </View>

            {/* Recipe selector */}
            <Text style={styles.label}>{t("create.link_recipe")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeScroll}>
              {MOCK_RECIPES.map((r, i) => (
                <Pressable
                  key={r.id}
                  onPress={() => setRecipeIndex(i)}
                  style={[styles.recipeChip, recipeIndex === i && styles.recipeChipActive]}
                >
                  <Text style={[styles.recipeChipText, recipeIndex === i && styles.recipeChipTextActive]}>
                    {r.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Nota (estrelas) — opcional */}
            <View style={styles.optionalHeader}>
              <Text style={styles.label}>{t("create.rating_label")}</Text>
              <Text style={styles.optionalTag}>{t("create.optional")}</Text>
            </View>
            <View style={styles.starsRow}>
              {([1, 2, 3, 4, 5] as const).map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setRating(rating === star ? null : star)}
                  style={styles.starBtn}
                >
                  <Star
                    size={32}
                    color="#facc15"
                    fill={rating !== null && star <= rating ? "#facc15" : "transparent"}
                  />
                </Pressable>
              ))}
            </View>
            {rating && (
              <Text style={styles.ratingHint}>
                {rating === 1 && "😬 Não ficou bom..."}
                {rating === 2 && "😕 Deixou a desejar"}
                {rating === 3 && "😊 Ok, no geral"}
                {rating === 4 && "😋 Ficou muito bom!"}
                {rating === 5 && "🤩 Perfeito, faria de novo!"}
              </Text>
            )}

            {/* Dificuldade — opcional */}
            <View style={[styles.optionalHeader, { marginTop: 16 }]}>
              <Text style={styles.label}>{t("create.difficulty_label")}</Text>
              <Text style={styles.optionalTag}>{t("create.optional")}</Text>
            </View>
            <View style={styles.difficultyRow}>
              {DIFFICULTY_OPTIONS.map((opt) => {
                const active = difficulty === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setDifficulty(active ? null : opt.value)}
                    style={[
                      styles.difficultyBtn,
                      active && { borderColor: opt.color, backgroundColor: `${opt.color}18` },
                    ]}
                  >
                    <Text style={styles.difficultyEmoji}>{opt.emoji}</Text>
                    <Text style={[styles.difficultyText, active && { color: opt.color }]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Caption */}
            <Text style={[styles.label, { marginTop: 16 }]}>{t("create.description")}</Text>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder={t("create.description_placeholder")}
              placeholderTextColor="#555"
              multiline
              numberOfLines={4}
              style={styles.textarea}
            />

            <Pressable
              onPress={handlePublish}
              disabled={!caption.trim()}
              style={[styles.publishBtn, !caption.trim() && styles.publishBtnDisabled]}
            >
              <Text style={styles.publishBtnText}>{t("create.publish")}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetWrapper: { justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    height: "100  %", 
    paddingHorizontal: 16, paddingTop: 8,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "#333", alignSelf: "center", marginBottom: 12,
  },
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 16,
  },
  title: { fontSize: 17, fontWeight: "800", color: "#fff" },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#2a2a2a", alignItems: "center", justifyContent: "center",
  },
  scroll: {},
  photoPlaceholder: {
    borderWidth: 2, borderStyle: "dashed", borderColor: "#333",
    borderRadius: 16, alignItems: "center", justifyContent: "center",
    paddingVertical: 40, gap: 8, marginBottom: 20,
  },
  photoText: { fontSize: 13, color: "#555" },
  label: { fontSize: 13, fontWeight: "700", color: "#fff", marginBottom: 8 },
  optionalHeader: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8,
  },
  optionalTag: {
    fontSize: 11, color: "#555", fontWeight: "500",
    backgroundColor: "#2a2a2a", paddingHorizontal: 8,
    paddingVertical: 2, borderRadius: 99,
  },
  recipeScroll: { marginBottom: 20 },
  recipeChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
    backgroundColor: "#2a2a2a", marginRight: 8,
  },
  recipeChipActive: { backgroundColor: "hsl(25,90%,55%)" },
  recipeChipText: { fontSize: 12, fontWeight: "600", color: "#666" },
  recipeChipTextActive: { color: "#fff" },

  starsRow: {
    flexDirection: "row", gap: 8, marginBottom: 8,
  },
  starBtn: { padding: 4 },
  ratingHint: {
    fontSize: 12, color: "#888", marginBottom: 4,
  },

  difficultyRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  difficultyBtn: {
    flex: 1, alignItems: "center", paddingVertical: 12,
    borderRadius: 14, borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#2a2a2a", gap: 4,
  },
  difficultyEmoji: { fontSize: 20 },
  difficultyText: { fontSize: 12, fontWeight: "700", color: "#666" },

  textarea: {
    backgroundColor: "#2a2a2a", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 13, color: "#fff", minHeight: 100,
    textAlignVertical: "top", marginBottom: 20,
  },
  publishBtn: {
    backgroundColor: "hsl(25,90%,55%)", borderRadius: 12,
    height: 48, alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  publishBtnDisabled: { opacity: 0.4 },
  publishBtnText: { fontSize: 15, fontWeight: "800", color: "#fff" },
});
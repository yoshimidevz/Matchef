import { useState } from "react";
import {
  View, Text, Pressable, TextInput, ScrollView,
  Modal, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform,
} from "react-native";
import { X, Camera } from "lucide-react-native";
import { useLanguage } from "../../i18n/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_RECIPES = [
  { id: "52772", title: "Teriyaki Chicken Casserole" },
  { id: "52771", title: "Spicy Arrabiata Penne" },
  { id: "52773", title: "Honey Teriyaki Salmon" },
  { id: "52774", title: "Pad See Ew" },
];

interface CreatePostSheetProps {
  open: boolean;
  onClose: () => void;
  onPublish: (post: {
    caption: string;
    status: "success" | "fail";
    recipeId: string;
    recipeTitle: string;
  }) => void;
}

export function CreatePostSheet({ open, onClose, onPublish }: CreatePostSheetProps) {
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<"success" | "fail">("success");
  const [recipeIndex, setRecipeIndex] = useState(0);
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const handlePublish = () => {
    const recipe = MOCK_RECIPES[recipeIndex];
    onPublish({ caption, status, recipeId: recipe.id, recipeTitle: recipe.title });
    setCaption("");
    setStatus("success");
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

          {/* Header */}
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

            {/* Status */}
            <Text style={styles.label}>{t("create.how_was_it")}</Text>
            <View style={styles.statusRow}>
              <Pressable
                onPress={() => setStatus("success")}
                style={[styles.statusBtn, status === "success" && styles.statusBtnSuccess]}
              >
                <Text style={[styles.statusBtnText, status === "success" && styles.statusBtnTextSuccess]}>
                  {t("community.success")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setStatus("fail")}
                style={[styles.statusBtn, status === "fail" && styles.statusBtnFail]}
              >
                <Text style={[styles.statusBtnText, status === "fail" && styles.statusBtnTextFail]}>
                  {t("community.fail")}
                </Text>
              </Pressable>
            </View>

            {/* Caption */}
            <Text style={styles.label}>{t("create.description")}</Text>
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
    maxHeight: "85%", paddingHorizontal: 16, paddingTop: 8,
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
  scroll: { maxHeight: 600 },
  photoPlaceholder: {
    borderWidth: 2, borderStyle: "dashed", borderColor: "#333",
    borderRadius: 16, alignItems: "center", justifyContent: "center",
    paddingVertical: 40, gap: 8, marginBottom: 20,
  },
  photoText: { fontSize: 13, color: "#555" },
  label: { fontSize: 13, fontWeight: "700", color: "#fff", marginBottom: 8 },
  recipeScroll: { marginBottom: 20 },
  recipeChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
    backgroundColor: "#2a2a2a", marginRight: 8,
  },
  recipeChipActive: { backgroundColor: "hsl(25,90%,55%)" },
  recipeChipText: { fontSize: 12, fontWeight: "600", color: "#666" },
  recipeChipTextActive: { color: "#fff" },
  statusRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statusBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: "#2a2a2a", alignItems: "center",
  },
  statusBtnSuccess: { backgroundColor: "rgba(34,197,94,0.15)" },
  statusBtnFail: { backgroundColor: "rgba(239,68,68,0.15)" },
  statusBtnText: { fontSize: 13, fontWeight: "700", color: "#666" },
  statusBtnTextSuccess: { color: "#22c55e" },
  statusBtnTextFail: { color: "#ef4444" },
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
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react-native";
import type { MatchedRecipe } from "../../hooks/useMatchChef";
import { useLanguage } from "../../i18n/LanguageContext";

interface KitchenModeProps {
  recipe: MatchedRecipe;
  onClose: () => void;
  onComplete: () => void;
}

export function KitchenMode({ recipe, onClose, onComplete }: KitchenModeProps) {
  const [step, setStep] = useState(0);
  const total = recipe.steps.length;
  const { t } = useLanguage();

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#fff" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.recipeName} numberOfLines={1}>{recipe.name}</Text>
            <Text style={styles.stepCount}>
              {t("cooking.step")} {step + 1} {t("cooking.of")} {total}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress bar */}
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${((step + 1) / total) * 100}%` }]} />
        </View>

        {/* Step content */}
        <View style={styles.content}>
          <Text style={styles.stepEmoji}>{recipe.emoji}</Text>
          <Text style={styles.stepText}>{recipe.steps[step]}</Text>
        </View>

        {/* Navigation */}
        <View style={styles.nav}>
          <Pressable
            onPress={() => setStep((s) => s - 1)}
            disabled={step === 0}
            style={[styles.navBtn, styles.navBtnSecondary, step === 0 && styles.navBtnDisabled]}
          >
            <ArrowLeft size={20} color={step === 0 ? "#333" : "#fff"} />
            <Text style={[styles.navBtnText, step === 0 && styles.navBtnTextDisabled]}>
              {t("kitchen.back")}
            </Text>
          </Pressable>

          {step < total - 1 ? (
            <Pressable
              onPress={() => setStep((s) => s + 1)}
              style={[styles.navBtn, styles.navBtnPrimary]}
            >
              <Text style={styles.navBtnTextPrimary}>{t("kitchen.next")}</Text>
              <ArrowRight size={20} color="#fff" />
            </Pressable>
          ) : (
            <Pressable onPress={handleFinish} style={[styles.navBtn, styles.navBtnPrimary]}>
              <Check size={20} color="#fff" />
              <Text style={styles.navBtnTextPrimary}>{t("kitchen.finish")}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  recipeName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    maxWidth: 200,
  },
  stepCount: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  barBg: {
    height: 4,
    backgroundColor: "#1a1a1a",
  },
  barFill: {
    height: "100%",
    backgroundColor: "hsl(25,90%,55%)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 24,
  },
  stepEmoji: {
    fontSize: 64,
  },
  stepText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 30,
  },
  nav: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  navBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navBtnPrimary: {
    backgroundColor: "hsl(25,90%,55%)",
  },
  navBtnSecondary: {
    backgroundColor: "#1a1a1a",
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  navBtnTextPrimary: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  navBtnTextDisabled: {
    color: "#333",
  },
});
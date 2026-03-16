import { useState, useCallback, useRef } from "react";
import {
  View, Text, Pressable, ScrollView,
  StyleSheet, Platform,
} from "react-native";
import { Animated } from "react-native";
import { Leaf, ChevronRight, AlarmClock } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../src/components/matchchef/Header";
import { BottomNav } from "../src/components/matchchef/BottomNav";
import { HeroSearch } from "../src/components/matchchef/HeroSearch";
import { PopularIngredients } from "../src/components/matchchef/PopularIngredients";
import { DailyRecipes } from "../src/components/matchchef/DailyRecipes";
import { ApiRecipeDetail } from "../src/components/matchchef/ApiRecipeDetail";
import { useLanguage } from "../src/i18n/LanguageContext";
import { type MealDetail } from "../src/services/mealApi";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, tIngredient } = useLanguage();

  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [urgentIngredients, setUrgentIngredients] = useState<Set<string>>(new Set());
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedMealDetail, setSelectedMealDetail] = useState<MealDetail | null>(null);
  const [zeroWaste, setZeroWaste] = useState(false);
  const [showUrgentTooltip, setShowUrgentTooltip] = useState(true);
  const hasShownTooltip = useRef(false);

  const toggleIngredient = useCallback((name: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        setUrgentIngredients((u) => { const nu = new Set(u); nu.delete(name); return nu; });
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const addIngredient = useCallback((name: string) => {
    setSelectedIngredients((prev) => new Set(prev).add(name));
  }, []);

  const toggleUrgent = useCallback((name: string) => {
    setUrgentIngredients((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
    if (showUrgentTooltip) setShowUrgentTooltip(false);
  }, [showUrgentTooltip]);

  const handleSelectDailyRecipe = useCallback((meal: MealDetail) => {
    setSelectedMealDetail(meal);
    setSelectedMealId(meal.idMeal);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedMealId(null);
    setSelectedMealDetail(null);
  }, []);

  const handleProceed = useCallback(() => {
    const ingredients = Array.from(selectedIngredients).join(",");
    const urgent = Array.from(urgentIngredients).join(",");
    router.push(
      `/resultados?ingredients=${encodeURIComponent(ingredients)}&zeroWaste=${zeroWaste}${urgent ? `&urgent=${encodeURIComponent(urgent)}` : ""}`
    );
  }, [selectedIngredients, urgentIngredients, zeroWaste, router]);

  const count = selectedIngredients.size;
  const shouldShowTooltip = showUrgentTooltip && count > 0 && !hasShownTooltip.current;
  if (shouldShowTooltip) hasShownTooltip.current = true;

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HeroSearch onAddIngredient={addIngredient} />

        {/* Selected ingredient chips */}
        {count > 0 && (
          <View style={styles.chipsRow}>
            {Array.from(selectedIngredients).map((name, idx) => {
              const isUrgent = urgentIngredients.has(name);
              return (
                <View
                  key={name}
                  style={[styles.chip, isUrgent && styles.chipUrgent]}
                >
                  <Pressable onPress={() => toggleIngredient(name)}>
                    <Text style={[styles.chipText, isUrgent && styles.chipTextUrgent]}>
                      ✓ {tIngredient(name)}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => toggleUrgent(name)}
                    style={[styles.urgentBtn, isUrgent && styles.urgentBtnActive]}
                  >
                    <AlarmClock size={12} color={isUrgent ? "#fff" : "#888"} />
                  </Pressable>

                  <Pressable onPress={() => toggleIngredient(name)}>
                    <Text style={styles.chipRemove}>×</Text>
                  </Pressable>
                </View>
              );
            })}

            {/* Tooltip hint */}
            {shouldShowTooltip && (
              <View style={styles.chipsRow}>
                <Text style={styles.tooltipText}>{t("urgent.tooltip")}</Text>
              </View>
            )}
          </View>
        )}

        {/* Zero Waste toggle */}
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setZeroWaste(!zeroWaste)}
            style={[styles.filterBtn, zeroWaste && styles.filterBtnActive]}
          >
            <Leaf size={16} color={zeroWaste ? "#22c55e" : "#666"} />
            <Text style={[styles.filterBtnText, zeroWaste && styles.filterBtnTextActive]}>
              {t("zerowaste.label")}
            </Text>
          </Pressable>
        </View>

        <PopularIngredients selected={selectedIngredients} onToggle={toggleIngredient} />

        <View style={{ height: 20 }} />

        <DailyRecipes onSelect={handleSelectDailyRecipe} zeroWaste={zeroWaste} />
      </ScrollView>

      {/* Sticky CTA */}
      {count > 0 && (
        <View
          style={[styles.ctaContainer, { bottom: 60 + insets.bottom }]}
        >
          <Pressable onPress={handleProceed} style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>
              {t("cta.see_recipes")} ({count} {count === 1 ? t("cta.item") : t("cta.items")})
            </Text>
            {urgentIngredients.size > 0 && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>
                  🚨 {urgentIngredients.size}{" "}
                  {urgentIngredients.size === 1 ? t("cta.urgent") : t("cta.urgents")}
                </Text>
              </View>
            )}
            <ChevronRight size={20} color="#fff" />
          </Pressable>
        </View>
      )}

      <BottomNav />

      <ApiRecipeDetail
        mealId={selectedMealId}
        meal={selectedMealDetail}
        onClose={handleClose}
        zeroWaste={zeroWaste}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f0f0f" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, gap: 16 },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, position: "relative" },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#1a1a1a", borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  chipUrgent: {
    borderColor: "rgba(239,68,68,0.5)",
    backgroundColor: "rgba(239,68,68,0.08)",
  },
  chipText: { fontSize: 12, fontWeight: "700", color: "#ccc" },
  chipTextUrgent: { color: "hsl(25,90%,55%)" },
  chipRemove: { fontSize: 16, color: "#555", lineHeight: 18 },
  urgentBtn: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: "#222", alignItems: "center", justifyContent: "center",
  },
  urgentBtnActive: { backgroundColor: "#ef4444" },

  tooltip: {
    position: "absolute", top: 40, left: 0, right: 0,
    backgroundColor: "#1a1a1a", borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", zIndex: 10,
  },
  tooltipText: { fontSize: 12, fontWeight: "600", color: "#fff" },

  filterRow: { flexDirection: "row" },
  filterBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
    backgroundColor: "#1a1a1a",
  },
  filterBtnActive: { backgroundColor: "rgba(34,197,94,0.12)" },
  filterBtnText: { fontSize: 13, fontWeight: "700", color: "#666" },
  filterBtnTextActive: { color: "#22c55e" },

  ctaContainer: {
    position: "absolute", left: 16, right: 16, zIndex: 40,
  },
  ctaBtn: {
    height: 54, borderRadius: 18, backgroundColor: "hsl(25,90%,55%)",
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingHorizontal: 20,
    shadowColor: "hsl(25,90%,55%)", shadowOpacity: 0.35,
    shadowRadius: 16, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  ctaBtnText: { fontSize: 15, fontWeight: "800", color: "#fff", flex: 1, textAlign: "center" },
  urgentBadge: {
    backgroundColor: "rgba(239,68,68,0.25)", paddingHorizontal: 8,
    paddingVertical: 2, borderRadius: 99,
  },
  urgentBadgeText: { fontSize: 11, fontWeight: "700", color: "#fca5a5" },
});
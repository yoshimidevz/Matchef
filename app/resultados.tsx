import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View, Text, Pressable, ScrollView, Image,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { ArrowLeft, RefreshCw, AlarmClock } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../src/components/matchchef/Header";
import { BottomNav } from "../src/components/matchchef/BottomNav";
import { ApiRecipeDetail } from "../src/components/matchchef/ApiRecipeDetail";
import { searchByIngredient, getMealById, type MealSummary, type MealDetail } from "../src/services/mealApi";
import { useLanguage } from "../src/i18n/LanguageContext";

// ── Substitutions ─────────────────────────────────────────────────────────────
const SUBSTITUTIONS: Record<string, { pt: string; en: string }> = {
  buttermilk:           { pt: "1 xícara de leite + 1 colher de limão", en: "1 cup milk + 1 tbsp lemon juice" },
  butter:               { pt: "Mesma quantidade de óleo de coco ou azeite", en: "Same amount of coconut oil or olive oil" },
  egg:                  { pt: "3 col. de aquafaba ou 1 banana amassada", en: "3 tbsp aquafaba or 1 mashed banana" },
  eggs:                 { pt: "3 col. de aquafaba ou 1 banana amassada", en: "3 tbsp aquafaba or 1 mashed banana" },
  cream:                { pt: "Leite de coco ou iogurte natural", en: "Coconut milk or plain yogurt" },
  milk:                 { pt: "Leite de aveia, amêndoas ou coco", en: "Oat, almond, or coconut milk" },
  sugar:                { pt: "Mel, açúcar mascavo ou adoçante", en: "Honey, brown sugar, or sweetener" },
  flour:                { pt: "Farinha de aveia ou farinha de amêndoas", en: "Oat flour or almond flour" },
  "plain flour":        { pt: "Farinha de aveia ou farinha de amêndoas", en: "Oat flour or almond flour" },
  "sour cream":         { pt: "Iogurte grego natural", en: "Plain Greek yogurt" },
  wine:                 { pt: "Suco de uva ou caldo de legumes", en: "Grape juice or vegetable broth" },
  honey:                { pt: "Xarope de agave ou açúcar mascavo", en: "Agave syrup or brown sugar" },
  cheese:               { pt: "Queijo vegano ou levedura nutricional", en: "Vegan cheese or nutritional yeast" },
  "chicken stock":      { pt: "Caldo de legumes", en: "Vegetable broth" },
  "beef stock":         { pt: "Caldo de legumes com shoyu", en: "Vegetable broth with soy sauce" },
  breadcrumbs:          { pt: "Aveia triturada ou farinha de rosca caseira", en: "Crushed oats or homemade breadcrumbs" },
};

function getSubstitution(ingredient: string, lang: "pt" | "en"): string | null {
  const lower = ingredient.toLowerCase().trim();
  for (const [key, value] of Object.entries(SUBSTITUTIONS)) {
    if (lower.includes(key)) return value[lang];
  }
  return null;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface EnrichedMeal {
  summary: MealSummary;
  detail: MealDetail | null;
  matchCount: number;
  totalIngredients: number;
  matchPercent: number;
  missingIngredients: { ingredient: string; measure: string }[];
  hasUrgentIngredient: boolean;
  urgentMatches: string[];
}

// ── SubTooltip inline ─────────────────────────────────────────────────────────
function SubTooltip({ ingredient, sub }: { ingredient: string; sub: string }) {
  const [open, setOpen] = useState(false);
  const { t, tIngredient } = useLanguage();
  return (
    <View>
      <Pressable
        onPress={(e) => { setOpen(!open); }}
        style={styles.subBtn}
      >
        <RefreshCw size={10} color="#22c55e" />
      </Pressable>
      {open && (
        <View style={styles.subTooltip}>
          <Text style={styles.subTooltipTitle}>{t("substitution.title")}</Text>
          <Text style={styles.subTooltipText}>
            {t("substitution.missing_prefix")}{" "}
            <Text style={{ color: "hsl(25,90%,55%)" }}>{tIngredient(ingredient)}</Text>?
          </Text>
          <Text style={styles.subTooltipSub}>
            {t("substitution.swap")}{" "}
            <Text style={{ fontWeight: "700", color: "#fff" }}>{sub}</Text>
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function Resultados() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    ingredients: string;
    zeroWaste: string;
    urgent: string;
  }>();
  const { t, tIngredient, language } = useLanguage();
  const insets = useSafeAreaInsets();

  const ingredientsParam = params.ingredients || "";
  const zeroWaste = params.zeroWaste === "true";
  const urgentParam = params.urgent || "";
  const userIngredients = ingredientsParam.split(",").filter(Boolean);
  const urgentIngredients = useMemo(
    () => new Set(urgentParam.split(",").filter(Boolean)),
    [urgentParam]
  );

  const [enriched, setEnriched] = useState<EnrichedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedMealDetail, setSelectedMealDetail] = useState<MealDetail | null>(null);

  useEffect(() => {
    if (userIngredients.length === 0) return;

    setLoading(true);
    setNoResults(false);

    Promise.all(userIngredients.map((ing) => searchByIngredient(ing)))
      .then((allResults) => {
        const seen = new Set<string>();
        const merged: MealSummary[] = [];
        for (const list of allResults) {
          for (const meal of list) {
            if (!seen.has(meal.idMeal)) {
              seen.add(meal.idMeal);
              merged.push(meal);
            }
          }
        }
        setLoading(false);

        if (merged.length === 0) { setNoResults(true); return; }

        setEnriching(true);
        const top = merged.slice(0, 12);
        return Promise.all(
          top.map(async (meal) => {
            const detail = await getMealById(meal.idMeal);
            if (!detail) return null;

            const userSet = new Set(userIngredients.map((u) => u.toLowerCase()));
            const matchCount = detail.ingredients.filter((ing) =>
              userSet.has(ing.ingredient.toLowerCase()) ||
              Array.from(userSet).some((u) => ing.ingredient.toLowerCase().includes(u.toLowerCase()))
            ).length;
            const totalIngredients = detail.ingredients.length;
            const matchPercent = totalIngredients > 0
              ? Math.round((matchCount / totalIngredients) * 100) : 0;
            const missingIngredients = detail.ingredients.filter(
              (ing) =>
                !userSet.has(ing.ingredient.toLowerCase()) &&
                !Array.from(userSet).some((u) => ing.ingredient.toLowerCase().includes(u.toLowerCase()))
            );
            const urgentMatches = detail.ingredients
              .filter((ing) =>
                Array.from(urgentIngredients).some((u) =>
                  ing.ingredient.toLowerCase().includes(u.toLowerCase())
                )
              )
              .map((ing) => ing.ingredient);

            return {
              summary: meal, detail,
              matchCount, totalIngredients, matchPercent,
              missingIngredients,
              hasUrgentIngredient: urgentMatches.length > 0,
              urgentMatches,
            } as EnrichedMeal;
          })
        );
      })
      .then((items) => {
        if (!items) return;
        const valid = items.filter(Boolean) as EnrichedMeal[];
        valid.sort((a, b) => {
          if (a.hasUrgentIngredient && !b.hasUrgentIngredient) return -1;
          if (!a.hasUrgentIngredient && b.hasUrgentIngredient) return 1;
          return b.matchPercent - a.matchPercent;
        });
        setEnriched(valid);
        if (valid.length === 0) setNoResults(true);
        setEnriching(false);
      })
      .catch(() => { setLoading(false); setEnriching(false); });
  }, [ingredientsParam]);

  const handleSelect = useCallback((meal: EnrichedMeal) => {
    setSelectedMealDetail(meal.detail);
    setSelectedMealId(meal.summary.idMeal);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedMealId(null);
    setSelectedMealDetail(null);
  }, []);

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page header */}
        <View style={styles.pageHeader}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#fff" />
          </Pressable>
          <View>
            <Text style={styles.pageTitle}>{t("results.title")}</Text>
            <Text style={styles.pageSubtitle}>
              {userIngredients.length}{" "}
              {userIngredients.length > 1 ? t("results.ingredients") : t("results.ingredient")}{" "}
              {userIngredients.length > 1 ? t("results.selected_plural") : t("results.selected")}
              {urgentIngredients.size > 0 && (
                <Text style={styles.urgentCount}>
                  {" · "}{urgentIngredients.size}{" "}
                  {urgentIngredients.size > 1 ? t("results.urgent_count_plural") : t("results.urgent_count")}
                </Text>
              )}
            </Text>
          </View>
        </View>

        {/* Ingredient chips */}
        <View style={styles.chipsRow}>
          {userIngredients.map((name) => {
            const isUrgent = urgentIngredients.has(name);
            return (
              <View key={name} style={[styles.chip, isUrgent && styles.chipUrgent]}>
                {isUrgent && <AlarmClock size={11} color="#ef4444" />}
                <Text style={[styles.chipText, isUrgent && styles.chipTextUrgent]}>
                  {tIngredient(name)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Loading skeleton */}
        {loading && (
          <View style={styles.skeletonList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.skeletonCard}>
                <View style={styles.skeletonImage} />
                <View style={styles.skeletonInfo}>
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonLine} />
                  <View style={styles.skeletonBar} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Enriching indicator */}
        {enriching && !loading && (
          <View style={styles.enrichingRow}>
            <ActivityIndicator size="small" color="hsl(25,90%,55%)" />
            <Text style={styles.enrichingText}>{t("results.analyzing")}</Text>
          </View>
        )}

        {/* Results */}
        {!loading && enriched.length > 0 && (
          <View style={styles.resultsList}>
            {enriched.map((meal) => (
              <Pressable
                key={meal.summary.idMeal}
                onPress={() => handleSelect(meal)}
                style={[styles.resultCard, meal.hasUrgentIngredient && styles.resultCardUrgent]}
              >
                {/* Urgent badge */}
                {meal.hasUrgentIngredient && (
                  <View style={styles.urgentBadge}>
                    <AlarmClock size={10} color="#ef4444" />
                    <Text style={styles.urgentBadgeText}>
                      {t("results.save_your")} {tIngredient(meal.urgentMatches[0])}!
                    </Text>
                  </View>
                )}

                <View style={[styles.resultRow, meal.hasUrgentIngredient && { paddingTop: 8 }]}>
                  {/* Thumbnail */}
                  <Image
                    source={{ uri: meal.summary.strMealThumb }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />

                  <View style={styles.resultInfo}>
                    {/* Title + 100% badge */}
                    <View style={styles.titleRow}>
                      <Text style={styles.mealName} numberOfLines={1}>
                        {meal.summary.strMeal}
                      </Text>
                      {meal.matchPercent === 100 && (
                        <View style={styles.perfectBadge}>
                          <Text style={styles.perfectBadgeText}>100%</Text>
                        </View>
                      )}
                    </View>

                    {/* Progress bar */}
                    <View style={styles.barBg}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${meal.matchPercent}%` },
                          meal.matchPercent === 100 ? styles.barFillPerfect : styles.barFillAlmost,
                        ]}
                      />
                    </View>
                    <Text style={styles.matchText}>
                      {t("results.you_have")} {meal.matchCount} {t("results.of")}{" "}
                      {meal.totalIngredients} {t("results.ingredients")}
                    </Text>

                    {/* Missing ingredients */}
                    {meal.missingIngredients.length > 0 &&
                      meal.missingIngredients.length <= 4 && (
                        <View style={styles.missingRow}>
                          <Text style={styles.missingLabel}>{t("results.missing")}</Text>
                          {meal.missingIngredients.slice(0, 3).map((ing) => {
                            const sub = getSubstitution(ing.ingredient, language);
                            return (
                              <View key={ing.ingredient} style={styles.missingItem}>
                                <View style={styles.missingChip}>
                                  <Text style={styles.missingChipText}>
                                    {tIngredient(ing.ingredient)}
                                  </Text>
                                </View>
                                {sub && <SubTooltip ingredient={ing.ingredient} sub={sub} />}
                              </View>
                            );
                          })}
                          {meal.missingIngredients.length > 3 && (
                            <Text style={styles.missingMore}>
                              +{meal.missingIngredients.length - 3}
                            </Text>
                          )}
                        </View>
                      )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* No results */}
        {!loading && !enriching && noResults && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🤔</Text>
            <Text style={styles.emptyText}>{t("results.no_results")}</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.goBack}>{t("results.go_back")}</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

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
  content: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },

  pageHeader: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#1a1a1a", alignItems: "center", justifyContent: "center",
  },
  pageTitle: { fontSize: 17, fontWeight: "800", color: "#fff" },
  pageSubtitle: { fontSize: 11, color: "#555", marginTop: 2 },
  urgentCount: { color: "#ef4444", fontWeight: "700" },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#1a1a1a", paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 99, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  chipUrgent: {
    backgroundColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.4)",
  },
  chipText: { fontSize: 11, fontWeight: "700", color: "#aaa" },
  chipTextUrgent: { color: "#ef4444" },

  skeletonList: { gap: 10 },
  skeletonCard: {
    flexDirection: "row", gap: 12,
    backgroundColor: "#1a1a1a", borderRadius: 16, padding: 12,
  },
  skeletonImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: "#2a2a2a" },
  skeletonInfo: { flex: 1, gap: 8, paddingVertical: 4 },
  skeletonTitle: { height: 14, width: "75%", borderRadius: 8, backgroundColor: "#2a2a2a" },
  skeletonLine: { height: 11, width: "100%", borderRadius: 8, backgroundColor: "#2a2a2a" },
  skeletonBar: { height: 6, width: "100%", borderRadius: 99, backgroundColor: "#2a2a2a" },

  enrichingRow: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" },
  enrichingText: { fontSize: 12, color: "#555" },

  resultsList: { gap: 10 },
  resultCard: {
    backgroundColor: "#1a1a1a", borderRadius: 16,
    padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  resultCardUrgent: {
    borderColor: "rgba(239,68,68,0.3)",
    shadowColor: "#ef4444", shadowOpacity: 0.1,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  urgentBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(239,68,68,0.12)",
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99,
    alignSelf: "flex-start", marginBottom: 6,
    borderWidth: 1, borderColor: "rgba(239,68,68,0.3)",
  },
  urgentBadgeText: { fontSize: 10, fontWeight: "700", color: "#ef4444" },

  resultRow: { flexDirection: "row", gap: 12 },
  thumbnail: { width: 80, height: 80, borderRadius: 12, backgroundColor: "#2a2a2a" },
  resultInfo: { flex: 1, gap: 4 },

  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  mealName: { flex: 1, fontSize: 14, fontWeight: "800", color: "#fff" },
  perfectBadge: {
    backgroundColor: "rgba(255,120,50,0.15)",
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99,
  },
  perfectBadgeText: { fontSize: 10, fontWeight: "700", color: "hsl(25,90%,55%)" },

  barBg: { height: 5, borderRadius: 99, backgroundColor: "#2a2a2a", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 99 },
  barFillPerfect: { backgroundColor: "hsl(25,90%,55%)" },
  barFillAlmost: { backgroundColor: "#facc15" },
  matchText: { fontSize: 10, color: "#555" },

  missingRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4, marginTop: 2 },
  missingLabel: { fontSize: 10, color: "#555", fontWeight: "600" },
  missingItem: { flexDirection: "row", alignItems: "center", gap: 2 },
  missingChip: {
    backgroundColor: "#2a2a2a", paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 99,
  },
  missingChipText: { fontSize: 10, color: "#666" },
  missingMore: { fontSize: 10, color: "#555" },

  subBtn: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  subTooltip: {
    position: "absolute", right: 0, bottom: 22, width: 200,
    backgroundColor: "#1a1a1a", borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", zIndex: 99,
  },
  subTooltipTitle: { fontSize: 9, fontWeight: "700", color: "#555", marginBottom: 3 },
  subTooltipText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  subTooltipSub: { fontSize: 12, color: "#888", marginTop: 3 },

  empty: { alignItems: "center", paddingVertical: 64, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 14, fontWeight: "600", color: "#555", textAlign: "center" },
  goBack: { fontSize: 14, fontWeight: "700", color: "hsl(25,90%,55%)" },
});
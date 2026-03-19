import { useEffect, useState } from "react";
import {
  View, Text, Pressable, ScrollView, Image,
  StyleSheet, Modal, Linking, ActivityIndicator,
} from "react-native";
import { X, Globe, Tag, Youtube, RefreshCw, Recycle } from "lucide-react-native";
import { getMealById, type MealDetail } from "../../services/mealApi";
import { useLanguage, useTranslatedIngredients, type Language } from "../../i18n/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SUBSTITUTIONS: Record<string, { pt: string; en: string }> = {
  buttermilk:          { pt: "1 xícara de leite + 1 colher de limão", en: "1 cup milk + 1 tbsp lemon juice" },
  butter:              { pt: "Mesma quantidade de óleo de coco ou azeite", en: "Same amount of coconut oil or olive oil" },
  egg:                 { pt: "3 col. de aquafaba ou 1 banana amassada", en: "3 tbsp aquafaba or 1 mashed banana" },
  eggs:                { pt: "3 col. de aquafaba ou 1 banana amassada", en: "3 tbsp aquafaba or 1 mashed banana" },
  cream:               { pt: "Leite de coco ou iogurte natural", en: "Coconut milk or plain yogurt" },
  milk:                { pt: "Leite de aveia, amêndoas ou coco", en: "Oat, almond, or coconut milk" },
  sugar:               { pt: "Mel, açúcar mascavo ou adoçante", en: "Honey, brown sugar, or sweetener" },
  flour:               { pt: "Farinha de aveia ou farinha de amêndoas", en: "Oat flour or almond flour" },
  "plain flour":       { pt: "Farinha de aveia ou farinha de amêndoas", en: "Oat flour or almond flour" },
  "sour cream":        { pt: "Iogurte grego natural", en: "Plain Greek yogurt" },
  wine:                { pt: "Suco de uva ou caldo de legumes", en: "Grape juice or vegetable broth" },
  cheese:              { pt: "Queijo vegano ou levedura nutricional", en: "Vegan cheese or nutritional yeast" },
  "chicken stock":     { pt: "Caldo de legumes", en: "Vegetable broth" },
  "beef stock":        { pt: "Caldo de legumes com shoyu", en: "Vegetable broth with soy sauce" },
  breadcrumbs:         { pt: "Aveia triturada ou farinha de rosca caseira", en: "Crushed oats or homemade breadcrumbs" },
};

function getSubstitution(ingredient: string, lang: Language): string | null {
  const lower = ingredient.toLowerCase().trim();
  for (const [key, value] of Object.entries(SUBSTITUTIONS)) {
    if (lower.includes(key)) return value[lang];
  }
  return null;
}

const ZERO_WASTE_TRANSFORMS: [RegExp, string, string, string, string][] = [
  [/chicken/i,    "Ossos",   "um caldo caseiro rico",        "Bones",    "a rich homemade broth"],
  [/beef|steak/i, "Gordura", "um óleo aromatizado",          "Fat",      "a flavored oil"],
  [/carrot/i,     "Cascas",  "chips crocantes",              "Peels",    "crispy chips"],
  [/potato/i,     "Cascas",  "um petisco assado",            "Peels",    "a roasted snack"],
  [/onion/i,      "Cascas",  "um caldo nutritivo",           "Peels",    "a nutritious broth"],
  [/broccoli/i,   "Talos",   "um refogado delicioso",        "Stems",    "a delicious stir-fry"],
  [/bread/i,      "Sobras",  "farinha de rosca caseira",     "Leftovers","homemade breadcrumbs"],
  [/rice/i,       "Sobras",  "bolinhos fritos crocantes",    "Leftovers","crispy fried rice balls"],
  [/banana/i,     "Cascas",  "biomassa funcional",           "Peels",    "functional biomass"],
];

function getZeroWasteDetail(meal: MealDetail, lang: Language) {
  for (const { ingredient } of meal.ingredients) {
    for (const [pattern, partPt, transformPt, partEn, transformEn] of ZERO_WASTE_TRANSFORMS) {
      if (pattern.test(ingredient)) {
        return {
          ingredient,
          part: lang === "pt" ? partPt : partEn,
          transform: lang === "pt" ? transformPt : transformEn,
        };
      }
    }
  }
  return null;
}

function SubTooltip({ ingredient, translatedName, sub, lang }: {
  ingredient: string;
  translatedName: string;
  sub: string;
  lang: Language;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <View>
      <Pressable onPress={() => setOpen(!open)} style={styles.subBtn}>
        <RefreshCw size={14} color="#22c55e" />
      </Pressable>
      {open && (
        <View style={styles.subTooltip}>
          <Text style={styles.subTooltipTitle}>{t("substitution.title")}</Text>
          <Text style={styles.subTooltipText}>
            {t("substitution.missing_prefix")}{" "}
            <Text style={{ color: "hsl(25,90%,55%)" }}>{translatedName}</Text>?
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

// ── Main Component ────────────────────────────────────────────────────────────
interface ApiRecipeDetailProps {
  mealId: string | null;
  meal?: MealDetail | null;
  onClose: () => void;
  zeroWaste?: boolean;
}

export function ApiRecipeDetail({ mealId, meal: preloaded, onClose, zeroWaste }: ApiRecipeDetailProps) {
  const [meal, setMeal] = useState<MealDetail | null>(preloaded || null);
  const [loading, setLoading] = useState(!preloaded);
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();

  const ingredientNames = meal?.ingredients.map((i) => i.ingredient) ?? [];
  const translatedIngredients = useTranslatedIngredients(ingredientNames);

  const zwDetail = meal ? getZeroWasteDetail(meal, language) : null;
  const translatedZwIngredient = useTranslatedIngredients(
    zwDetail ? [zwDetail.ingredient] : []
  );

  useEffect(() => {
    if (preloaded) { setMeal(preloaded); setLoading(false); return; }
    if (!mealId) return;
    setLoading(true);
    getMealById(mealId).then(setMeal).finally(() => setLoading(false));
  }, [mealId, preloaded]);

  const visible = !!(mealId || preloaded);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {loading ? t("detail.loading") : meal?.strMeal}
          </Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#fff" />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="hsl(25,90%,55%)" size="large" />
          </View>
        ) : meal ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
            <Image source={{ uri: meal.strMealThumb }} style={styles.heroImage} resizeMode="cover" />

            <View style={styles.content}>
              {/* Tags */}
              <View style={styles.tagsRow}>
                {meal.strCategory ? (
                  <View style={styles.tagPrimary}>
                    <Tag size={11} color="hsl(25,90%,55%)" />
                    <Text style={styles.tagPrimaryText}>{meal.strCategory}</Text>
                  </View>
                ) : null}
                {meal.strArea ? (
                  <View style={styles.tagAccent}>
                    <Globe size={11} color="#a78bfa" />
                    <Text style={styles.tagAccentText}>{meal.strArea}</Text>
                  </View>
                ) : null}
                {meal.strTags
                  ? meal.strTags.split(",").map((tag) => (
                      <View key={tag} style={styles.tagMuted}>
                        <Text style={styles.tagMutedText}>{tag.trim()}</Text>
                      </View>
                    ))
                  : null}
              </View>

              {/* Zero Waste */}
              {zeroWaste && zwDetail && (
                <View style={styles.zeroWasteCard}>
                  <View style={styles.zeroWasteIcon}>
                    <Recycle size={20} color="#22c55e" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.zeroWasteTitle}>{t("zerowaste.magic_title")}</Text>
                    <Text style={styles.zeroWasteDesc}>
                      {t("zerowaste.description_prefix")}{" "}
                      <Text style={{ fontWeight: "700", color: "#fff" }}>
                        {zwDetail.part.toLowerCase()} {language === "pt" ? "de" : "of"}{" "}
                        {(translatedZwIngredient[0] ?? zwDetail.ingredient).toLowerCase()}
                      </Text>{" "}
                      {t("zerowaste.description_mid")}{" "}
                      <Text style={{ fontWeight: "700", color: "#22c55e" }}>{zwDetail.transform}</Text>.
                    </Text>
                  </View>
                </View>
              )}

              {/* Ingredients */}
              <Text style={styles.sectionTitle}>
                {t("detail.ingredients_title")} ({meal.ingredients.length})
              </Text>
              {meal.ingredients.map((item, i) => {
                const sub = getSubstitution(item.ingredient, language);
                const translatedName = translatedIngredients[i] ?? item.ingredient;
                return (
                  <View key={i} style={styles.ingredientRow}>
                    <View style={styles.ingredientNum}>
                      <Text style={styles.ingredientNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.ingredientName} numberOfLines={1}>
                      {translatedName}
                    </Text>
                    <Text style={styles.ingredientMeasure}>{item.measure}</Text>
                    {sub ? (
                      <SubTooltip
                        ingredient={item.ingredient}
                        translatedName={translatedName}
                        sub={sub}
                        lang={language}
                      />
                    ) : null}
                  </View>
                );
              })}

              {/* Instructions */}
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                {t("detail.preparation")}
              </Text>
              <View style={styles.instructionsCard}>
                <Text style={styles.instructions}>{meal.strInstructions}</Text>
              </View>

              {/* YouTube */}
              {meal.strYoutube ? (
                <Pressable onPress={() => Linking.openURL(meal.strYoutube)} style={styles.youtubeBtn}>
                  <Youtube size={18} color="hsl(25,90%,55%)" />
                  <Text style={styles.youtubeBtnText}>{t("detail.youtube")}</Text>
                </Pressable>
              ) : null}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={{ fontSize: 48 }}>😕</Text>
            <Text style={styles.notFound}>{t("detail.not_found")}</Text>
          </View>
        )}

        {meal && !loading && (
          <View style={[styles.ctaContainer, { paddingBottom: insets.bottom || 16 }]}>
            <Pressable style={styles.ctaBtn} onPress={onClose}>
              <Text style={styles.ctaBtnText}>{t("detail.start_cooking")}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(15,15,15,0.9)",
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: "800", color: "#fff", marginRight: 12 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#1a1a1a", alignItems: "center", justifyContent: "center",
  },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  heroImage: { width: "100%", aspectRatio: 16 / 9 },
  content: { padding: 16, gap: 12 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagPrimary: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(255,120,50,0.12)", paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 99,
  },
  tagPrimaryText: { fontSize: 11, fontWeight: "700", color: "hsl(25,90%,55%)" },
  tagAccent: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(167,139,250,0.12)", paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 99,
  },
  tagAccentText: { fontSize: 11, fontWeight: "700", color: "#a78bfa" },
  tagMuted: { backgroundColor: "#1a1a1a", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  tagMutedText: { fontSize: 11, color: "#666" },
  zeroWasteCard: {
    flexDirection: "row", gap: 12, alignItems: "flex-start",
    backgroundColor: "rgba(34,197,94,0.08)", borderRadius: 16,
    borderWidth: 1, borderColor: "rgba(34,197,94,0.2)", padding: 14,
  },
  zeroWasteIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(34,197,94,0.12)", alignItems: "center", justifyContent: "center",
  },
  zeroWasteTitle: { fontSize: 13, fontWeight: "800", color: "#22c55e", marginBottom: 4 },
  zeroWasteDesc: { fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 18 },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: "#fff" },
  ingredientRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#1a1a1a", borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, marginTop: 6,
  },
  ingredientNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "rgba(255,120,50,0.15)", alignItems: "center", justifyContent: "center",
  },
  ingredientNumText: { fontSize: 11, fontWeight: "700", color: "hsl(25,90%,55%)" },
  ingredientName: { flex: 1, fontSize: 14, fontWeight: "500", color: "#fff" },
  ingredientMeasure: { fontSize: 12, color: "#555" },
  subBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(34,197,94,0.12)", alignItems: "center", justifyContent: "center",
  },
  subTooltip: {
    position: "absolute", right: 0, bottom: 36, width: 220,
    backgroundColor: "#1a1a1a", borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", zIndex: 99,
  },
  subTooltipTitle: { fontSize: 10, fontWeight: "700", color: "#555", marginBottom: 4 },
  subTooltipText: { fontSize: 13, fontWeight: "600", color: "#fff" },
  subTooltipSub: { fontSize: 13, color: "#888", marginTop: 4 },
  instructionsCard: { backgroundColor: "#1a1a1a", borderRadius: 16, padding: 16 },
  instructions: { fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 22 },
  youtubeBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  youtubeBtnText: { fontSize: 14, fontWeight: "700", color: "hsl(25,90%,55%)" },
  ctaContainer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingTop: 12,
    backgroundColor: "rgba(15,15,15,0.95)",
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)",
  },
  ctaBtn: {
    height: 52, borderRadius: 16, backgroundColor: "hsl(25,90%,55%)",
    alignItems: "center", justifyContent: "center",
  },
  ctaBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  notFound: { fontSize: 15, fontWeight: "600", color: "#555" },
});
import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Image, StyleSheet, ActivityIndicator } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { getRandomMeals, type MealDetail } from "../../services/mealApi";
import { useLanguage, type Language } from "../../i18n/LanguageContext";

interface DailyRecipesProps {
  onSelect: (meal: MealDetail) => void;
  zeroWaste?: boolean;
}

const ZERO_WASTE_TRANSFORMS: [RegExp, string, string][] = [
  [/chicken/i,        "Ossos ➔ Caldo caseiro",      "Bones ➔ Homemade broth"],
  [/beef|steak/i,     "Gordura ➔ Óleo aromatizado", "Fat ➔ Flavored oil"],
  [/pepper/i,         "Sementes ➔ Tempero",         "Seeds ➔ Seasoning"],
  [/carrot/i,         "Cascas ➔ Chips crocantes",   "Peels ➔ Crispy chips"],
  [/potato/i,         "Cascas ➔ Petisco assado",    "Peels ➔ Roasted snack"],
  [/lemon|lime/i,     "Cascas ➔ Zest aromático",    "Peels ➔ Aromatic zest"],
  [/onion/i,          "Cascas ➔ Caldo nutritivo",   "Peels ➔ Nutritious broth"],
  [/broccoli/i,       "Talos ➔ Refogado",           "Stems ➔ Stir-fry"],
  [/cheese/i,         "Cascas ➔ Sabor no caldo",    "Rinds ➔ Broth flavor"],
  [/bread/i,          "Sobras ➔ Farinha de rosca",  "Leftovers ➔ Breadcrumbs"],
  [/rice/i,           "Sobras ➔ Bolinho frito",     "Leftovers ➔ Fried rice balls"],
  [/banana/i,         "Cascas ➔ Biomassa",          "Peels ➔ Biomass"],
  [/apple/i,          "Cascas ➔ Chá aromático",     "Peels ➔ Aromatic tea"],
];

function getZeroWasteLabel(meal: MealDetail, lang: Language): string {
  for (const { ingredient } of meal.ingredients) {
    for (const [pattern, labelPt, labelEn] of ZERO_WASTE_TRANSFORMS) {
      if (pattern.test(ingredient)) return lang === "pt" ? labelPt : labelEn;
    }
  }
  return lang === "pt" ? "Sobras ➔ Novo prato" : "Leftovers ➔ New dish";
}

export function DailyRecipes({ onSelect, zeroWaste }: DailyRecipesProps) {
  const [meals, setMeals] = useState<MealDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    getRandomMeals(8)
      .then(setMeals)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Animated.View entering={FadeInDown.delay(300).duration(400)}>
      <Text style={styles.sectionTitle}>{t("daily.title")}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={188}
        decelerationRate="fast"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.skeletonCard}>
                <View style={styles.skeletonImage} />
                <View style={styles.skeletonText} />
              </View>
            ))
          : meals.map((meal, i) => (
              <Animated.View
                key={meal.idMeal}
                entering={FadeInRight.delay(i * 60).duration(300)}
              >
                <Pressable onPress={() => onSelect(meal)} style={styles.card}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: meal.strMealThumb }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    {meal.strArea ? (
                      <View style={styles.areaBadge}>
                        <Text style={styles.areaBadgeText}>{meal.strArea}</Text>
                      </View>
                    ) : null}
                    {zeroWaste && (
                      <View style={styles.zeroWasteBanner}>
                        <Text style={styles.zeroWasteText} numberOfLines={1}>
                          ♻️ {getZeroWasteLabel(meal, language)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.mealName} numberOfLines={2}>
                    {meal.strMeal}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#555",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  scroll: {
    marginHorizontal: -16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 176,
  },
  imageContainer: {
    width: 176,
    height: 176,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  areaBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  areaBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  zeroWasteBanner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(34,197,94,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  zeroWasteText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  mealName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    marginTop: 8,
    lineHeight: 18,
  },
  skeletonCard: {
    width: 176,
  },
  skeletonImage: {
    width: 176,
    height: 176,
    borderRadius: 18,
    backgroundColor: "#1a1a1a",
  },
  skeletonText: {
    width: 112,
    height: 14,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    marginTop: 8,
  },
});
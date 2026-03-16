import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Check } from "lucide-react-native";
import { useLanguage, type TranslationKey } from "../../i18n/LanguageContext";

interface PopularIngredientsProps {
  selected: Set<string>;
  onToggle: (name: string) => void;
}

interface IngredientItem {
  name: string;
  emoji: string;
}

const categories: { id: string; labelKey: TranslationKey; emoji: string; items: IngredientItem[] }[] = [
  {
    id: "proteinas",
    labelKey: "cat.proteins",
    emoji: "🥩",
    items: [
      { name: "Chicken", emoji: "🍗" },
      { name: "Beef", emoji: "🥩" },
      { name: "Pork", emoji: "🥓" },
      { name: "Fish", emoji: "🐟" },
      { name: "Egg", emoji: "🥚" },
    ],
  },
  {
    id: "vegetais",
    labelKey: "cat.vegetables",
    emoji: "🥬",
    items: [
      { name: "Onion", emoji: "🧅" },
      { name: "Garlic", emoji: "🧄" },
      { name: "Tomato", emoji: "🍅" },
      { name: "Potato", emoji: "🥔" },
      { name: "Carrot", emoji: "🥕" },
      { name: "Broccoli", emoji: "🥦" },
      { name: "Pepper", emoji: "🫑" },
      { name: "Lettuce", emoji: "🥬" },
    ],
  },
  {
    id: "despensa",
    labelKey: "cat.pantry",
    emoji: "🏪",
    items: [
      { name: "Rice", emoji: "🍚" },
      { name: "Pasta", emoji: "🍝" },
      { name: "Beans", emoji: "🫘" },
      { name: "Flour", emoji: "🌾" },
      { name: "Sugar", emoji: "🍬" },
      { name: "Salt", emoji: "🧂" },
      { name: "Oil", emoji: "🫒" },
    ],
  },
  {
    id: "laticinios",
    labelKey: "cat.dairy",
    emoji: "🧀",
    items: [
      { name: "Milk", emoji: "🥛" },
      { name: "Butter", emoji: "🧈" },
      { name: "Cheese", emoji: "🧀" },
    ],
  },
];

export function PopularIngredients({ selected, onToggle }: PopularIngredientsProps) {
  const { t, tIngredient } = useLanguage();
  const [activeTab, setActiveTab] = useState("proteinas");

  const activeCategory = categories.find((c) => c.id === activeTab)!;

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)}>
      <Text style={styles.sectionTitle}>{t("popular.title")}</Text>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map((cat) => {
          const active = cat.id === activeTab;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setActiveTab(cat.id)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={styles.tabEmoji}>{cat.emoji}</Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {t(cat.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Grid */}
      <View style={styles.grid}>
        {activeCategory.items.map((item, i) => {
          const isSelected = selected.has(item.name);
          return (
            <Animated.View
              key={item.name}
              entering={ZoomIn.delay(i * 30).duration(200)}
              style={styles.gridCell}
            >
              <Pressable
                onPress={() => onToggle(item.name)}
                style={[styles.ingredientBtn, isSelected && styles.ingredientBtnSelected]}
              >
                {isSelected ? (
                  <Check size={20} color="#fff" />
                ) : (
                  <Text style={styles.ingredientEmoji}>{item.emoji}</Text>
                )}
                <Text
                  style={[styles.ingredientLabel, isSelected && styles.ingredientLabelSelected]}
                  numberOfLines={1}
                >
                  {tIngredient(item.name)}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
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
  tabsScroll: {
    marginBottom: 12,
  },
  tabsContent: {
    gap: 6,
    paddingRight: 4,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
  },
  tabActive: {
    backgroundColor: "hsl(25,90%,55%)",
  },
  tabEmoji: {
    fontSize: 14,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
  },
  tabLabelActive: {
    color: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridCell: {
    width: "30.5%",
  },
  ingredientBtn: {
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#1a1a1a",
  },
  ingredientBtnSelected: {
    backgroundColor: "hsl(25,90%,55%)",
  },
  ingredientEmoji: {
    fontSize: 24,
  },
  ingredientLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#aaa",
    textAlign: "center",
  },
  ingredientLabelSelected: {
    color: "#fff",
  },
});
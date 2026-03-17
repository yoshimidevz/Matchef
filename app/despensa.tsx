import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../src/components/matchchef/Header";
import { ChefLevel } from "../src/components/matchchef/ChefLevel";
import { IngredientSelector } from "../src/components/matchchef/IngredientSelector";
import { VibeFilters } from "../src/components/matchchef/VibeFilters";
import { RecipeList } from "../src/components/matchchef/RecipeList";
import { KitchenMode } from "../src/components/matchchef/KitchenMode";
import { ShoppingList } from "../src/components/matchchef/ShoppingList";
import { useMatchChef, type MatchedRecipe } from "../src/hooks/useMatchChef";
import { Bot } from "lucide-react-native";
import { BottomNav } from "../src/components/matchchef/BottomNav";

export default function Despensa() {
  const insets = useSafeAreaInsets();
  const {
    selectedIngredients, toggleIngredient,
    activeVibes, toggleVibe,
    perfectMatches, almostMatches,
    shoppingList, addToShoppingList, removeFromShoppingList,
    completedRecipes, completeRecipe, chefLevel,
  } = useMatchChef();

  const [kitchenRecipe, setKitchenRecipe] = useState<MatchedRecipe | null>(null);

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ChefLevel
          level={chefLevel.level}
          title={chefLevel.title}
          progress={chefLevel.progress}
          completedRecipes={completedRecipes}
        />

        <IngredientSelector
          selected={selectedIngredients}
          onToggle={toggleIngredient}
        />

        <VibeFilters
          active={activeVibes}
          onToggle={toggleVibe}
        />

        <RecipeList
          perfectMatches={perfectMatches}
          almostMatches={almostMatches}
          onOpen={setKitchenRecipe}
          onAddToShoppingList={addToShoppingList}
          hasSelection={selectedIngredients.size > 0}
        />
      </ScrollView>
      <BottomNav/>

      <ShoppingList items={shoppingList} onRemove={removeFromShoppingList} />

      {kitchenRecipe && (
        <KitchenMode
          recipe={kitchenRecipe}
          onClose={() => setKitchenRecipe(null)}
          onComplete={completeRecipe}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
  },
});
import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Search, Plus } from "lucide-react-native";
import { useLanguage } from "../../i18n/LanguageContext";

interface HeroSearchProps {
  onAddIngredient: (name: string) => void;
}

export function HeroSearch({ onAddIngredient }: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (query.trim()) {
      onAddIngredient(query.trim());
      setQuery("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("hero.title_prefix")}{" "}
        <Text style={styles.titleHighlight}>{t("hero.title_highlight")}</Text>?
      </Text>

      <Text style={styles.subtitle}>{t("hero.subtitle")}</Text>

      <View style={styles.inputRow}>
        <Search size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          placeholder={t("hero.placeholder")}
          placeholderTextColor="#555"
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable
          onPress={handleSubmit}
          disabled={!query.trim()}
          style={[styles.addBtn, !query.trim() && styles.addBtnDisabled]}
        >
          <Plus size={16} color="#fff" />
          <Text style={styles.addBtnText}>{t("hero.add")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  titleHighlight: {
    color: "hsl(25,90%,55%)",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  inputRow: {
    width: "100%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingLeft: 14,
    paddingRight: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
    height: "100%",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "hsl(25,90%,55%)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});
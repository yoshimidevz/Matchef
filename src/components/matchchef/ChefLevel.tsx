import { View, Text, StyleSheet } from "react-native";
import { Trophy } from "lucide-react-native";
import { useLanguage } from "../../i18n/LanguageContext";

interface ChefLevelProps {
  level: number;
  title: string;
  progress: number;
  completedRecipes: number;
}

export function ChefLevel({ level, title, progress, completedRecipes }: ChefLevelProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Trophy size={20} color="hsl(25,90%,55%)" />
        </View>
        <View style={styles.info}>
          <Text style={styles.levelLabel}>{t("chef.level")} {level}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.count}>{completedRecipes} {t("despensa.recipes")}</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  iconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,120,50,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  info: { flex: 1 },
  levelLabel: { fontSize: 11, color: "#666" },
  title: { fontSize: 15, fontWeight: "800", color: "#fff" },
  count: { fontSize: 13, fontWeight: "600", color: "#555" },
  barBg: { height: 6, borderRadius: 99, backgroundColor: "#2a2a2a", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 99, backgroundColor: "hsl(25,90%,55%)" },
});
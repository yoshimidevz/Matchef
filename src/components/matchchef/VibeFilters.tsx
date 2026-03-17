import { View, Text, Pressable, StyleSheet } from "react-native";
import { vibes } from "../../data/recipe";

interface VibeFiltersProps {
  active: Set<string>;
  onToggle: (id: string) => void;
}

export function VibeFilters({ active, onToggle }: VibeFiltersProps) {
  return (
    <View>
      <Text style={styles.title}>🎯 Filtro de Vibe</Text>
      <View style={styles.row}>
        {vibes.map((vibe) => {
          const isActive = active.has(vibe.id);
          return (
            <Pressable
              key={vibe.id}
              onPress={() => onToggle(vibe.id)}
              style={[styles.btn, isActive && styles.btnActive]}
            >
              <Text style={[styles.btnText, isActive && styles.btnTextActive]}>
                {vibe.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  btnActive: {
    backgroundColor: "hsl(25,90%,55%)",
    borderColor: "hsl(25,90%,55%)",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
  },
  btnTextActive: {
    color: "#fff",
  },
});
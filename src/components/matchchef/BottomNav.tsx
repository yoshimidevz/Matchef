import { View, Text, Pressable, StyleSheet } from "react-native";
import { Search, Users, UserCircle, UtensilsCrossed, BookOpen } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../../i18n/LanguageContext";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const tabs = [
    { path: "/",           label: t("nav.search"),    Icon: Search },
    { path: "/despensa",   label: t("nav.pantry"),    Icon: UtensilsCrossed },
    { path: "/receitas",   label: t("nav.recipes"),   Icon: BookOpen },
    { path: "/comunidade", label: t("nav.community"), Icon: Users },
    { path: "/perfil",     label: t("nav.profile"),   Icon: UserCircle },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 8 }]}>
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        return (
          <Pressable
            key={tab.path}
            onPress={() => router.push(tab.path as any)}
            style={styles.tab}
          >
            {active && <View style={styles.indicator} />}
            <tab.Icon size={22} color={active ? "hsl(25,90%,55%)" : "#666"} />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(20,20,20,0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    zIndex: 50,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 4,
    gap: 3,
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 99,
    backgroundColor: "hsl(25,90%,55%)",
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#666",
  },
  labelActive: {
    color: "hsl(25,90%,55%)",
  },
});
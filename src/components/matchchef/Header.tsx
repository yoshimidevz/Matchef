import { useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ChefHat, Search, UtensilsCrossed, Globe } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import { useLanguage } from "../../i18n/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const hasAnimated = useRef(false);

  const toggleLang = () => setLanguage(language === "pt" ? "en" : "pt");

  return (
    <Animated.View
      entering={hasAnimated.current ? undefined : FadeInDown.duration(400)}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.inner}>
        {/* Logo */}
        <Pressable onPress={() => router.push("/")} style={styles.logoRow}>
          <View style={styles.logoBox}>
            <ChefHat size={22} color="#fff" />
          </View>
          <View>
            <Text style={styles.appName}>MatchChef</Text>
            <Text style={styles.subtitle}>{t("header.subtitle")}</Text>
          </View>
        </Pressable>

        {/* Nav */}
        <View style={styles.nav}>
          <Pressable onPress={toggleLang} style={styles.navBtn}>
            <Globe size={16} color="#888" />
            <Text style={styles.langLabel}>{language === "pt" ? "EN" : "PT"}</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/")}
            style={[styles.navBtn, pathname === "/" && styles.navBtnActive]}
          >
            <Search size={20} color={pathname === "/" ? "hsl(25,90%,55%)" : "#888"} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/despensa")}
            style={[styles.navBtn, pathname === "/despensa" && styles.navBtnActive]}
          >
            <UtensilsCrossed size={20} color={pathname === "/despensa" ? "hsl(25,90%,55%)" : "#888"} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(15,15,15,0.85)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    zIndex: 50,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: 512,
    alignSelf: "center",
    width: "100%",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "hsl(25,90%,55%)",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 11,
    color: "#888",
  },
  nav: {
    flexDirection: "row",
    gap: 4,
  },
  navBtn: {
    padding: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navBtnActive: {
    backgroundColor: "rgba(255,120,50,0.12)",
  },
  langLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#888",
  },
});
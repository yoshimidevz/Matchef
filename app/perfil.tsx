import { useState } from "react";
import {
  View, Text, Pressable, Image, ScrollView,
  StyleSheet,
} from "react-native";
import {
  Settings, Camera, Grid3X3, Bookmark, Edit,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../src/components/matchchef/Header";
import { BottomNav } from "../src/components/matchchef/BottomNav";
import { SettingsSheet } from "../src/components/matchchef/SettingsSheet";
import { useLanguage } from "../src/i18n/LanguageContext";

const MOCK_USER = {
  name: "Yoshimi",
  username: "@yoshimi_cozinha",
  bio: "Apaixonada por comida japonesa 🍣 e experimentos na cozinha. Compartilhando minhas aventuras culinárias!",
  posts: 12,
  followers: 234,
  following: 89,
  coverUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
};

const MOCK_MY_POSTS = [
  "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
  "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg",
  "https://www.themealdb.com/images/media/meals/uuuspp1468263334.jpg",
  "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
  "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
];

const MOCK_SAVED = [
  { id: "52772", title: "Teriyaki Chicken",      thumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg" },
  { id: "52771", title: "Spicy Arrabiata Penne", thumb: "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg" },
  { id: "52773", title: "Honey Teriyaki Salmon", thumb: "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg" },
  { id: "52774", title: "Pad See Ew",            thumb: "https://www.themealdb.com/images/media/meals/uuuspp1468263334.jpg" },
];

export default function Perfil() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const stats = [
    { label: t("profile.posts"),     value: MOCK_USER.posts },
    { label: t("profile.followers"), value: MOCK_USER.followers },
    { label: t("profile.following"), value: MOCK_USER.following },
  ];

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* Cover */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: MOCK_USER.coverUrl }} style={styles.cover} resizeMode="cover" />
          <View style={styles.coverOverlay} />
          <Pressable onPress={() => setSettingsOpen(true)} style={styles.settingsBtn}>
            <Settings size={16} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.profileContainer}>
          {/* Avatar */}
          <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />

          {/* Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{MOCK_USER.name}</Text>
            <Text style={styles.userHandle}>{MOCK_USER.username}</Text>
            <Text style={styles.userBio}>{MOCK_USER.bio}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Edit button */}
          <Pressable style={styles.editBtn}>
            <Edit size={16} color="#888" />
            <Text style={styles.editBtnText}>{t("profile.edit")}</Text>
          </Pressable>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              onPress={() => setActiveTab("posts")}
              style={[styles.tab, activeTab === "posts" && styles.tabActive]}
            >
              <Grid3X3 size={16} color={activeTab === "posts" ? "#fff" : "#555"} />
              <Text style={[styles.tabText, activeTab === "posts" && styles.tabTextActive]}>
                {t("profile.my_posts")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("saved")}
              style={[styles.tab, activeTab === "saved" && styles.tabActive]}
            >
              <Bookmark size={16} color={activeTab === "saved" ? "#fff" : "#555"} />
              <Text style={[styles.tabText, activeTab === "saved" && styles.tabTextActive]}>
                {t("profile.saved")}
              </Text>
            </Pressable>
          </View>

          {/* Posts grid */}
          {activeTab === "posts" && (
            <View style={styles.grid}>
              {MOCK_MY_POSTS.map((url, i) => (
                <Image key={i} source={{ uri: url }} style={styles.gridImage} resizeMode="cover" />
              ))}
              {MOCK_MY_POSTS.length === 0 && (
                <View style={styles.empty}>
                  <Camera size={40} color="#555" />
                  <Text style={styles.emptyText}>{t("profile.no_posts")}</Text>
                </View>
              )}
            </View>
          )}

          {/* Saved list */}
          {activeTab === "saved" && (
            <View style={styles.savedList}>
              {MOCK_SAVED.map((recipe) => (
                <Pressable key={recipe.id} style={styles.savedItem}>
                  <Image source={{ uri: recipe.thumb }} style={styles.savedThumb} resizeMode="cover" />
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedTitle} numberOfLines={1}>{recipe.title}</Text>
                    <Text style={styles.savedLabel}>{t("profile.saved_label")}</Text>
                  </View>
                  <Bookmark size={16} color="hsl(25,90%,55%)" fill="hsl(25,90%,55%)" />
                </Pressable>
              ))}
              {MOCK_SAVED.length === 0 && (
                <View style={styles.empty}>
                  <Bookmark size={40} color="#555" />
                  <Text style={styles.emptyText}>{t("profile.no_saved")}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNav />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f0f0f" },

  coverContainer: { height: 160, position: "relative" },
  cover: { width: "100%", height: "100%" },
  coverOverlay: {
    position: "absolute", inset: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  settingsBtn: {
    position: "absolute", top: 12, right: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center", justifyContent: "center",
  },

  profileContainer: { paddingHorizontal: 16, marginTop: -48 },

  avatar: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 4, borderColor: "#0f0f0f",
  },

  userInfo: { marginTop: 12, gap: 2 },
  userName: { fontSize: 20, fontWeight: "900", color: "#fff" },
  userHandle: { fontSize: 13, color: "#555" },
  userBio: { fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 20, marginTop: 6 },

  statsRow: { flexDirection: "row", gap: 24, marginTop: 16 },
  stat: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: "#fff" },
  statLabel: { fontSize: 11, color: "#555", marginTop: 2 },

  editBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12, paddingVertical: 10, marginTop: 16,
  },
  editBtnText: { fontSize: 14, fontWeight: "600", color: "#888" },

  tabs: {
    flexDirection: "row", gap: 8,
    backgroundColor: "#1a1a1a", borderRadius: 14,
    padding: 4, marginTop: 20,
  },
  tab: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 6,
    paddingVertical: 10, borderRadius: 10,
  },
  tabActive: { backgroundColor: "hsl(25,90%,55%)" },
  tabText: { fontSize: 13, fontWeight: "700", color: "#555" },
  tabTextActive: { color: "#fff" },

  grid: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 2, marginTop: 12,
  },
  gridImage: {
    width: "32.5%", aspectRatio: 1, borderRadius: 4,
  },

  savedList: { gap: 10, marginTop: 12 },
  savedItem: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#1a1a1a", borderRadius: 14,
    padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  savedThumb: { width: 56, height: 56, borderRadius: 10 },
  savedInfo: { flex: 1 },
  savedTitle: { fontSize: 14, fontWeight: "600", color: "#fff" },
  savedLabel: { fontSize: 11, color: "#555", marginTop: 2 },

  empty: { alignItems: "center", paddingVertical: 48, gap: 10, width: "100%" },
  emptyText: { fontSize: 13, color: "#555" },
});
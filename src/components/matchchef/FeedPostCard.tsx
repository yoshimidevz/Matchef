import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Heart, MessageCircle } from "lucide-react-native";
import type { FeedPost } from "../../data/feedPosts";
import { useLanguage } from "../../i18n/LanguageContext";

interface FeedPostCardProps {
  post: FeedPost;
  index: number;
  onLike: (id: string) => void;
  onComment: (post: FeedPost) => void;
  onRecipeClick: (recipeId: string) => void;
}

export function FeedPostCard({ post, onLike, onComment, onRecipeClick }: FeedPostCardProps) {
  const initials = post.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const { t } = useLanguage();
  const isSuccess = post.status === "success";

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>{post.user.name}</Text>
          <Text style={styles.userDate}>{post.createdAt}</Text>
        </View>
        <View style={[styles.statusBadge, isSuccess ? styles.statusSuccess : styles.statusFail]}>
          <Text style={[styles.statusText, isSuccess ? styles.statusTextSuccess : styles.statusTextFail]}>
            {isSuccess ? t("community.success") : t("community.fail")}
          </Text>
        </View>
      </View>

      {/* Caption */}
      <Text style={styles.caption}>{post.caption}</Text>

      {/* Linked recipe */}
      <Pressable onPress={() => onRecipeClick(post.linkedRecipe.id)} style={styles.recipeRow}>
        <Image
          source={{ uri: post.linkedRecipe.thumbnail }}
          style={styles.recipeThumb}
          resizeMode="cover"
        />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeLabel}>{t("community.recipe_used")}</Text>
          <Text style={styles.recipeTitle} numberOfLines={1}>{post.linkedRecipe.title}</Text>
        </View>
      </Pressable>

      {/* Photo */}
      <Image
        source={{ uri: post.photoUrl }}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable onPress={() => onLike(post.id)} style={styles.actionBtn}>
          <Heart
            size={20}
            color={post.liked ? "#ef4444" : "#666"}
            fill={post.liked ? "#ef4444" : "transparent"}
          />
          <Text style={styles.actionCount}>{post.likes}</Text>
        </Pressable>
        <Pressable onPress={() => onComment(post)} style={styles.actionBtn}>
          <MessageCircle size={20} color="#666" />
          <Text style={styles.actionCount}>{post.comments.length}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    paddingBottom: 8,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,120,50,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 12, fontWeight: "700", color: "hsl(25,90%,55%)" },
  userInfo: { flex: 1 },
  userName: { fontSize: 13, fontWeight: "600", color: "#fff" },
  userDate: { fontSize: 11, color: "#555", marginTop: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  statusSuccess: { backgroundColor: "rgba(34,197,94,0.12)" },
  statusFail: { backgroundColor: "rgba(239,68,68,0.12)" },
  statusText: { fontSize: 11, fontWeight: "700" },
  statusTextSuccess: { color: "#22c55e" },
  statusTextFail: { color: "#ef4444" },
  caption: { fontSize: 13, color: "#ccc", lineHeight: 20, paddingHorizontal: 16, marginBottom: 10 },
  recipeRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: "#2a2a2a", borderRadius: 12, padding: 10,
  },
  recipeThumb: { width: 48, height: 48, borderRadius: 8 },
  recipeInfo: { flex: 1 },
  recipeLabel: { fontSize: 10, fontWeight: "700", color: "#555", textTransform: "uppercase", letterSpacing: 0.5 },
  recipeTitle: { fontSize: 13, fontWeight: "600", color: "#fff", marginTop: 2 },
  photo: { width: "100%", aspectRatio: 4 / 3 },
  actions: { flexDirection: "row", gap: 16, padding: 14 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionCount: { fontSize: 13, color: "#666", fontWeight: "500" },
});
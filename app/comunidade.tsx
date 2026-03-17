import { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { Plus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../src/components/matchchef/Header";
import { BottomNav } from "../src/components/matchchef/BottomNav";
import { FeedPostCard } from "../src/components/matchchef/FeedPostCard";
import { FeedSkeleton } from "../src/components/matchchef/FeedSkeleton";
import { CommentsSheet } from "../src/components/matchchef/CommentsSheet";
import { AuthModal } from "../src/components/matchchef/AuthModal";
import { CreatePostSheet } from "../src/components/matchchef/CreatePostSheet";
import { ApiRecipeDetail } from "../src/components/matchchef/ApiRecipeDetail";
import { mockPosts, type FeedPost } from "../src/data/feedPosts";
import { useLanguage } from "../src/i18n/LanguageContext";

export default function Comunidade() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [commentPost, setCommentPost] = useState<FeedPost | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const requireAuth = useCallback((action: () => void) => {
    if (!isLoggedIn) { setAuthOpen(true); return; }
    action();
  }, [isLoggedIn]);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setAuthOpen(false);
    setTimeout(() => setCreatePostOpen(true), 300);
  }, []);

  const handleLike = useCallback((id: string) => {
    requireAuth(() => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      );
    });
  }, [requireAuth]);

  const handleOpenComments = useCallback((post: FeedPost) => {
    requireAuth(() => setCommentPost(post));
  }, [requireAuth]);

  const handleSendComment = useCallback((postId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      user: { name: "Você", avatar: "" },
      text,
      createdAt: "agora",
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setCommentPost((prev) =>
      prev && prev.id === postId
        ? { ...prev, comments: [...prev.comments, newComment] }
        : prev
    );
  }, []);

  const handlePublish = useCallback((data: {
    caption: string;
    status: "success" | "fail";
    recipeId: string;
    recipeTitle: string;
  }) => {
    const newPost: FeedPost = {
      id: `p-${Date.now()}`,
      user: { name: "Você", avatar: "" },
      createdAt: "agora",
      status: data.status,
      linkedRecipe: {
        id: data.recipeId,
        title: data.recipeTitle,
        thumbnail: "https://www.themealdb.com/images/media/meals/default.jpg",
      },
      photoUrl: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      caption: data.caption,
      likes: 0,
      liked: false,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setCreatePostOpen(false);
    Alert.alert(t("create.published_title"), t("create.published_desc"));
  }, [t]);

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>{t("community.title")}</Text>

        {loading ? (
          <FeedSkeleton />
        ) : (
          <View style={styles.feed}>
            {posts.map((post, i) => (
              <FeedPostCard
                key={post.id}
                post={post}
                index={i}
                onLike={handleLike}
                onComment={handleOpenComments}
                onRecipeClick={setSelectedRecipeId}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => requireAuth(() => setCreatePostOpen(true))}
        style={[styles.fab, { bottom: 72 + insets.bottom }]}
      >
        <Plus size={24} color="#fff" />
      </Pressable>

      <BottomNav />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLogin={handleLogin} />
      <CreatePostSheet open={createPostOpen} onClose={() => setCreatePostOpen(false)} onPublish={handlePublish} />
      <CommentsSheet post={commentPost} onClose={() => setCommentPost(null)} onSend={handleSendComment} />

      <ApiRecipeDetail
        mealId={selectedRecipeId}
        meal={null}
        onClose={() => setSelectedRecipeId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f0f0f" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  pageTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  feed: { gap: 16 },
  fab: {
    position: "absolute", right: 16,
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: "hsl(25,90%,55%)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "hsl(25,90%,55%)", shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8, zIndex: 40,
  },
});
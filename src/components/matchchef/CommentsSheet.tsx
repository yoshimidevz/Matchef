import { useState } from "react";
import {
  View, Text, Pressable, TextInput, ScrollView,
  Modal, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform,
} from "react-native";
import { X, Send } from "lucide-react-native";
import type { FeedPost } from "../../data/feedPosts";
import { useLanguage } from "../../i18n/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommentsSheetProps {
  post: FeedPost | null;
  onClose: () => void;
  onSend: (postId: string, text: string) => void;
}

export function CommentsSheet({ post, onClose, onSend }: CommentsSheetProps) {
  const [text, setText] = useState("");
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (!post || !text.trim()) return;
    onSend(post.id, text.trim());
    setText("");
  };

  return (
    <Modal
      visible={!!post}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetWrapper}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom || 16 }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {t("comments.title")} ({post?.comments.length ?? 0})
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={16} color="#fff" />
            </Pressable>
          </View>

          {/* Comments list */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {post?.comments.length === 0 && (
              <Text style={styles.empty}>{t("comments.empty")}</Text>
            )}
            {post?.comments.map((c) => (
              <View key={c.id} style={styles.comment}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>{c.user.name[0]}</Text>
                </View>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentName}>{c.user.name}</Text>
                    <Text style={styles.commentDate}>{c.createdAt}</Text>
                  </View>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleSend}
              placeholder={t("comments.placeholder")}
              placeholderTextColor="#555"
              style={styles.input}
              returnKeyType="send"
            />
            <Pressable
              onPress={handleSend}
              disabled={!text.trim()}
              style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            >
              <Send size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheetWrapper: { justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "#333", alignSelf: "center", marginBottom: 12,
  },
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)",
  },
  title: { fontSize: 15, fontWeight: "800", color: "#fff" },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#2a2a2a", alignItems: "center", justifyContent: "center",
  },
  list: { maxHeight: 300, paddingVertical: 12 },
  empty: { textAlign: "center", fontSize: 13, color: "#555", paddingVertical: 32 },
  comment: { flexDirection: "row", gap: 10, marginBottom: 16 },
  commentAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#2a2a2a", alignItems: "center", justifyContent: "center",
  },
  commentAvatarText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  commentContent: { flex: 1 },
  commentHeader: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  commentName: { fontSize: 13, fontWeight: "600", color: "#fff" },
  commentDate: { fontSize: 10, color: "#555" },
  commentText: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  inputRow: {
    flexDirection: "row", gap: 8, alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)",
  },
  input: {
    flex: 1, backgroundColor: "#2a2a2a", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 13, color: "#fff",
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "hsl(25,90%,55%)", alignItems: "center", justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.4 },
});
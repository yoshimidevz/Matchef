import { View, StyleSheet } from "react-native";

function SkeletonBox({ style }: { style?: object }) {
  return <View style={[styles.skeleton, style]} />;
}

export function FeedSkeleton() {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <SkeletonBox style={styles.avatar} />
            <View style={styles.headerText}>
              <SkeletonBox style={styles.nameLine} />
              <SkeletonBox style={styles.dateLine} />
            </View>
            <SkeletonBox style={styles.badge} />
          </View>
          {/* Caption */}
          <View style={styles.caption}>
            <SkeletonBox style={styles.captionLine} />
            <SkeletonBox style={styles.captionLineShort} />
          </View>
          {/* Recipe */}
          <SkeletonBox style={styles.recipeBlock} />
          {/* Image */}
          <SkeletonBox style={styles.image} />
          {/* Actions */}
          <View style={styles.actions}>
            <SkeletonBox style={styles.action} />
            <SkeletonBox style={styles.action} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  skeleton: { backgroundColor: "#2a2a2a", borderRadius: 8 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, paddingBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  headerText: { flex: 1, gap: 6 },
  nameLine: { height: 12, width: 96 },
  dateLine: { height: 10, width: 56 },
  badge: { height: 24, width: 96, borderRadius: 99 },
  caption: { paddingHorizontal: 16, gap: 6 },
  captionLine: { height: 12, width: "100%" },
  captionLineShort: { height: 12, width: "75%" },
  recipeBlock: { margin: 16, marginTop: 12, height: 56, borderRadius: 12 },
  image: { width: "100%", aspectRatio: 4 / 3 },
  actions: { flexDirection: "row", gap: 16, padding: 16, paddingTop: 12 },
  action: { height: 20, width: 56 },
});
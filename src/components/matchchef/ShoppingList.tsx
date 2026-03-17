import { useState } from "react";
import {
  View, Text, Pressable, Modal, ScrollView,
  StyleSheet, TouchableOpacity,
} from "react-native";
import { ShoppingCart, X, Trash2 } from "lucide-react-native";
import { ingredients } from "../../data/ingredients";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ShoppingListProps {
  items: string[];
  onRemove: (item: string) => void;
}

export function ShoppingList({ items, onRemove }: ShoppingListProps) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const getIngredientName = (id: string) => {
    const ing = ingredients.find((i) => i.id === id);
    return ing ? `${ing.emoji} ${ing.name}` : id;
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* FAB */}
      <Pressable onPress={() => setOpen(true)} style={[styles.fab, { bottom: 80 + insets.bottom }]}>
        <ShoppingCart size={24} color="#fff" />
        <View style={styles.fabBadge}>
          <Text style={styles.fabBadgeText}>{items.length}</Text>
        </View>
      </Pressable>

      {/* Bottom sheet modal */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>🛒 Lista de Compras</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.sheetClose}>
              <X size={16} color="#fff" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.sheetScroll}>
            <View style={styles.itemsList}>
              {items.map((item) => (
                <View key={item} style={styles.item}>
                  <Text style={styles.itemText}>{getIngredientName(item)}</Text>
                  <Pressable onPress={() => onRemove(item)} style={styles.removeBtn}>
                    <Trash2 size={15} color="#ef4444" />
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "hsl(25,90%,55%)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "hsl(25,90%,55%)",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 50,
  },
  fabBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#a78bfa",
    alignItems: "center",
    justifyContent: "center",
  },
  fabBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "60%",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
  },
  sheetClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetScroll: {
    maxHeight: 300,
  },
  itemsList: {
    gap: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239,68,68,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
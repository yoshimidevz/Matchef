import { useState } from "react";
import {
  View, Text, Pressable, TextInput,
  Modal, StyleSheet, TouchableOpacity,
} from "react-native";
import { X, ChefHat } from "lucide-react-native";
import { useLanguage } from "../../i18n/LanguageContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AuthModal({ open, onClose, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  const handleSubmit = () => {
    onLogin();
    setEmail("");
    setPassword("");
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={styles.centered}>
        <View style={styles.modal}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X size={18} color="#888" />
          </Pressable>

          <View style={styles.iconBox}>
            <ChefHat size={32} color="hsl(25,90%,55%)" />
          </View>

          <Text style={styles.title}>{t("auth.title")}</Text>
          <Text style={styles.subtitle}>{t("auth.subtitle")}</Text>

          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t("auth.email")}
              placeholderTextColor="#555"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("auth.password")}
              placeholderTextColor="#555"
              secureTextEntry
              style={styles.input}
            />
            <Pressable onPress={handleSubmit} style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>{t("auth.login")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centered: {
    flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24,
  },
  modal: {
    backgroundColor: "#1a1a1a", borderRadius: 24, padding: 24,
    width: "100%", maxWidth: 400, alignItems: "center",
  },
  closeBtn: {
    position: "absolute", right: 16, top: 16,
    width: 32, height: 32, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
  },
  iconBox: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: "rgba(255,120,50,0.12)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "900", color: "#fff", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#666", textAlign: "center", marginBottom: 20 },
  form: { width: "100%", gap: 12 },
  input: {
    backgroundColor: "#2a2a2a", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 14, color: "#fff",
  },
  loginBtn: {
    backgroundColor: "hsl(25,90%,55%)", borderRadius: 12,
    height: 48, alignItems: "center", justifyContent: "center",
  },
  loginBtnText: { fontSize: 15, fontWeight: "800", color: "#fff" },
});
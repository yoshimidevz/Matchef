import { useState } from "react";
import {
  View, Text, Pressable, Switch, Modal,
  ScrollView, StyleSheet, TouchableOpacity, Alert,
} from "react-native";
import {
  X, User, Lock, Moon, Apple, Milk,
  Bell, UserPlus, LogOut, ChevronRight, Globe,
} from "lucide-react-native";
import { useLanguage } from "../../i18n/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { gap: 4 },
  title: {
    fontSize: 11, fontWeight: "700", color: "#555",
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
  },
  body: {
    backgroundColor: "#1a1a1a", borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
});

function SettingRow({
  icon, label, chevron, children, last,
}: {
  icon: React.ReactNode;
  label: string;
  chevron?: boolean;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[rowStyles.row, !last && rowStyles.rowBorder]}>
      <View style={rowStyles.icon}>{icon}</View>
      <Text style={rowStyles.label}>{label}</Text>
      {children}
      {chevron && <ChevronRight size={16} color="#555" />}
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center",
    gap: 12, paddingHorizontal: 16, paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)",
  },
  icon: { width: 20, alignItems: "center" },
  label: { flex: 1, fontSize: 14, fontWeight: "500", color: "#fff" },
});

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const { language, setLanguage, t } = useLanguage();
  const [vegetarian, setVegetarian] = useState(false);
  const [lactoseFree, setLactoseFree] = useState(false);
  const [likesNotif, setLikesNotif] = useState(true);
  const [followNotif, setFollowNotif] = useState(true);
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(t("settings.logout_title"), t("settings.logout_desc"));
    onClose();
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={[styles.sheet, { paddingBottom: insets.bottom || 16 }]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>{t("settings.title")}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X size={16} color="#fff" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.content}>
            {/* Conta */}
            <Section title={t("settings.account")}>
              <SettingRow icon={<User size={16} color="hsl(25,90%,55%)" />} label={t("settings.personal_data")} chevron />
              <SettingRow icon={<Lock size={16} color="hsl(25,90%,55%)" />} label={t("settings.change_password")} chevron last />
            </Section>

            {/* Preferências */}
            <Section title={t("settings.preferences")}>
              <SettingRow icon={<Globe size={16} color="hsl(25,90%,55%)" />} label={t("settings.language")}>
                <Pressable
                  onPress={() => setLanguage(language === "pt" ? "en" : "pt")}
                  style={styles.langBtn}
                >
                  <Text style={styles.langBtnText}>
                    {language === "pt" ? "🇧🇷 PT" : "🇬🇧 EN"}
                  </Text>
                </Pressable>
              </SettingRow>
              <SettingRow icon={<Apple size={16} color="hsl(25,90%,55%)" />} label={t("settings.vegetarian")}>
                <Switch
                  value={vegetarian}
                  onValueChange={setVegetarian}
                  trackColor={{ false: "#333", true: "hsl(25,90%,55%)" }}
                  thumbColor="#fff"
                />
              </SettingRow>
              <SettingRow icon={<Milk size={16} color="hsl(25,90%,55%)" />} label={t("settings.lactose_free")} last>
                <Switch
                  value={lactoseFree}
                  onValueChange={setLactoseFree}
                  trackColor={{ false: "#333", true: "hsl(25,90%,55%)" }}
                  thumbColor="#fff"
                />
              </SettingRow>
            </Section>

            {/* Notificações */}
            <Section title={t("settings.notifications")}>
              <SettingRow icon={<Bell size={16} color="hsl(25,90%,55%)" />} label={t("settings.likes_notif")}>
                <Switch
                  value={likesNotif}
                  onValueChange={setLikesNotif}
                  trackColor={{ false: "#333", true: "hsl(25,90%,55%)" }}
                  thumbColor="#fff"
                />
              </SettingRow>
              <SettingRow icon={<UserPlus size={16} color="hsl(25,90%,55%)" />} label={t("settings.new_followers")} last>
                <Switch
                  value={followNotif}
                  onValueChange={setFollowNotif}
                  trackColor={{ false: "#333", true: "hsl(25,90%,55%)" }}
                  thumbColor="#fff"
                />
              </SettingRow>
            </Section>

            {/* Logout */}
            <Pressable onPress={handleLogout} style={styles.logoutBtn}>
              <LogOut size={16} color="#ef4444" />
              <Text style={styles.logoutText}>{t("settings.logout")}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: "90%", paddingHorizontal: 16, paddingTop: 8,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "#333", alignSelf: "center", marginBottom: 12,
  },
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 20,
  },
  title: { fontSize: 17, fontWeight: "800", color: "#fff" },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#2a2a2a", alignItems: "center", justifyContent: "center",
  },
  scroll: { maxHeight: 600 },
  content: { gap: 24, paddingBottom: 16 },
  langBtn: {
    backgroundColor: "rgba(255,120,50,0.15)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99,
  },
  langBtnText: { fontSize: 12, fontWeight: "700", color: "hsl(25,90%,55%)" },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderWidth: 1, borderColor: "rgba(239,68,68,0.3)",
    borderRadius: 12, paddingVertical: 14,
  },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#ef4444" },
});
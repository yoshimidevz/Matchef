import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { ChefHat } from "lucide-react-native";

interface LanguageSplashProps {
  visible: boolean;
}

export function LanguageSplash({ visible }: LanguageSplashProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
        <View style={styles.logoBox}>
          <ChefHat size={40} color="#fff" />
        </View>
        <Text style={styles.appName}>MatchChef</Text>
        <View style={styles.dotsRow}>
          <BouncingDot delay={0} />
          <BouncingDot delay={150} />
          <BouncingDot delay={300} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

function BouncingDot({ delay }: { delay: number }) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(y, { toValue: -8, duration: 300, useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.dot, { transform: [{ translateY: y }] }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  logoBox: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: "hsl(25,90%,55%)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "hsl(25,90%,55%)",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "hsl(25,90%,55%)",
  },
});
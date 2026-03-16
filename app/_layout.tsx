import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LanguageProvider } from "../src/i18n/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 }, // 5 min cache
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0f0f0f" } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="resultados" />
            <Stack.Screen name="despensa" />
            <Stack.Screen name="comunidade" />
            <Stack.Screen name="perfil" />
          </Stack>
        </LanguageProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
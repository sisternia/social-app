import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animation: 'none', // ✅ Tắt hiệu ứng chuyển trang
        }}
      >
        <Stack.Screen name="screens/Login/login" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Register/register" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Verify/verify" options={{ headerShown: false }} />
        <Stack.Screen name="screens/ForgotPass/enter_pass" options={{ headerShown: false }} />
        <Stack.Screen name="screens/ForgotPass/forgot_pass" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Profile/profile" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Profile/edit_profile" options={{ headerShown: false }} />
        <Stack.Screen name="screens/HomePage/home_page" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

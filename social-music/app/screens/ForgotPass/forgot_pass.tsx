import TextField from '@/components/ui/TextField';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { forgotPassword } from '@/services/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ForgotPassScreen() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập email');

    try {
      const data = await forgotPassword(email);

      if (data.status === 'error') {
        Alert.alert('Lỗi', data.message || 'Không thể gửi mã xác minh');
      } else {
        Alert.alert('Thành công', data.message || 'Mã xác minh đã được gửi');
        router.replace({ pathname: '/screens/Verify/verify', params: { email, action: 'reset' } });
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor.background }]}>
      <Text style={[styles.title, { color: themeColor.text }]}>OnSic</Text>

      <TextField placeholder="Nhập email" keyboardType="email-address" value={email} onChangeText={setEmail} />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/screens/Login/login')}>
        <Text style={[styles.backText, { color: themeColor.tint }]}>Trở về</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 36, fontWeight: 'bold', alignSelf: 'center', marginBottom: 32 },
  button: { backgroundColor: '#0a7ea4', paddingVertical: 14, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  backText: { textAlign: 'center', textDecorationLine: 'underline', marginTop: 16, fontSize: 14 },
});

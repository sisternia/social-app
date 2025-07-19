import TextField from '@/components/ui/TextField';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { login } from '@/services/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập email');
    if (!password.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');

    try {
      const data = await login(email, password);

      if (data.status === 'error') {
        Alert.alert('Lỗi', data.message || 'Đăng nhập thất bại');
        return;
      }

      if (data.status === 'unverified') {
        Alert.alert('Tài khoản chưa được xác minh', 'Mã xác minh đã được gửi tới email của bạn');
        router.replace({ pathname: '/screens/Verify/verify', params: { email } });
      } else {
        Alert.alert('Thành công', 'Đăng nhập thành công');
        setTimeout(() => {
          router.replace({ pathname: '/screens/HomePage/home_page', params: { email } });
        }, 1000);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor.background }]}>
      <Text style={[styles.title, { color: themeColor.text }]}>OnSic</Text>

      <TextField placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextField placeholder="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword} />

      <Pressable style={styles.confirmButton} onPress={handleLogin}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </Pressable>

      <View style={styles.row}>
        <Pressable style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>Đăng nhập</Text>
        </Pressable>
        <Pressable style={styles.registerBtn} onPress={() => router.replace('/screens/Register/register')}>
          <Text style={styles.registerBtnText}>Đăng ký</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.replace('/screens/ForgotPass/forgot_pass')}>
        <Text style={[styles.forgotText, { color: themeColor.tint }]}>Quên mật khẩu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 32,
  },
  confirmButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  loginBtn: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
  },
  loginBtnText: {
    color: '#fff',
    textAlign: 'center',
  },
  registerBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
  },
  registerBtnText: {
    color: '#000',
    textAlign: 'center',
  },
  forgotText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

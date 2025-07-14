import TextField from '@/components/ui/TextField';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { register } from '@/services/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleRegister = async () => {
    if (!userName.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên người dùng');
    if (!email.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập email');
    if (!password.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
    if (!confirmPass.trim()) return Alert.alert('Lỗi', 'Vui lòng xác nhận mật khẩu');
    if (password !== confirmPass) return Alert.alert('Lỗi', 'Mật khẩu không khớp');

    try {
      const data = await register(userName, email, password);

      if (data.status === 'error') {
        Alert.alert('Lỗi', data.message || 'Đăng ký thất bại');
      } else {
        Alert.alert('Thành công', data.message || 'Đăng ký thành công');
        router.replace({ pathname: '/screens/Verify/verify', params: { email, from: 'register' } });
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor.background }]}>
      <Text style={[styles.title, { color: themeColor.text }]}>OnSic</Text>

      <TextField placeholder="Tên người dùng" value={userName} onChangeText={setUserName} />
      <TextField placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextField placeholder="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword} />
      <TextField placeholder="Xác nhận mật khẩu" secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />

      <Pressable style={styles.confirmButton} onPress={handleRegister}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </Pressable>

      <View style={styles.row}>
        <Pressable style={styles.loginBtn} onPress={() => router.replace('/screens/Login/login')}>
          <Text style={styles.loginBtnText}>Đăng nhập</Text>
        </Pressable>
        <Pressable style={styles.registerBtn}>
          <Text style={styles.registerBtnText}>Đăng ký</Text>
        </Pressable>
      </View>
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
  },
  loginBtnText: {
    color: '#000',
    textAlign: 'center',
  },
  registerBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
  },
  registerBtnText: {
    color: '#fff',
    textAlign: 'center',
  },
});

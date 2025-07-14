import TextField from '@/components/ui/TextField';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { resetPassword } from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function EnterPassScreen() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async () => {
    if (!pass || !confirm) return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu');
    if (pass !== confirm) return Alert.alert('Lỗi', 'Mật khẩu không khớp');

    try {
      const data = await resetPassword(email as string, pass);

      if (data.status === 'error') {
        Alert.alert('Lỗi', data.message || 'Đổi mật khẩu thất bại');
      } else {
        Alert.alert('Thành công', data.message || 'Đổi mật khẩu thành công');
        router.replace('/screens/Login/login');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor.background }]}>
      <Text style={[styles.title, { color: themeColor.text }]}>OnSic</Text>

      <TextField placeholder="Mật khẩu mới" secureTextEntry value={pass} onChangeText={setPass} />
      <TextField placeholder="Xác nhận mật khẩu" secureTextEntry value={confirm} onChangeText={setConfirm} />

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
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24 
},
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    alignSelf: 'center', 
    marginBottom: 32 
},
  button: { 
    backgroundColor: '#0a7ea4', 
    paddingVertical: 14, 
    borderRadius: 8, 
    marginTop: 12 
},
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 16 
},
  backText: { 
    textAlign: 'center', 
    textDecorationLine: 'underline', 
    marginTop: 16, 
    fontSize: 14 
},
});

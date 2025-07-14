import TextField from '@/components/ui/TextField';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { verifyCode } from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function VerifyScreen() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { email, action, from } = useLocalSearchParams(); // action: 'reset' | undefined, from: 'register' | 'login'

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) return Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số');

    try {
      const data = await verifyCode(fullCode, action as string);

      if (data.status === 'error') {
        Alert.alert('Lỗi', data.message || 'Xác minh thất bại');
      } else {
        Alert.alert('Thành công', data.message || 'Xác minh thành công');
        if (action === 'reset') {
          router.replace({ pathname: '/screens/ForgotPass/enter_pass', params: { email } });
        } else {
          router.replace('/screens/Login/login');
        }
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối tới server');
    }
  };

  const handleBack = () => {
    if (action === 'reset') {
      router.replace('/screens/ForgotPass/forgot_pass');
    } else if (from === 'register') {
      router.replace('/screens/Register/register');
    } else {
      router.replace('/screens/Login/login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor.background }]}>
      <Text style={[styles.title, { color: themeColor.text }]}>OnSic</Text>
      <Text style={[styles.subTitle, { color: themeColor.text }]}>Nhập mã xác minh</Text>

      <View style={styles.codeContainer}>
        {code.map((val, index) => (
          <View key={index} style={styles.codeBox}>
            <TextField
              ref={(ref: any) => (inputs.current[index] = ref)}
              keyboardType="number-pad"
              maxLength={1}
              value={val}
              onChangeText={(text) => handleChange(text, index)}
              style={styles.codeInput}
            />
          </View>
        ))}
      </View>

      <Pressable style={styles.confirmButton} onPress={handleVerify}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </Pressable>

      <Pressable onPress={handleBack}>
        <Text style={[styles.backText, { color: themeColor.tint }]}>Trở về</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeBox: {
    width: 48,
    height: 56,
    marginHorizontal: 4,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 22,
    paddingVertical: 10,
  },
  confirmButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backText: { 
    textAlign: 'center', 
    textDecorationLine: 'underline', 
    marginTop: 16, 
    fontSize: 14 
},
});

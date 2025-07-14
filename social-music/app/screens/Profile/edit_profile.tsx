import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Ảnh nền */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: 'https://via.placeholder.com/600x200' }} style={styles.coverImage} />
        <Pressable style={styles.cameraIcon}>
          <Ionicons name="camera" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Ảnh đại diện */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatarImage} />
        </View>
        <Pressable style={styles.avatarCameraIconWrapper}>
          <Ionicons name="camera" size={20} color="#000" />
        </Pressable>
      </View>

      {/* Các trường thông tin */}
      {[
        { label: 'Tên người dùng', value: 'Nguyễn Văn A' },
        { label: 'Sinh nhật', value: '01/01/2000' },
        { label: 'Email', value: 'email@example.com' },
        { label: 'Số điện thoại', value: '0123456789' },
        { label: 'Địa chỉ', value: 'Hà Nội, Việt Nam' },
        { label: 'Tiểu sử', value: 'Yêu âm nhạc, thích công nghệ' },
      ].map(({ label, value }, index) => (
        <View key={index} style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputRow}>
            <Text style={styles.value}>{value}</Text>
            <Pressable>
              <Ionicons name="create-outline" size={20} color="#0a7ea4" />
            </Pressable>
          </View>
        </View>
      ))}

      {/* Nút xác nhận và hủy */}
      <View style={styles.actionRow}>
        <Pressable style={[styles.actionBtn, { backgroundColor: '#0a7ea4' }]}>
          <Text style={styles.actionText}>Xác nhận</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: '#aaa' }]}
          onPress={() => router.back()} // ← Quay lại màn hình trước (profile.tsx)
        >
          <Text style={styles.actionText}>Hủy</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#ddd',
  },
  coverImage: { width: '100%', height: '100%' },
  cameraIcon: { position: 'absolute', bottom: 10, right: 10 },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 20,
  },
  avatar: {
    width: width / 3,
    height: width / 3,
    borderRadius: width / 6,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarCameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: width / 2 - width / 6 + 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
  },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: { fontSize: 16, color: '#333' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: 'bold' },
});

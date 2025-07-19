import BottomNavBar from '@/components/ui/BottomTabs';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  fetchUserInfo,
  getImageUrl,
  uploadAvatar,
  uploadBackground,
} from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PostsCTScreen from '../PostsCT/postsct';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const [userName, setUserName] = useState('Đang tải...');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const loadUserInfo = async () => {
    try {
      const data = await fetchUserInfo(email as string);
      if (data.status === 'success') {
        setUserName(data.user_name);
        setAvatarImage(getImageUrl(data.user_avatar));
        setBackgroundImage(getImageUrl(data.user_background));
      } else {
        setUserName('Không rõ');
      }
    } catch (err) {
      setUserName('Lỗi kết nối');
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (email) loadUserInfo();
    }, [email])
  );

  const pickBackground = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      try {
        const data = await uploadBackground(email as string, asset.uri);
        if (data.status === 'success') {
          setBackgroundImage(getImageUrl(data.filename));
        }
      } catch (err) {}
    }
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      try {
        const data = await uploadAvatar(email as string, asset.uri);
        if (data.status === 'success') {
          setAvatarImage(getImageUrl(data.filename));
        }
      } catch (err) {}
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColor.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={backgroundImage ? { uri: backgroundImage } : undefined}
          style={styles.coverContainer}
          resizeMode="cover"
        >
          <Pressable onPress={pickBackground}>
            <Ionicons name="camera" size={24} color="#fff" style={styles.coverCameraIcon} />
          </Pressable>
        </ImageBackground>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            {avatarImage ? (
              <Image source={{ uri: avatarImage }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color="#ccc" />
            )}
          </View>

          <Pressable onPress={pickAvatar} style={styles.avatarCameraIconWrapper}>
            <Ionicons name="camera" size={20} color="#000" />
          </Pressable>
        </View>

        <Text style={[styles.userText, { color: themeColor.text }]}>{userName}</Text>

        <Pressable
          style={styles.editBtn}
          onPress={() =>
            router.push({
              pathname: '/screens/Profile/edit_profile',
              params: { email },
            })
          }
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editText}>Chỉnh sửa thông tin</Text>
        </Pressable>

        <PostsCTScreen />
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  coverContainer: {
    width: '100%',
    height: height / 3,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  coverCameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  avatarWrapper: {
    marginTop: -width / 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: width / 3,
    height: width / 3,
    borderRadius: width / 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: width / 6,
  },
  avatarCameraIconWrapper: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
  },
  userText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

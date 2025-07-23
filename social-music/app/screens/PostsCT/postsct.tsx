import { fetchUserInfo, getArticles, getImageUrl, uploadArticle } from '@/services/api';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LoadSct from './loadsct';

const { width } = Dimensions.get('window');

const formatDateTime = (date: Date) => {
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const day = days[date.getDay()];
  const dayNumber = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${day}, ${dayNumber} tháng ${month}, ${year} lúc ${hour}:${minute}`;
};

export default function PostsCTScreen() {
  const { user_id } = useLocalSearchParams();
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Người dùng');
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<
    { content: string; userName: string; avatar: string | null; time: string }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      if (user_id) {
        const loadAll = async () => {
          const data = await fetchUserInfo(user_id as string);
          if (data.status === 'success') {
            const avatar = getImageUrl(data.user_avatar);
            const name = data.user_name;
            setAvatarImage(avatar);
            setUserName(name);

            const result = await getArticles(user_id as string);
            if (result.status === 'success') {
              const mapped = result.articles.map((a: any) => ({
                content: a.articles_content,
                userName: name,
                avatar: avatar,
                time: a.created_at,
              }));
              setPosts(mapped);
            }
          }
        };
        loadAll();
      }
    }, [user_id])
  );

  const handlePost = async () => {
    if (!text.trim()) return;

    const now = new Date();
    const timeFormatted = formatDateTime(now);

    const result = await uploadArticle(user_id as string, text.trim(), 'Công khai');
    if (result.status === 'success') {
      const newPost = {
        content: text.trim(),
        userName,
        avatar: avatarImage,
        time: timeFormatted,
      };
      setPosts([newPost, ...posts]);
      setText('');
      setModalVisible(false);
      Alert.alert('Thành công', 'Đăng bài thành công');
    } else {
      Alert.alert('Lỗi', 'Không thể đăng bài');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {avatarImage ? (
          <Image source={{ uri: avatarImage }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={40} color="#888" style={styles.avatar} />
        )}
        <Pressable style={styles.textInputTrigger} onPress={() => setModalVisible(true)}>
          <Text style={styles.placeholder}>Bạn đang nghĩ gì?</Text>
        </Pressable>
      </View>

      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              {avatarImage ? (
                <Image source={{ uri: avatarImage }} style={styles.modalAvatar} />
              ) : (
                <Ionicons name="person-circle-outline" size={40} color="#888" style={styles.modalAvatar} />
              )}
              <TextInput
                style={styles.modalInput}
                placeholder="Bạn đang nghĩ gì?"
                value={text}
                onChangeText={setText}
                placeholderTextColor="#888"
                multiline
              />
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.actionBtn}>
                <MaterialIcons name="photo-library" size={20} color="#0a7ea4" />
                <Text style={styles.actionText}>Ảnh/Video</Text>
              </Pressable>
              <View style={styles.actionBtn}>
                <Ionicons name="happy-outline" size={20} color="#0a7ea4" />
                <Text style={styles.actionText}>Cảm xúc</Text>
              </View>
              <View style={styles.actionBtn}>
                <FontAwesome name="user-plus" size={20} color="#0a7ea4" />
                <Text style={styles.actionText}>Gắn thẻ</Text>
              </View>
            </View>

            <Pressable style={styles.postButton} onPress={handlePost}>
              <Text style={styles.postButtonText}>Đăng</Text>
            </Pressable>
          </View>
          <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <ScrollView style={{ marginTop: 20 }}>
        <LoadSct posts={posts} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 32,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textInputTrigger: {
    flex: 1,
    justifyContent: 'center',
    height: 40,
  },
  placeholder: {
    color: '#888',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    zIndex: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#0a7ea4',
  },
  postButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
  },
  postButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
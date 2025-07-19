import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Post = {
  content: string;
  userName: string;
  avatar: string | null;
  time: string;
  media?: string;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoadSct({
  posts,
  onDelete,
  onEdit,
}: {
  posts: Post[];
  onDelete: (index: number) => void;
  onEdit: (index: number, post: Post) => void;
}) {
  const [imageSizes, setImageSizes] = useState<{
    [index: number]: { width: number; height: number };
  }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);

  const handleEditPost = () => {
    if (selectedPostIndex !== null) {
      const post = posts[selectedPostIndex];
      onEdit(selectedPostIndex, post);
      setModalVisible(false);
    }
  };

  const handleDeletePost = () => {
    if (selectedPostIndex !== null) {
      Alert.alert('Xác nhận', 'Bạn có muốn xóa bài viết này không?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            onDelete(selectedPostIndex);
            setModalVisible(false);
          },
        },
      ]);
    }
  };

  const menuOptions = [
    { label: 'Ghim bài viết', icon: 'bookmark-outline', action: () => {} },
    { label: 'Lưu bài viết', icon: 'download-outline', action: () => {} },
    { label: 'Chỉnh sửa bài viết', icon: 'create-outline', action: handleEditPost },
    { label: 'Chỉnh sửa ngày', icon: 'calendar-outline', action: () => {} },
    { label: 'Xóa bài viết', icon: 'trash-outline', action: handleDeletePost },
  ];

  useEffect(() => {
    posts.forEach((post, index) => {
      if (post.media) {
        Image.getSize(
          post.media,
          (w, h) => {
            const maxWidth = SCREEN_WIDTH - 40;
            let ratio = maxWidth / w;
            let scaledWidth = w * ratio;
            let scaledHeight = h * ratio;

            if (scaledHeight > SCREEN_HEIGHT * 0.6) {
              ratio = (SCREEN_HEIGHT * 0.6) / h;
              scaledWidth = w * ratio;
              scaledHeight = h * ratio;
            }

            setImageSizes((prev) => ({
              ...prev,
              [index]: { width: scaledWidth, height: scaledHeight },
            }));
          },
          (error) => {
            console.error('Image size error:', error);
          }
        );
      }
    });
  }, [posts]);

  return (
    <>
      {posts.map((post, index) => (
        <View key={index} style={styles.postItem}>
          <Pressable
            style={styles.menuButton}
            onPress={() => {
              setSelectedPostIndex(index);
              setModalVisible(true);
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#555" />
          </Pressable>

          <View style={styles.postHeader}>
            {post.avatar ? (
              <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={36} color="#888" />
            )}
            <View>
              <Text style={styles.postName}>{post.userName}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          {post.media && imageSizes[index] && (
            <Image
              source={{ uri: post.media }}
              style={{
                width: imageSizes[index].width,
                height: imageSizes[index].height,
                borderRadius: 10,
                marginTop: 10,
                alignSelf: 'center',
              }}
              resizeMode="contain"
            />
          )}

          <View style={styles.actionRow}>
            <Pressable style={styles.actionButton}>
              <Ionicons name="heart-outline" size={20} color="#444" />
              <Text style={styles.actionText}>Like</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color="#444" />
              <Text style={styles.actionText}>Bình luận</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={20} color="#444" />
              <Text style={styles.actionText}>Chia sẻ</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {menuOptions.map((option, i) => (
              <Pressable
                key={i}
                style={styles.modalItem}
                onPress={option.action}
              >
                <Ionicons name={option.icon as any} size={18} color="#333" style={{ width: 24 }} />
                <Text style={styles.modalText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  postItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  postName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postTime: {
    color: '#666',
    fontSize: 13,
  },
  postContent: {
    fontSize: 15,
    color: '#000',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 6,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 15,
    color: '#222',
    marginLeft: 10,
  },
});

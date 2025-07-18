import AddressForm from '@/components/ui/AddressForm';
import BioForm from '@/components/ui/BioForm';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  fetchUserInfo,
  getImageUrl,
  updateUserInfo,
  uploadAvatar,
  uploadBackground,
} from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userDob, setUserDob] = useState<Date | null>(null);
  const [userPhone, setUserPhone] = useState('');
  const [userBio, setUserBio] = useState('');
  const [isEditing, setIsEditing] = useState({
    name: false,
    dob: false,
    phone: false,
    bio: false,
  });
  const [userAdd, setUserAdd] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [isEditingBioForm, setIsEditingBioForm] = useState(false);
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const data = await fetchUserInfo(email as string);
        if (data.status === 'success') {
          setUserId(data.user_id);
          setUserName(data.user_name || '');
          setUserDob(data.user_dob ? new Date(data.user_dob) : null);
          setUserPhone(data.user_phone || '');
          setUserBio(data.user_bio || '');
          setAvatarImage(getImageUrl(data.user_avatar));
          setBackgroundImage(getImageUrl(data.user_background));
          if (data.user_add) {
            // Parse the address in format: "Detailed Address, City, Country"
            const addressParts = data.user_add.split(', ').map((part: string) => part.trim());
            if (addressParts.length === 3) {
              setDetailedAddress(addressParts[0]);
              setSelectedCity(addressParts[1]);
              setSelectedCountry(addressParts[2]);
              setUserAdd(data.user_add);
            } else {
              setUserAdd(data.user_add);
            }
          }
        }
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
      }
    };

    if (email) loadUserInfo();
  }, [email]);

  const handleConfirm = async () => {
    try {
      // Format the address as "Detailed Address, City, Country"
      const formattedAddress = detailedAddress && selectedCity && selectedCountry
        ? `${detailedAddress}, ${selectedCity}, ${selectedCountry}`
        : userAdd;

      const updates = {
        user_name: userName,
        user_dob: userDob ? userDob.toISOString().split('T')[0] : null,
        user_phone: userPhone,
        user_bio: userBio,
        user_add: formattedAddress,
      };

      const res = await updateUserInfo(userId, updates);
      if (res.status === 'success') {
        Alert.alert('Thành công', 'Đã cập nhật thông tin');
        setIsEditing({
          name: false,
          dob: false,
          phone: false,
          bio: false,
        });
        setUserAdd(formattedAddress); // Update displayed address
      } else {
        Alert.alert('Lỗi', res.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật');
    }
  };

  const pickBackground = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      try {
        const data = await uploadBackground(email as string, result.assets[0].uri);
        if (data.status === 'success') setBackgroundImage(getImageUrl(data.filename));
      } catch {
        Alert.alert('Lỗi', 'Không thể cập nhật ảnh nền');
      }
    }
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      try {
        const data = await uploadAvatar(email as string, result.assets[0].uri);
        if (data.status === 'success') setAvatarImage(getImageUrl(data.filename));
      } catch {
        Alert.alert('Lỗi', 'Không thể cập nhật avatar');
      }
    }
  };

  const handleAddressConfirm = () => {
    // Format address as "Detailed Address, City, Country"
    if (detailedAddress && selectedCity && selectedCountry) {
      setUserAdd(`${detailedAddress}, ${selectedCity}, ${selectedCountry}`);
    }
    setIsSelectingAddress(false);
  };

  const handleAddressEdit = () => {
    // Parse userAdd to populate fields when editing
    if (userAdd) {
      const addressParts = userAdd.split(', ').map(part => part.trim());
      if (addressParts.length === 3) {
        setDetailedAddress(addressParts[0]);
        setSelectedCity(addressParts[1]);
        setSelectedCountry(addressParts[2]);
      } else {
        setDetailedAddress(userAdd);
        setSelectedCity('');
        setSelectedCountry('');
      }
    }
    setIsSelectingAddress(true);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.containerImage}>
        <ImageBackground
          source={backgroundImage ? { uri: backgroundImage } : undefined}
          style={styles.coverContainerImage}
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

        <View style={styles.containerInfor}>
          {/* Tên người dùng */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tên người dùng</Text>
            <View style={styles.inputRow}>
              {isEditing.name ? (
                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  style={styles.value}
                  autoFocus
                />
              ) : (
                <Text style={styles.value}>{userName || 'Không có tên'}</Text>
              )}
              <Pressable
                onPress={() =>
                  setIsEditing({
                    name: !isEditing.name,
                    dob: false,
                    phone: false,
                    bio: false,
                  })
                }
              >
                <Ionicons name="create-outline" size={20} color="#0a7ea4" />
              </Pressable>
            </View>
          </View>

          {/* Ngày sinh */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Sinh nhật</Text>
            <View style={styles.inputRow}>
              <Text style={styles.value}>
                {userDob ? formatDate(userDob) : 'Chọn ngày'}
              </Text>
              <Pressable
                onPress={() => {
                  setShowDatePicker(true);
                  setIsEditing({
                    name: false,
                    dob: true,
                    phone: false,
                    bio: false,
                  });
                }}
              >
                <Ionicons name="calendar-outline" size={20} color="#0a7ea4" />
              </Pressable>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={userDob || new Date()}
                mode="date"
                display="calendar"
                maximumDate={new Date()}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setUserDob(date);
                }}
              />
            )}
          </View>

          {/* Số điện thoại */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputRow}>
              {isEditing.phone ? (
                <TextInput
                  value={userPhone}
                  onChangeText={setUserPhone}
                  style={[styles.value, { flex: 1 }]}
                  keyboardType="phone-pad"
                  autoFocus
                />
              ) : (
                <Text style={styles.value}>{userPhone || 'Thêm số điện thoại'}</Text>
              )}
              <Pressable
                onPress={() =>
                  setIsEditing({
                    name: false,
                    dob: false,
                    phone: !isEditing.phone,
                    bio: false,
                  })
                }
              >
                <Ionicons name="create-outline" size={20} color="#0a7ea4" />
              </Pressable>
            </View>
          </View>

          {/* Tiểu sử */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tiểu sử</Text>
            <View style={[styles.inputRow, { alignItems: 'flex-start' }]}>
              <Text
                style={[styles.value, { flex: 1 }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {userBio || 'Thêm tiểu sử'}
              </Text>
              <Pressable
                onPress={() => {
                  setIsEditingBioForm(true);
                }}
              >
                <Ionicons name="create-outline" size={20} color="#0a7ea4" />
              </Pressable>
            </View>
          </View>

          {isEditingBioForm && (
            <BioForm
              initialBio={userBio}
              onConfirm={(newBio) => {
                setUserBio(newBio);
                setIsEditingBioForm(false);
              }}
              onCancel={() => setIsEditingBioForm(false)}
            />
          )}

          {/* Địa chỉ */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Địa chỉ</Text>
            <View style={styles.inputRow}>
              <Text style={styles.value}>{userAdd || 'Chưa có địa chỉ'}</Text>
              <Pressable onPress={handleAddressEdit}>
                <Ionicons name="create-outline" size={20} color="#0a7ea4" />
              </Pressable>
            </View>
          </View>

          {isSelectingAddress && (
            <AddressForm
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              detailedAddress={detailedAddress}
              setDetailedAddress={setDetailedAddress}
              onConfirm={handleAddressConfirm}
              onCancel={() => setIsSelectingAddress(false)}
            />
          )}
          
          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: '#0a7ea4' }]}
              onPress={handleConfirm}
            >
              <Text style={styles.actionText}>Xác nhận</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: '#aaa' }]}
              onPress={() => router.back()}
            >
              <Text style={styles.actionText}>Hủy</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerImage: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  coverContainerImage: {
    width: '100%',
    height: height / 3,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  containerInfor: {
    padding: 20,
    width: '100%',
    backgroundColor: '#fff',
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
  fieldContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
    paddingVertical: 4,
  },
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
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bioInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    minHeight: 80,
    paddingVertical: 4,
    textAlignVertical: 'top',
  },
});
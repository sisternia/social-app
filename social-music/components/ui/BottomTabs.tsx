import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const TABS = [
  { label: 'Trang chủ', icon: 'home-outline', route: '/screens/HomePage/home_page' as const },
  { label: 'Cửa hàng', icon: 'cart-outline', route: null },
  { label: 'Thông báo', icon: 'notifications-outline', route: null },
  { label: 'Bạn bè', icon: 'people-outline', route: null },
  { label: 'Cài đặt', icon: 'settings-outline', route: '/screens/Profile/profile' as const },
];

const tabWidth = Dimensions.get('window').width / TABS.length;

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { user_id } = useLocalSearchParams();

  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const index = TABS.findIndex(tab => tab.route && pathname?.startsWith(tab.route));
    if (index !== -1) {
      setActiveIndex(index);
      translateX.value = index * tabWidth;
    }
  }, [pathname]);

  const animatedCursorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(translateX.value, { duration: 200 }) }],
  }));

  const handlePress = (index: number) => {
    const tab = TABS[index];
    if (tab.route) {
      router.replace({ pathname: tab.route, params: { user_id, reload: Date.now() } }); // ép reload
      setActiveIndex(index);
      translateX.value = index * tabWidth;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabContainer}>
        <Animated.View style={[styles.cursor, animatedCursorStyle]} />
        {TABS.map((tab, index) => (
          <Pressable
            key={index}
            style={styles.tab}
            onPress={() => handlePress(index)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={index === activeIndex ? '#0a7ea4' : '#888'}
            />
            <Text style={[styles.label, { color: index === activeIndex ? '#0a7ea4' : '#888' }]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    paddingBottom: 20,
    borderTopWidth: 1,
    zIndex: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 4,
  },
  cursor: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: tabWidth,
    backgroundColor: '#0a7ea4',
    borderRadius: 2,
  },
});

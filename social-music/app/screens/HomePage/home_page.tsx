import BottomNavBar from '@/components/ui/BottomTabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

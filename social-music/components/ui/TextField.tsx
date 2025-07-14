import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type TextFieldProps = TextInputProps & {
  label?: string;
  secureTextEntry?: boolean;
};

export default function TextField({ label, secureTextEntry, ...props }: TextFieldProps) {
  const [visible, setVisible] = useState(!secureTextEntry);
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: themeColor.text }]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          placeholderTextColor="#999"
          secureTextEntry={!visible}
          style={[styles.input, { color: themeColor.text, borderColor: themeColor.icon }]}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setVisible(!visible)} style={styles.icon}>
            <Ionicons name={visible ? 'eye-off' : 'eye'} size={20} color={themeColor.icon} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  icon: {
    paddingHorizontal: 6,
  },
});

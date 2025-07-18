import React, { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface Props {
  initialBio: string;
  onConfirm: (newBio: string) => void;
  onCancel: () => void;
}

export default function BioForm({ initialBio, onConfirm, onCancel }: Props) {
  const [bio, setBio] = useState(initialBio);

  return (
    <View style={styles.fadeContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Tiểu sử</Text>
        <TextInput
          placeholder="Nhập tiểu sử..."
          value={bio}
          onChangeText={setBio}
          style={styles.textInput}
          multiline
        />
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: '#0a7ea4' }]}
            onPress={() => onConfirm(bio)}
          >
            <Text style={styles.actionText}>Xác nhận</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: '#aaa' }]}
            onPress={onCancel}
          >
            <Text style={styles.actionText}>Hủy</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fadeContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

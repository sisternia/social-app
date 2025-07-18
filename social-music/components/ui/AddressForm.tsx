import { Picker } from '@react-native-picker/picker';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import citiesData from 'country-json/src/country-by-cities.json';
import countries from 'country-json/src/country-by-name.json';

interface Props {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  detailedAddress: string;
  setDetailedAddress: (address: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AddressForm({
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  detailedAddress,
  setDetailedAddress,
  onConfirm,
  onCancel,
}: Props) {
  const countryList = countries.map(c => c.country);
  const cityList =
    citiesData.find(c => c.country === selectedCountry)?.cities || [];

  return (
    <View style={styles.fadeContainer}>
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Quốc gia</Text>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value);
                setSelectedCity('');
              }}
            >
              <Picker.Item label="Chọn quốc gia" value="" />
              {countryList.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Thành phố</Text>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(value) => setSelectedCity(value)}
              enabled={!!selectedCountry}
            >
              <Picker.Item label="Chọn thành phố" value="" />
              {cityList.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.label}>Địa chỉ chi tiết</Text>
        <TextInput
          placeholder="Số nhà, đường..."
          style={styles.detailInput}
          value={detailedAddress}
          onChangeText={setDetailedAddress}
        />

        <View style={styles.actionRow}>
          <Pressable style={[styles.actionBtn, { backgroundColor: '#0a7ea4' }]} onPress={onConfirm}>
            <Text style={styles.actionText}>Xác nhận</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, { backgroundColor: '#aaa' }]} onPress={onCancel}>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
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

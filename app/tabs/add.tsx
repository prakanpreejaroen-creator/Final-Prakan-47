import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Blade = {
  bladeName: string;
  bladePrice: string;
  bladeDetail: string;
};

export default function Home() {
  const [bladeName, setBladeName] = useState("");
  const [price, setPrice] = useState("");
  const [detail, setDetail] = useState("");
  const [allBlade, setAllBlade] = useState<Blade[]>([]);

  useEffect(() => {
    loadBlade();
  }, []);

  async function loadBlade() {
    const data = await AsyncStorage.getItem("blade");
    if (data) {
      setAllBlade(JSON.parse(data));
    }
  }

async function addBlade() {
  if (!bladeName || !price) return;

  const blade: Blade = {
    bladeName,
    bladePrice: price,
    bladeDetail: detail,
  };


  const existingData = await AsyncStorage.getItem("blade");
  const parsedData: Blade[] = existingData ? JSON.parse(existingData) : [];

  const updatedData = [...parsedData, blade];

  await AsyncStorage.setItem("blade", JSON.stringify(updatedData));

  setBladeName("");
  setPrice("");
  setDetail("");
}

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🗡 เพิ่มรายการใบมีด</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ชื่อใบมีด</Text>
          <TextInput
            style={styles.input}
            value={bladeName}
            onChangeText={setBladeName}
            placeholder="เช่น Blade A"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ราคา (บาท)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="เช่น 100"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>รายละเอียด</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={detail}
            onChangeText={setDetail}
            placeholder="ประเภท / ขนาด"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={addBlade}>
          <Text style={styles.buttonText}>บันทึกใบมีด</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F8",
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E1E5EA",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#FF5252",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});

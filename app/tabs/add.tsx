import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

type Blade = {
  bladeName: string;
  bladePrice: string;
  bladeDetail: string;
  bladeImage?: string;
};

export default function Home() {
  const [bladeName, setBladeName] = useState("");
  const [price, setPrice] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState<string | null>(null);

  async function pickImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function addBlade() {
    if (!bladeName || !price) return;

    const blade: Blade = {
      bladeName,
      bladePrice: price,
      bladeDetail: detail,
      bladeImage: image ?? undefined,
    };

    const existingData = await AsyncStorage.getItem("blade");
    const parsedData: Blade[] = existingData
      ? JSON.parse(existingData)
      : [];

    const updatedData = [...parsedData, blade];

    await AsyncStorage.setItem("blade", JSON.stringify(updatedData));

    router.back(); // กลับหน้า list
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

        {/* ปุ่มเลือกรูป */}
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageText}>เลือกรูปภาพ</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.previewImage}
          />
        )}

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
  imageBtn: {
    backgroundColor: "#1976D2",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  imageText: {
    color: "#fff",
    fontWeight: "700",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 10,
  },
  button: {
    marginTop: 16,
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

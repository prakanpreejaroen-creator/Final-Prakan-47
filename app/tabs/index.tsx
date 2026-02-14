import React, { useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Blade = {
  bladeName: string;
  bladePrice: string;
  bladeDetail: string;
};

export default function BladeListScreen() {
  const [allBlade, setAllBlade] = useState<Blade[]>([]);

 useFocusEffect(
  useCallback(() => {
    loadBlade();
  }, [])
);

  async function loadBlade() {
    const data = await AsyncStorage.getItem("blade");
    if (data) {
      setAllBlade(JSON.parse(data));
    }
  }

  async function removeBlade(index: number) {
    const newBlade = allBlade.filter((_, i) => i !== index);
    setAllBlade(newBlade);
    await AsyncStorage.setItem("blade", JSON.stringify(newBlade));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🗡 รายการใบมีดทั้งหมด</Text>

      <FlatList
        data={allBlade}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.name}>{item.bladeName}</Text>
              <View style={styles.priceBadge}>
                <Text style={styles.price}>฿{item.bladePrice}</Text>
              </View>
            </View>

            <Text style={styles.desc}>{item.bladeDetail}</Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeBlade(index)}
            >
              <Text style={styles.deleteText}>ลบใบมีด</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>ยังไม่มีรายการใบมีด 🗡</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F8",
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#222",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2C",
  },
  priceBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1976D2",
  },
  desc: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  deleteBtn: {
    alignSelf: "flex-end",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteText: {
    color: "#FF5252",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyBox: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});

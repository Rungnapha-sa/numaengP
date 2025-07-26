import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

const Category = ({ category, data, deleteItem, toggleFavorite, favoriteItems, renderFavoriteIcon }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <SwipeListView
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.text}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.dateText}>วันที่: {item.date}</Text>
            </View>
      
            {renderFavoriteIcon(item.id)} 
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.hiddenContainer}>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}>
              <MaterialIcons name="favorite" size={24} color={favoriteItems.includes(item.id) ? "red" : "white"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
              <Feather name="trash-2" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={0}
        rightOpenValue={-160}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row", // กำหนดให้เนื้อหากับไอคอนดาวอยู่ในแถวเดียวกัน
    alignItems: "flex-start", // จัดให้เนื้อหาทั้งหมดอยู่ด้านซ้าย
    position: "relative", // ให้สามารถวางไอคอนดาวที่ตำแหน่งขวาของการ์ด
  },
  cardContent: {
    flex: 1, // ให้พื้นที่ส่วนนี้ยืดหยุ่นไปตามเนื้อหา
    flexDirection: "column", // ทำให้ title อยู่ข้างบน content
    justifyContent: "flex-start", // จัดให้เนื้อหาเริ่มต้นจากบน
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    fontSize: 20,
    color: "gray",
    marginTop: 5, // เพิ่มช่องว่างระหว่าง title และ content
  },
  hiddenContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    width: 80,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    backgroundColor: "black",
    width: 80,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10, // วางไอคอนดาวที่มุมขวาบนของการ์ด
  },
  dateText: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
});

export default Category;

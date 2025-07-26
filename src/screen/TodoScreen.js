import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, ImageBackground, FlatList, Animated } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign"; 
import Category from "../component/Category";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TodoScreen = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0)); 

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('darkMode', newMode.toString());
  };
  
  const switchTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  });
  

  useEffect(() => {
    const loadTheme = async () => {
        const savedTheme = await AsyncStorage.getItem('darkMode');
        if (savedTheme !== null) {
            setIsDarkMode(savedTheme === 'true');
         }
     };
      loadTheme();
  }, []);

  useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isDarkMode ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isDarkMode]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5001/todos");
      const todos = await response.json();
      setTodos(todos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addMsg = async () => {
    if (!title || !content || !category || !date) return;

    const newMsg = {
      title,
      content,
      category,
      date,
    };

    try {
      await fetch("http://10.0.2.2:5001/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMsg),
      });
      fetchTodos();
      setTitle("");
      setContent("");
      setCategory("");
      setDate("");
      setIsModalVisible(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`http://10.0.2.2:5001/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  const groupedData = Array.isArray(todos)
  ? todos.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {})
  : {};


  const toggleFavorite = (id) => {
    setFavoriteItems((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  const renderFavoriteIcon = (id) => {
    if (!favoriteItems.includes(id)) {
      return null;  
    }
    return (
      <View style={styles.favoriteIcon}>
        <AntDesign
          name="heart"
          size={24}
          color="red" 
        />
      </View>
    );
  };

  return (
    <ImageBackground 
      source={isDarkMode ? require('../../assets/ToDo B.png') : require('../../assets/ToDo.png')} 
      style={styles.container}
    >
      <Text style={styles.header}>To-Do List</Text>
      {/* ปุ่ม Toggle Dark Mode */}
      <TouchableOpacity style={styles.switchContainer} onPress={toggleDarkMode}>
      <Animated.View
        style={[
        styles.switchBall,
        { transform: [{ translateX: switchTranslateX }] }
       ]}
      />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor="#aaa" />
            <TextInput style={styles.input} value={content} onChangeText={setContent} placeholder="Content" placeholderTextColor="#aaa" />
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Category" placeholderTextColor="#aaa" />
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="Date (วว/ดด/ปปปป)" placeholderTextColor="#aaa" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.submitButton} onPress={addMsg}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {Object.keys(groupedData).map((category) => (
        <Category
          key={category}
          category={category}
          data={groupedData[category]}
          deleteItem={deleteItem}
          favoriteItems={favoriteItems}
          toggleFavorite={toggleFavorite}
          renderFavoriteIcon={renderFavoriteIcon}
          isDarkMode={isDarkMode}
        />
      ))}

      <TouchableOpacity 
        style={[
          styles.addButton,
          { backgroundColor: isDarkMode ? "#333" : "#fff" }
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={[
          styles.addButtonText,
          { color: isDarkMode ? "#fff" : "red" }
        ]}>
          New List
        </Text>
        <AntDesign name="pluscircle" size={30} color={isDarkMode ? "white" : "red"} />
      </TouchableOpacity>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 10,
    padding: 20,
    color: "white",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 50,
    elevation: 10,
    marginBottom: 30,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 8,
    color: "red",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  favoriteIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  switchContainer: {
    position: "absolute",
    top: 50,        // ระยะห่างจากบน
    right: 20,      // ระยะห่างจากขวา
    width: 45,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 2,
    zIndex: 99,     // ให้ลอยอยู่บนสุด
  },
  
  switchBall: {
    width: 16,
    height: 16,
    borderRadius: 13,
    backgroundColor: "#fff",
    position: "absolute",
    top: 2,
  },
  
  
});

export default TodoScreen;

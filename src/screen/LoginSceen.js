import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated, TextInput, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { loginUser } from "../service/api";

const LoginSceen = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isDarkMode ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isDarkMode]);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('darkMode');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'true');
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const saveTheme = async (newMode) => {
        try {
            await AsyncStorage.setItem('darkMode', newMode.toString());
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        saveTheme(newMode);
    };

    const switchTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 28],
    });

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Both fields are required");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert("Error", "Invalid email format");
            return;
        }

        try {
            console.log("Attempting to login with:", { email, password  });

            const response = await loginUser(email, password);
            console.log("🔍 Response from API:", response);

            if (!response.token) {
                console.warn("No token received from API");
                Alert.alert("Login Failed", "Invalid response from server.");
                return;
            }

            const userData = {
                fullname: response.fullname || "Unknown",
                email: response.email || "No Email", 
                avatarUrl: response.avatarUrl || "https://via.placeholder.com/100"
            };

            // Save token and user data
            await AsyncStorage.setItem("token", response.token);
            await AsyncStorage.setItem("user", JSON.stringify(userData));

            console.log("API User Data Saved:", userData);


            const savedUserData = await AsyncStorage.getItem("user");
            console.log("🔍 Saved User Data:", JSON.parse(savedUserData));

            // Navigate to Profile after successful login
            navigation.navigate("BottomTabs", { screen: "Profile" });
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Login Failed", error.message || "Something went wrong.");
        }
    };

    return (
        <ImageBackground 
            source={isDarkMode ? require('../../assets/DarkmodeH.png') : require('../../assets/LightmodeH.png')} 
            style={styles.container}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons 
                    name="crown-outline" 
                    size={40} 
                    color="white" 
                    style={[styles.crownIcon, { top: -15 }]} 
                />
                <MaterialCommunityIcons 
                    name="dog" 
                    size={120} 
                    color="white" 
                />
                <Text style={[styles.title, { color: "white" }]}>NAMAENG</Text>
            </View>
            <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#555" : "#000" }]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? "#aaa" : "#000"}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#555" : "#000" }]}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={isDarkMode ? "#aaa" : "#000"}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity 
                style={[styles.button2, { backgroundColor: isDarkMode ? "#444" : "#d32f2f" }]} 
                onPress={handleLogin}
            > 
                <MaterialCommunityIcons name="login" size={24} style={[styles.icon, { color: "#fff" }]} />
                <Text style={[styles.buttonText2 , { color: "#fff" }]}>Login</Text>
            </TouchableOpacity>
            <Text style={[styles.subtitle, { color: isDarkMode ? "#bbb" : "#DDDDDD" }]}> Don't have an account? </Text>
            <TouchableOpacity 
                style={[styles.button, { backgroundColor: isDarkMode ? "#444" : "#fff" }]} 
                onPress={() => navigation.navigate("Register")}
            > 
                <MaterialCommunityIcons name="account" size={24} color="white" style={[styles.icon, { color: isDarkMode ? "#fff" : "#000" }]} />
                <Text style={[styles.buttonText, { color : isDarkMode ? "#fff" : "#000"}]}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchContainer} onPress={toggleDarkMode}>
                <Animated.View 
                    style={[styles.switchBall, { transform: [{ translateX: switchTranslateX }] }]}
                />
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    iconContainer: {
        alignItems: "center",
        position: "relative",
    },
    crownIcon: {
        position: "absolute",
        top: -10,
        zIndex: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        marginBottom:10,
        textAlign: "center",
        marginTop: 40,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 15,
        elevation: 5,
        width: 300,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    button2: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 15,
        elevation: 5,
        marginTop: 15,
        width: 300,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonText2: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    switchContainer: {
        position: "absolute",
        top: 50,
        right: 20,
        width: 45,
        height: 20,
        borderRadius: 15,
        backgroundColor: "#ddd",
        justifyContent: "center",
        paddingHorizontal: 2,
        marginRight: 15,
    },
    switchBall: {
        width: 16,
        height: 16,
        borderRadius: 13,
        backgroundColor: "#fff",
        position: "absolute",
        top: 2,
    },
    input: {
        width: 320,
        height: 50,
        borderRadius: 20,
        paddingHorizontal: 15,
        borderWidth: 1,
        marginBottom: 10,
    },
});

export default LoginSceen;

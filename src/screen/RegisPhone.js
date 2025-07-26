import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Animated, ImageBackground } from "react-native";
import { registerUser } from "../service/api";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const RegisPhone = ({ navigation }) => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [animatedValue] = useState(new Animated.Value(0));

    const handleRegister = async () => {
        if (!fullname || !email || !phone || !password || !confirmPassword) {
            Alert.alert("Error", "All fields are required");
            return;
        }
    
        if (!/^\d{10}$/.test(phone)) {
            Alert.alert("Error", "Invalid phone number");
            return;
        }
    
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert("Error", "Invalid email format");
            return;
        }
    
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
    
        try {
            console.log("Attempting to register with:", { fullname, email, phone, password });
    
            await registerUser(fullname, email, phone, password);
            Alert.alert("Register Success", "Registration successful");
            navigation.navigate("Login");
        } catch (error) {
            console.error("Register Failed:", error);
            Alert.alert("Register Failed", error.message);
        }
    };

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

    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        await AsyncStorage.setItem('darkMode', newMode.toString());
    };

    const switchTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 28],
    });

    return (
        <ImageBackground 
            source={isDarkMode ? require('../../assets/RegisterD.png') : require('../../assets/RegisterL.png')} 
            style={styles.container}
                        >
        <View style={styles.container}>
        <View style={styles.iconContainer}>
                <MaterialCommunityIcons 
                    name="crown-outline" 
                    size={40} 
                    color={isDarkMode ? "#fff" : "#D10000"} 
                    style={[styles.crownIcon, { top: -15 }]} 
                />
                <MaterialCommunityIcons 
                    name="dog" 
                    size={120} 
                    color={isDarkMode ? "#fff" : "#D10000"} 
                />
            </View>
            <Text style={[styles.buttonText3 , { color: isDarkMode ? "#fff" : "#000" }]}>Register</Text>
            <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#555" : "#000" }]}
                value={fullname}
                onChangeText={setFullname}
                placeholder="Fullname"
            />
            <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#555" : "#000" }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
            />
            <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#555" : "#000" }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone"
                keyboardType="phone-pad"
            />
            <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#555" : "#000" }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={true}
            />
            <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#555" : "#000" }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                secureTextEntry={true}
            />
            <TouchableOpacity 
                style={[styles.button, { backgroundColor: isDarkMode ? "#444" : "#d32f2f" }]} 
                onPress={handleRegister}
            > 
                <MaterialCommunityIcons name="account" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button2, { backgroundColor: isDarkMode ? "#444" : "white" }]} 
                onPress={() => navigation.navigate("Login")}
            > 
                <Text style={[styles.buttonText2 , { color: isDarkMode ? "#fff" : "#D10000" }]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchContainer} onPress={toggleDarkMode}>
                            <Animated.View 
                                style={[
                                    styles.switchBall, 
                                        { transform: [{ translateX: switchTranslateX }] }
                                    ]}
                            />
                        </TouchableOpacity>
        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        width: 300,
        height: 50,
        margin: 3,
        borderWidth: 1,
        padding: 10,
        borderRadius: 30,
        marginBottom: 10,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 15,
        elevation: 5,
        marginTop: 25,
        width: 300,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    button1: {
        width: "100%",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 15,
        margin: 3,
        backgroundColor: '#819898',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
    Text: {
        fontSize: 30,
        fontWeight: "bold",
        margin: 10,
    },
    crownIcon: {
        position: "absolute",
        top: -10,
        zIndex: 1,
    },
    iconContainer: {
        alignItems: "center",
        position: "relative",
    },
    buttonText2: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
    },
    button2: {
        width: 300,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 15,
        margin: 3,
        backgroundColor: '#819898',
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText3: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
    },
    switchContainer: {
        position: "absolute",
        top: 20,
        width: 45,
        height: 20,
        borderRadius: 15,
        backgroundColor: "#ddd",
        justifyContent: "center",
        paddingHorizontal: 2,
        marginTop: 40,
        alignSelf: "flex-end",
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

export default RegisPhone;

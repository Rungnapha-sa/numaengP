import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [animatedValue] = useState(new Animated.Value(0));

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
                    style={styles.logo} 
                />
            </View>

            <Text style={[styles.title, { color: isDarkMode ? "white" : "white" }]}>
                NAMAENG
            </Text>
            <Text style={[styles.subtitle, { color: isDarkMode ? "#bbb" : "#DDDDDD" }]}>
                Work is grade, grade is work
            </Text>

            <TouchableOpacity 
                style={[styles.button, { backgroundColor: isDarkMode ? "#444" : "#d32f2f" }]} 
                onPress={() => navigation.navigate("Register")}
            > 
                <MaterialCommunityIcons name="account" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button2, { backgroundColor: isDarkMode ? "#444" : "white" }]} 
                onPress={() => navigation.navigate("Login")}
            > 
                <MaterialCommunityIcons name="login" size={24} style={[styles.icon, { color: isDarkMode ? "#fff" : "#D10000" }]} />
                <Text style={[styles.buttonText2 , { color: isDarkMode ? "#fff" : "#D10000" }]}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchContainer} onPress={toggleDarkMode}>
                <Animated.View 
                    style={[
                        styles.switchBall, 
                        { transform: [{ translateX: switchTranslateX }] }
                    ]}
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
    logo: {
        marginBottom: 15,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        marginBottom:10,
        textAlign: "center",
        fontStyle: "italic",
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
        color: "#ffffff",
        textAlign: "center",
    },
    buttonText2: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#D10000",
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

    }
});

export default HomeScreen;
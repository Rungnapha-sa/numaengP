import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions,ScrollView,SafeAreaView,Animated,ImageBackground} from "react-native";
    
const TarotScreen = () => {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isReversed, setIsReversed] = useState(false);
    const [showCard, setShowCard] = useState(false);


    const cardBackImage = require('../../assets/card_back.png');

    const { width } = Dimensions.get('window');
    const cardWidth = width * 0.87;
    const cardHeight = cardWidth * 1.2;
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
    useEffect(() => {
        setIsReversed(Math.random() > 0.5);
    }, [card]);

    const fetchTarotCard = async () => {
        setLoading(true);
        setShowCard(false);
    
    try {
        const response = await fetch("https://tarotapi.dev/api/v1/cards/random?n=1");
        const data = await response.json();
      
        if (data.cards && data.cards.length > 0) {
            const cardData = data.cards[0];

        setCard({
            name: cardData.name,
            meaning_up: cardData.meaning_up,
             meaning_rev: cardData.meaning_rev,
            image: `https://www.sacred-texts.com/tarot/pkt/img/${cardData.name_short}.jpg`,
        });

        setTimeout(() => {
            setShowCard(true);
        }, 300);
      }
    } catch (error) {
        console.error("Error fetching tarot card:", error);
    }
    setLoading(false);
  };

    return (
        <ImageBackground 
                    source={isDarkMode ? require('../../assets/TarotD.png') : require('../../assets/TarotL.png')} 
                    style={styles.container}
                >
        <SafeAreaView style={styles.safeArea}>
        <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
        <View style={styles.container}>
            <Text style={[styles.title,{color: isDarkMode ? "#fff" : "#000" }] }>Tarot</Text>

            <View style={styles.cardArea}>
                {loading ? (
                <ActivityIndicator size="large" color="#FF3333" />
                ) : showCard && card ? (
                <View style={styles.cardContent}>
                    <View style={styles.cardImageContainer}>
                    <Image 
                        source={{ uri: card.image }} 
                        style={[
                        styles.cardImage,
                        { width: cardWidth, height: cardHeight },
                        isReversed && styles.reversedCard
                        ]}
                    onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
                    />
                    </View>
                <View style={[styles.cardTextContainer,{backgroundColor: isDarkMode ? "#444" : "#fff" }] }>
                    <Text style={[styles.cardName,{color: isDarkMode ? "#fff" : "#000" }]}>{card.name || "ไม่พบชื่อไพ่"}</Text>
                    <ScrollView 
                        style={styles.meaningScroll}
                        showsVerticalScrollIndicator={true}
                    >
                    <Text style={[styles.cardMeaning,{color: isDarkMode ? "#fff" : "#000" }]}>
                        {isReversed ? card.meaning_rev : card.meaning_up || "ไม่มีคำทำนาย"}
                    </Text>
                    </ScrollView>
                </View>
            </View>
            ) : (
              <View style={styles.cardContent}>
                <View style={styles.cardImageContainer}>
                  <Image 
                    source={cardBackImage} 
                    style={[styles.cardImage, { width: cardWidth, height: cardHeight }]}
                  />
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.randomButton} 
            onPress={fetchTarotCard}
            disabled={loading}
          >
            <Text style={styles.randomButtonText}>
              {loading ? 'Loading...' : 'Random'}
            </Text>
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
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  container: { 
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: '100%',

  },
  title: { 
    fontSize: 28,
    fontWeight: "bold",
    color: '#fff',
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center'
  },
  cardArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    marginBottom: 20,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: '100%',
  },
  cardImageContainer: {
    backgroundColor: 'transparent',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: { 
    resizeMode: "contain",
  },
  reversedCard: {
    transform: [{ rotate: '180deg' }],
  },
  cardTextContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: 15,
  },
  cardName: { 
    fontSize: 24,
    fontWeight: "bold",
    color: '#FF3333',
    textAlign: 'center',
    marginBottom: 15,
  },
  meaningScroll: {
    maxHeight: 150,
  },
  cardMeaning: { 
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    color: '#555',
    paddingHorizontal: 5
  },
  randomButton: {
    backgroundColor: '#D10000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 120,
    minWidth: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  randomButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
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

export default TarotScreen;
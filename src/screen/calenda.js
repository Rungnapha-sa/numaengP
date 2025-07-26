import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal, ImageBackground, Animated } from 'react-native';
import DayCard from '../component/DayCard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const CalendarScreen = () => {
  const [todos, setTodos] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState('month'); 

  const getLuckyColor = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    const dayOfWeek = date.getDay(); 
  
    const luckyColors = {
      0: "แดง (Sunday)",
      1: "เหลือง (Monday)",
      2: "ชมพู (Tuesday)",
      3: "เขียว (Wednesday)",
      4: "ส้ม (Thursday)",
      5: "ฟ้า (Friday)",
      6: "ม่วง (Saturday)",
    };
  
    return luckyColors[dayOfWeek];
  };
  
  const screenWidth = Dimensions.get('window').width;
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
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5001/todos");
      const todosData = await response.json();
      setTodos(todosData);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };
   
  useEffect(() => {
    fetchTodos();
  }, []);

  const formatDate = (day, month, year) => {
    if (day === null || day === undefined) return '';
    const dd = day.toString().padStart(2, '0');
    const mm = (month + 1).toString().padStart(2, '0');
    return `${dd}/${mm}/${year}`;
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [])
  );

  const getDaysInMonth = (year, month) => {
    const numDays = new Date(year, month + 1, 0).getDate();
    return [...Array(numDays)].map((_, i) => i + 1);
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysInWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day.getDate());
    }
    return days;
  };

  const days = activeButton === 'week' ? getDaysInWeek(currentDate).filter(day => day !== null) : getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const calendarDays = [...Array(firstDay).fill(null), ...days];

  const changeMonth = (n) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + n, 1));
  };

  const changeWeek = (n) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (n * 7)));
  };

  const openModal = (day) => {
    setSelectedDay(day);
    setModalVisible(true);
  };

  const handleButtonPress = (button) => {
    setActiveButton(button);
  };

  return (
        <ImageBackground 
            source={isDarkMode ? require('../../assets/CalendarD.png') : require('../../assets/calendaB.png')} 
            style={styles.container}
        >
      <View style={styles.contentContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.iconButton, activeButton === 'month' && styles.activeButton]}
            onPress={() => handleButtonPress('month')}
          >
            <Text><MaterialIcons name="calendar-month" size={24} color={activeButton === 'month' ? '#d10000' : 'white'} /></Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, activeButton === 'week' && styles.activeButton]}
            onPress={() => handleButtonPress('week')}
          >
            <Text><FontAwesome5 name="calendar-week" size={24} color={activeButton === 'week' ? '#d10000' : 'white'} /></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => activeButton === 'month' ? changeMonth(-1) : changeWeek(-1)}>
              <Text style={styles.arrow}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.month}>
              {activeButton === 'month'
                ? `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`
                : `Week of ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`}
            </Text>
            <TouchableOpacity onPress={() => activeButton === 'month' ? changeMonth(1) : changeWeek(1)}>
              <Text style={styles.arrow}>▶</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={calendarDays.filter(day => day !== null)}
            numColumns={activeButton === 'month' ? 7 : 1}
            keyExtractor={(item, index) => index.toString()}
            key={activeButton}
            renderItem={({ item }) => {
              const thisDate = formatDate(item, currentDate.getMonth(), currentDate.getFullYear());
              const hasTodo = todos.some(todo => todo.date === thisDate);
            
              return (
                <TouchableOpacity onPress={() => openModal(item)}>
                  <View style={[styles.dayBox, { width: (screenWidth - 100) / (activeButton === 'month' ? 7 : 1) }]}>
                  {item && (
                  <>
                    <View style={{ width: '100%' }}>
                      <Text style={styles.dayTextLeft}>{item}</Text>
                      {hasTodo && <View style={styles.dot} />}

                      {activeButton === 'week' && (
                        <View style={{ marginTop: 5, marginLeft: 10 }}>
                        {todos
                        .filter(todo => todo.date === thisDate)
                        .map(todo => (
                          <Text key={todo.id} style={styles.todoItem}>• {todo.title}</Text>
                        ))}
                        </View>
                     )}
                    </View>
                  </>
                  )}
                  </View>
                </TouchableOpacity>
              );
            }}            
          />
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
       <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedDay !== null && (
          <>
          <DayCard 
            date={formatDate(selectedDay, currentDate.getMonth(), currentDate.getFullYear())}
            todos={todos}
          />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#d10000', textAlign: 'center' }}>
           สีมงคลประจำวัน: {getLuckyColor(formatDate(selectedDay, currentDate.getMonth(), currentDate.getFullYear()))}
          </Text>
      </>
    )}

      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Text style={styles.closeBtn}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
  },
  
  iconButton: {
    padding: 10,
    backgroundColor: '#d10000',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  activeButton: {
    backgroundColor: '#fff',
    borderColor: '#d10000',
    borderWidth: 2,
  },
  calendarContainer: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#d10000',
  },
  month: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  arrow: { fontSize: 28, color: '#fff' },
  dayBox: {
    height: 65,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    position: 'relative',
  },
  dayTextLeft: { 
    fontSize: 14, 
    color: '#333', 
    fontWeight: 'bold', 
    textAlign: 'left',  
    marginLeft: 10,  
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    padding: 20,
  },
  closeBtn: {
    marginTop: 15,
    textAlign: 'center',
    color: '#d10000',
    fontSize: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
  },  
  todoItem: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
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

export default CalendarScreen;

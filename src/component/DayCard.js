// DayCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DayCard({ date, todos }) {
  const dayTodos = todos?.filter(todo => todo.date === date);

  return (
    <View style={styles.card}>
      <Text style={styles.dateText}>Details for {date}</Text>
      {dayTodos && dayTodos.length > 0 ? (
        dayTodos.map(todo => (
          <Text key={todo.id} style={styles.todoText}>• {todo.title}</Text>
        ))
      ) : (
        <Text style={styles.todoText}>No to-do for this day.</Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  dateText: { fontSize: 22, fontWeight: 'bold', color: '#c62828', marginBottom: 15 },
  todoText: { fontSize: 18, color: '#333', marginVertical: 4 },
  todoTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' }
});

import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const answers = [
  'YES ✨',
  'NO 😭',
  'ASK AGAIN LATER 🔮',
  'DEFINITELY! 🌟',
  'MAYBE 🤔',
  'NOT SURE 😶',
  'ABSOLUTELY! 💫',
  'OF COURSE! 🥳',
  'NOT A CHANCE 😂',
  'TRY AGAIN! 🔄',
  'THE STARS SAY YES ⭐',
  'I HAVE A GOOD FEELING ABOUT THIS 👀',
  'DON’T COUNT ON IT 😅',
  'IT IS POSSIBLE 🌈',
  'WHY NOT? 😎',
];

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(
  answers[Math.floor(Math.random() * answers.length)]
);

  const getAnswer = () => {
    if (question.trim() === '') {
      return;
    }

    const randomIndex = Math.floor(Math.random() * answers.length);
    setAnswer(answers[randomIndex]);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Magic 8 Ball
      </Text>

      <Text style={styles.subtitle}>
        Ask a question and let the magic ball answer
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your question..."
        placeholderTextColor="#8AA5B5"
        value={question}
        onChangeText={setQuestion}
      />

      <Pressable
        onPress={getAnswer}
        style={({ pressed }) => [
          styles.ball,
          pressed && styles.ballPressed,
        ]}
      >
        <View style={styles.innerCircle}>
          <Text style={styles.answer}>
            {answer}
          </Text>
        </View>
      </Pressable>

      <Text style={styles.hint}>
        Tap the ball 🔮
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#1B4965',
  },

  subtitle: {
    fontSize: 15,
    color: '#6C8EA3',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },

  input: {
    width: '90%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#1B4965',
    borderWidth: 1,
    borderColor: '#D7EAF3',
    marginBottom: 35,
  },

  ball: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },

  ballPressed: {
    transform: [{ scale: 0.95 }],
  },

  innerCircle: {
    width: 145,
    height: 145,
    borderRadius: 72.5,
    backgroundColor: '#0B1220',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },

  answer: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  hint: {
    marginTop: 25,
    fontSize: 15,
    color: '#3A80F2',
    fontWeight: '600',
  },
});
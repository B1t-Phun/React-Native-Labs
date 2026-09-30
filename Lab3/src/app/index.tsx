import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';

const diceImages = [
  require('../../assets/images/dice1.png'),
  require('../../assets/images/dice2.png'),
  require('../../assets/images/dice3.png'),
  require('../../assets/images/dice4.jpg'),
  require('../../assets/images/dice5.png'),
  require('../../assets/images/dice6.png'),
];

export default function HomeScreen() {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);

  const rollDice = () => {
    setDice1(Math.floor(Math.random() * 6) + 1);
    setDice2(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Dice Game
      </Text>

      <Text style={styles.subtitle}>
        Roll the dice 🎲
      </Text>

      <View style={styles.diceRow}>

        <Image
          source={diceImages[dice1 - 1]}
          style={styles.dice}
        />

        <Image
          source={diceImages[dice2 - 1]}
          style={styles.dice}
        />

      </View>

      <Text style={styles.result}>
        {dice1 + dice2}
      </Text>

      <Pressable
        style={styles.button}
        onPress={rollDice}
      >
        <Text style={styles.buttonText}>
          ROLL DICE
        </Text>
      </Pressable>

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
    fontSize: 16,
    color: '#6C8EA3',
    marginTop: 8,
    marginBottom: 40,
  },

  diceRow: {
    flexDirection: 'row',
    gap: 20,
  },

  dice: {
    width: 130,
    height: 130,
  },

  result: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A80F2',
    marginTop: 25,
  },

  button: {
    backgroundColor: '#3A80F2',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 15,
    marginTop: 25,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';

const notes = [
  {
    name: 'C',
    sound: require('../../assets/sounds/note1.wav'),
  },
  {
    name: 'D',
    sound: require('../../assets/sounds/note2.wav'),
  },
  {
    name: 'E',
    sound: require('../../assets/sounds/note3.wav'),
  },
  {
    name: 'F',
    sound: require('../../assets/sounds/note4.wav'),
  },
  {
    name: 'G',
    sound: require('../../assets/sounds/note5.wav'),
  },
  {
    name: 'A',
    sound: require('../../assets/sounds/note6.wav'),
  },
  {
    name: 'B',
    sound: require('../../assets/sounds/note7.wav'),
  },
];

const colors = [
  '#FF6B6B',
  '#FF9F43',
  '#F7D154',
  '#6BCB77',
  '#4D96FF',
  '#845EC2',
  '#D65DB1',
];

export default function HomeScreen() {
  const [currentNote, setCurrentNote] = useState('');

  const player = useAudioPlayer();

  const playNote = (index: number) => {
    setCurrentNote(notes[index].name);

    player.replace(notes[index].sound);
    player.play();
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Xylophone 🎵
      </Text>

      <Text style={styles.subtitle}>
        Tap a bar to play a note
      </Text>

      <View style={styles.xylophone}>
        {notes.map((note, index) => (
          <Pressable
            key={note.name}
            onPress={() => playNote(index)}
            style={({ pressed }) => [
              styles.bar,
              {
                backgroundColor: colors[index],
                transform: [
                  {
                    scale: pressed ? 0.95 : 1,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.noteText}>
              {note.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.currentNote}>
        {currentNote
          ? `Playing: ${currentNote} 🎶`
          : 'Choose a note'}
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
    marginTop: 8,
    marginBottom: 35,
  },

  xylophone: {
    width: '90%',
    gap: 10,
  },

  bar: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  noteText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  currentNote: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
    color: '#3A80F2',
  },
});
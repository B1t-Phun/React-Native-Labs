import { useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.smallText}>MY DREAM</Text>

      <Text style={styles.title}>I Am Rich</Text>

      <Text style={styles.description}>
        A little sparkle never hurts ✨
      </Text>

      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.diamondContainer,
            { transform: [{ scale }] },
          ]}
        >
          <Image
            source={require('../../assets/images/diamond.png')}
            style={styles.diamond}
            resizeMode="contain"
          />
        </Animated.View>
      </Pressable>

      <Text style={styles.tapText}>
        Tap the diamond 💎
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
    padding: 24,
  },

  smallText: {
    fontSize: 14,
    letterSpacing: 4,
    color: '#6C8EA3',
    marginBottom: 8,
  },

  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1B4965',
  },

  description: {
    fontSize: 16,
    color: '#6C8EA3',
    marginTop: 8,
    marginBottom: 35,
  },

  diamondContainer: {
    width: 280,
    height: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },

  diamond: {
    width: 210,
    height: 210,
  },

  tapText: {
    marginTop: 30,
    fontSize: 15,
    color: '#3A80F2',
    fontWeight: '600',
  },
});
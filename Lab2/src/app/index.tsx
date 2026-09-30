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
        toValue: 0.97,
        duration: 100,
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

      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale }] },
          ]}
        >

          <Image
            source={require('../../assets/images/avatar.jpg')}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            Bích Phượng
          </Text>

          <Text style={styles.job}>
            React Native Developer
          </Text>

          <View style={styles.line} />

          <View style={styles.infoBox}>
            <Text style={styles.icon}>📱</Text>
            <Text style={styles.info}>
              0326 008 418
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.icon}>✉️</Text>
            <Text style={styles.info}>
              aratphuong@gmail.com
            </Text>
          </View>

          <Text style={styles.tap}>
            Tap the card ✨
          </Text>

        </Animated.View>
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

  card: {
    width: 330,
    paddingVertical: 35,
    paddingHorizontal: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    alignItems: 'center',

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 20,
  },

  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4965',
  },

  job: {
    fontSize: 15,
    color: '#6C8EA3',
    marginTop: 6,
  },

  line: {
    width: 220,
    height: 1,
    backgroundColor: '#D7EAF3',
    marginVertical: 25,
  },

  infoBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2FAFD',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 12,
  },

  icon: {
    fontSize: 20,
    marginRight: 14,
  },

  info: {
    fontSize: 15,
    color: '#315A70',
  },

  tap: {
    marginTop: 12,
    fontSize: 13,
    color: '#3A80F2',
    fontWeight: '600',
  },
});
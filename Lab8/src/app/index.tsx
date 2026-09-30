import { useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 220;

const MIN_WEIGHT = 20;
const MAX_WEIGHT = 150;

export default function HomeScreen() {
  const [height, setHeight] = useState('165');
  const [weight, setWeight] = useState('55');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');

  const resultAnimation = useRef(new Animated.Value(0)).current;

  // =========================
  // TĂNG / GIẢM CHIỀU CAO
  // =========================

  const changeHeight = (amount: number) => {
    const current = Number(height) || MIN_HEIGHT;
    const newHeight = Math.min(
      MAX_HEIGHT,
      Math.max(MIN_HEIGHT, current + amount)
    );

    setHeight(String(newHeight));
  };

  // =========================
  // TĂNG / GIẢM CÂN NẶNG
  // =========================

  const changeWeight = (amount: number) => {
    const current = Number(weight) || MIN_WEIGHT;
    const newWeight = Math.min(
      MAX_WEIGHT,
      Math.max(MIN_WEIGHT, current + amount)
    );

    setWeight(String(newWeight));
  };

  // =========================
  // XÁC ĐỊNH PHÂN LOẠI BMI
  // =========================

  const getCategory = (value: number) => {
    if (value < 18.5) {
      return 'UNDERWEIGHT';
    }

    if (value < 25) {
      return 'NORMAL';
    }

    if (value < 30) {
      return 'OVERWEIGHT';
    }

    return 'OBESE';
  };

  // =========================
  // TÍNH BMI
  // =========================

  const calculateBMI = () => {
    Keyboard.dismiss();

    const heightNumber = Number(height);
    const weightNumber = Number(weight);

    if (
      !heightNumber ||
      !weightNumber ||
      heightNumber <= 0 ||
      weightNumber <= 0
    ) {
      return;
    }

    const heightInMeter = heightNumber / 100;

    const result =
      weightNumber / (heightInMeter * heightInMeter);

    const roundedBMI = Number(result.toFixed(1));

    setBmi(roundedBMI);
    setCategory(getCategory(roundedBMI));

    // Animation kết quả
    resultAnimation.setValue(0);

    Animated.spring(resultAnimation, {
      toValue: 1,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  // =========================
  // RESET
  // =========================

  const resetBMI = () => {
    setHeight('165');
    setWeight('55');
    setBmi(null);
    setCategory('');

    resultAnimation.setValue(0);
  };

  // =========================
  // MÀU THEO BMI
  // =========================

  const getCategoryColor = () => {
    switch (category) {
      case 'UNDERWEIGHT':
        return '#4A90E2';

      case 'NORMAL':
        return '#2EAD72';

      case 'OVERWEIGHT':
        return '#F5A623';

      case 'OBESE':
        return '#E85D75';

      default:
        return '#3A80F2';
    }
  };

  // =========================
  // VỊ TRÍ MARKER
  // =========================

  const getMarkerPosition = () => {
    if (bmi === null) {
      return 0;
    }

    // Giới hạn BMI hiển thị trên thanh: 10 → 40
    const minBMI = 10;
    const maxBMI = 40;

    const position =
      ((bmi - minBMI) / (maxBMI - minBMI)) * 100;

    return Math.min(100, Math.max(0, position));
  };

  const resultScale = resultAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <Text style={styles.smallTitle}>
        HEALTH CALCULATOR
      </Text>

      <Text style={styles.title}>
        BMI Calculator
      </Text>

      <Text style={styles.subtitle}>
        Check your Body Mass Index
      </Text>

      {/* INPUT CARD */}

      <View style={styles.inputCard}>
        {/* HEIGHT */}

        <Text style={styles.label}>
          Height
        </Text>

        <View style={styles.controlRow}>
          <Pressable
            style={styles.roundButton}
            onPress={() => changeHeight(-1)}
          >
            <Text style={styles.roundButtonText}>
              −
            </Text>
          </Pressable>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              maxLength={3}
            />

            <Text style={styles.unit}>
              cm
            </Text>
          </View>

          <Pressable
            style={styles.roundButton}
            onPress={() => changeHeight(1)}
          >
            <Text style={styles.roundButtonText}>
              +
            </Text>
          </Pressable>
        </View>

        {/* WEIGHT */}

        <Text style={styles.label}>
          Weight
        </Text>

        <View style={styles.controlRow}>
          <Pressable
            style={styles.roundButton}
            onPress={() => changeWeight(-1)}
          >
            <Text style={styles.roundButtonText}>
              −
            </Text>
          </Pressable>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              maxLength={3}
            />

            <Text style={styles.unit}>
              kg
            </Text>
          </View>

          <Pressable
            style={styles.roundButton}
            onPress={() => changeWeight(1)}
          >
            <Text style={styles.roundButtonText}>
              +
            </Text>
          </Pressable>
        </View>

        {/* CALCULATE */}

        <Pressable
          style={({ pressed }) => [
            styles.calculateButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={calculateBMI}
        >
          <Text style={styles.calculateText}>
            CALCULATE BMI
          </Text>
        </Pressable>
      </View>

      {/* RESULT */}

      {bmi !== null && (
        <Animated.View
          style={[
            styles.resultCard,
            {
              transform: [
                {
                  scale: resultScale,
                },
              ],
            },
          ]}
        >
          <Text style={styles.resultTitle}>
            YOUR BMI
          </Text>

          <Text
            style={[
              styles.bmiValue,
              {
                color: getCategoryColor(),
              },
            ]}
          >
            {bmi}
          </Text>

          <Text
            style={[
              styles.category,
              {
                color: getCategoryColor(),
              },
            ]}
          >
            {category}
          </Text>

          {/* BMI BAR */}

          <View style={styles.barContainer}>
            <View style={styles.bmiBar}>
              <View style={styles.blueSection} />
              <View style={styles.greenSection} />
              <View style={styles.yellowSection} />
              <View style={styles.redSection} />
            </View>

            {/* MARKER */}

            <View
              style={[
                styles.marker,
                {
                  left: `${getMarkerPosition()}%`,
                },
              ]}
            />
          </View>

          {/* RANGE */}

          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>
              Underweight
            </Text>

            <Text style={styles.rangeText}>
              Normal
            </Text>

            <Text style={styles.rangeText}>
              Overweight
            </Text>

            <Text style={styles.rangeText}>
              Obese
            </Text>
          </View>

          {/* INFO */}

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>
              ●
            </Text>

            <Text style={styles.infoText}>
              Your BMI is in the {category.toLowerCase()} range.
            </Text>
          </View>

          {/* RESET */}

          <Pressable
            style={styles.resetButton}
            onPress={resetBMI}
          >
            <Text style={styles.resetText}>
              CALCULATE AGAIN
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {/* INITIAL HINT */}

      {bmi === null && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>
            ⚖️
          </Text>

          <Text style={styles.emptyTitle}>
            Ready to calculate?
          </Text>

          <Text style={styles.emptyText}>
            Enter your height and weight above
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF',
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  // HEADER

  smallTitle: {
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 3,
    color: '#6C8EA3',
    fontWeight: '700',
  },

  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1B4965',
    marginTop: 7,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6C8EA3',
    marginTop: 5,
    marginBottom: 20,
  },

  // INPUT CARD

  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 15,

    elevation: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#315A70',
    marginBottom: 8,
  },

  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  roundButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EAF7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  roundButtonText: {
    fontSize: 24,
    color: '#3A80F2',
    fontWeight: '500',
  },

  inputBox: {
    flex: 1,
    height: 48,
    backgroundColor: '#F4FAFD',
    borderRadius: 14,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EAF3',
  },

  input: {
    flex: 1,
    height: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1B4965',
  },

  unit: {
    fontSize: 13,
    color: '#6C8EA3',
    fontWeight: '600',
    marginRight: 14,
  },

  calculateButton: {
    height: 52,
    backgroundColor: '#3A80F2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },

  buttonPressed: {
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  calculateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // RESULT CARD

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginTop: 16,

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 15,

    elevation: 6,
  },

  resultTitle: {
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 2,
    color: '#8AA5B5',
    fontWeight: '700',
  },

  bmiValue: {
    textAlign: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 2,
  },

  category: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: -5,
  },

  // BMI BAR

  barContainer: {
    width: '100%',
    height: 22,
    justifyContent: 'center',
    marginTop: 18,
  },

  bmiBar: {
    width: '100%',
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
  },

  blueSection: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },

  greenSection: {
    flex: 1,
    backgroundColor: '#2EAD72',
  },

  yellowSection: {
    flex: 1,
    backgroundColor: '#F5A623',
  },

  redSection: {
    flex: 1,
    backgroundColor: '#E85D75',
  },

  marker: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#1B4965',
    marginLeft: -9,
  },

  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  rangeText: {
    fontSize: 9,
    color: '#8AA5B5',
    width: '25%',
    textAlign: 'center',
  },

  // INFO

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2FAFD',
    borderRadius: 13,
    padding: 12,
    marginTop: 16,
  },

  infoIcon: {
    fontSize: 14,
    color: '#3A80F2',
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#527487',
    lineHeight: 17,
  },

  // RESET

  resetButton: {
    alignSelf: 'center',
    marginTop: 14,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#EAF7FF',
  },

  resetText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3A80F2',
  },

  // EMPTY STATE

  emptyState: {
    alignItems: 'center',
    marginTop: 28,
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#527487',
    marginTop: 8,
  },

  emptyText: {
    fontSize: 12,
    color: '#8AA5B5',
    marginTop: 4,
  },
});
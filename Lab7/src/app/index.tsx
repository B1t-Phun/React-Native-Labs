import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const GAME_TIME = 30;
const MAX_LIVES = 3;

type ItemType = 'target' | 'coin' | 'bomb' | null;

export default function HomeScreen() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);

  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [itemType, setItemType] = useState<ItemType>(null);

  const [itemPosition, setItemPosition] = useState({
    top: 300,
    left: 120,
  });

  const [itemSize, setItemSize] = useState(75);

  const scale = useRef(new Animated.Value(1)).current;

  // Dùng để quản lý lượt spawn
  const roundId = useRef(0);

  // RANDOM VỊ TRÍ


  const moveItem = () => {
    const top = Math.floor(Math.random() * 360) + 150;
    const left = Math.floor(Math.random() * 240) + 25;

    setItemPosition({
      top,
      left,
    });
  };

  // ANIMATION

  const hitAnimation = () => {
    scale.setValue(0.65);

    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  // BẮT ĐẦU GAME

  const startGame = () => {
    setScore(0);
    setLives(MAX_LIVES);
    setTimeLeft(GAME_TIME);

    setCombo(0);
    setBestCombo(0);

    setItemSize(75);

    setGameOver(false);
    setGameStarted(true);

    setItemType(null);

    roundId.current += 1;
  };

  // KẾT THÚC GAME


  const endGame = () => {
    setGameStarted(false);
    setGameOver(true);
    setItemType(null);

    roundId.current += 1;
  };

  // MẤT MẠNG


  const loseLife = () => {
    setCombo(0);

    setLives((previous) => {
      const newLives = previous - 1;

      if (newLives <= 0) {
        setGameStarted(false);
        setGameOver(true);
        setItemType(null);

        roundId.current += 1;
      }

      return newLives;
    });
  };

  // BẤM TARGET


  const hitTarget = () => {
    if (!gameStarted || itemType !== 'target') {
      return;
    }

    hitAnimation();

    const newCombo = combo + 1;

    setCombo(newCombo);

    if (newCombo > bestCombo) {
      setBestCombo(newCombo);
    }

    // Combo >= 5 → +2 điểm
    const points = newCombo >= 5 ? 2 : 1;

    setScore((previous) => previous + points);

    // Target nhỏ dần
    setItemSize((previous) =>
      Math.max(42, previous - 2)
    );

    nextRound();
  };

  // BẤM COIN

  const hitCoin = () => {
    if (!gameStarted || itemType !== 'coin') {
      return;
    }

    hitAnimation();

    const newCombo = combo + 1;

    setCombo(newCombo);

    if (newCombo > bestCombo) {
      setBestCombo(newCombo);
    }

    // Coin luôn +3
    setScore((previous) => previous + 3);

    // Coin cũng làm target nhỏ dần
    setItemSize((previous) =>
      Math.max(42, previous - 2)
    );

    nextRound();
  };

  // =========================
  // BẤM BOM
  // =========================

  const hitBomb = () => {
    if (!gameStarted || itemType !== 'bomb') {
      return;
    }

    // Bấm bomb = mất mạng
    loseLife();

    // Bomb biến mất
    setItemType(null);
  };

  // BẤM VÙNG TRỐNG

  const hitEmptyArea = () => {
    if (!gameStarted) {
      return;
    }

    // Nếu đang có bomb thì bấm vùng trống
    // không bị phạt.
    if (itemType === 'bomb') {
      return;
    }

    // Nếu đang có target / coin mà bấm hụt
    // thì mất mạng.
    if (
      itemType === 'target' ||
      itemType === 'coin'
    ) {
      loseLife();
    }
  };

  // LƯỢT TIẾP THEO

  const nextRound = () => {
    const currentRound = ++roundId.current;

    setItemType(null);

    // Chờ một chút rồi mới xuất hiện item tiếp theo
    setTimeout(() => {
      if (!gameStarted || currentRound !== roundId.current) {
        return;
      }

      moveItem();

      // 25% cơ hội xuất hiện bomb
      const random = Math.random();

      if (random < 0.25) {
        setItemType('bomb');

        // Bomb tồn tại 1–2 giây
        const bombDuration =
          Math.floor(Math.random() * 1000) + 1000;

        setTimeout(() => {
          if (
            currentRound !== roundId.current ||
            !gameStarted
          ) {
            return;
          }

          // Bomb biến mất
          setItemType(null);

          // Sau đó mới xuất hiện target / coin
          setTimeout(() => {
            if (
              currentRound !== roundId.current ||
              !gameStarted
            ) {
              return;
            }

            moveItem();

            // 20% coin
            if (Math.random() < 0.2) {
              setItemType('coin');
            } else {
              setItemType('target');
            }
          }, 250);

        }, bombDuration);

      } else {
        // Không có bomb
        // 20% coin
        if (Math.random() < 0.2) {
          setItemType('coin');
        } else {
          setItemType('target');
        }
      }
    }, 250);
  };

  // =========================
  // TIMER
  // =========================

  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }

    if (timeLeft <= 0) {
      endGame();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    gameStarted,
    gameOver,
    timeLeft,
  ]);

  // BẮT ĐẦU VÒNG ĐẦU TIÊN


  useEffect(() => {
    if (
      gameStarted &&
      itemType === null
    ) {
      nextRound();
    }
  }, [gameStarted]);

  // bắt đầu màn game

  if (!gameStarted && !gameOver) {
    return (
      <View style={styles.container}>

        <Text style={styles.mainEmoji}>
          🎯
        </Text>

        <Text style={styles.title}>
          Target Rush
        </Text>

        <Text style={styles.subtitle}>
          Tap the right target and avoid the bombs!
        </Text>

        <View style={styles.ruleCard}>

          <Text style={styles.ruleTitle}>
            HOW TO PLAY
          </Text>

          <Text style={styles.rule}>
            ❤️ 3 mạng
          </Text>

          <Text style={styles.rule}>
            ⏱️ 30 giây
          </Text>

          <Text style={styles.rule}>
            🎯 Target = +1 điểm
          </Text>

          <Text style={styles.rule}>
            🪙 Coin = +3 điểm
          </Text>

          <Text style={styles.rule}>
            💣 Tránh bom!
          </Text>

          <Text style={styles.rule}>
            ⚡ Combo ≥ 5 = +2 điểm
          </Text>

        </View>

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={startGame}
        >
          <Text style={styles.buttonText}>
            START GAME
          </Text>
        </Pressable>

      </View>
    );
  }


  // game kết thúc

  if (gameOver) {
    return (
      <View style={styles.container}>

        <Text style={styles.resultEmoji}>
          🏆
        </Text>

        <Text style={styles.title}>
          Game Over!
        </Text>

        <Text style={styles.subtitle}>
          Nice try!
        </Text>

        <View style={styles.resultCard}>

          <Text style={styles.resultLabel}>
            YOUR SCORE
          </Text>

          <Text style={styles.finalScore}>
            {score}
          </Text>

          <View style={styles.resultRow}>

            <View style={styles.resultItem}>
              <Text style={styles.resultNumber}>
                {bestCombo}
              </Text>

              <Text style={styles.resultSmall}>
                BEST COMBO
              </Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultNumber}>
                {lives}
              </Text>

              <Text style={styles.resultSmall}>
                LIVES LEFT
              </Text>
            </View>

          </View>

        </View>

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={startGame}
        >
          <Text style={styles.buttonText}>
            PLAY AGAIN
          </Text>
        </Pressable>

      </View>
    );
  }

  // =========================
  // GAME SCREEN
  // =========================

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <View style={styles.headerItem}>
          <Text style={styles.headerLabel}>
            SCORE
          </Text>

          <Text style={styles.headerValue}>
            {score}
          </Text>
        </View>

        <View style={styles.headerItem}>
          <Text style={styles.headerLabel}>
            TIME
          </Text>

          <Text
            style={[
              styles.headerValue,
              timeLeft <= 10 &&
                styles.dangerText,
            ]}
          >
            {timeLeft}s
          </Text>
        </View>

        <View style={styles.headerItem}>
          <Text style={styles.headerLabel}>
            COMBO
          </Text>

          <Text style={styles.headerValue}>
            x{combo}
          </Text>
        </View>

      </View>

      {/* LIVES */}

      <View style={styles.livesContainer}>

        <Text style={styles.livesLabel}>
          LIVES
        </Text>

        <Text style={styles.lives}>
          {Array.from({
            length: MAX_LIVES,
          }).map((_, index) =>
            index < lives
              ? '❤️'
              : '🖤'
          )}
        </Text>

      </View>

      {/* BOMB WARNING */}

      {itemType === 'bomb' && (
        <View style={styles.bombWarning}>

          <Text style={styles.bombWarningText}>
            ⚠️ AVOID THE BOMB!
          </Text>

        </View>
      )}

      {/* COIN MESSAGE */}

      {itemType === 'coin' && (
        <View style={styles.coinBadge}>

          <Text style={styles.coinText}>
            🪙 +3 POINTS
          </Text>

        </View>
      )}

      {/* GAME AREA */}

      <Pressable
        style={styles.gameArea}
        onPress={hitEmptyArea}
      >

        {itemType !== null && (
          <Animated.View
            style={[
              styles.itemWrapper,
              {
                top: itemPosition.top,
                left: itemPosition.left,
                transform: [
                  {
                    scale,
                  },
                ],
              },
            ]}
          >

            {/* TARGET */}

            {itemType === 'target' && (
              <Pressable
                onPress={hitTarget}
                style={[
                  styles.item,
                  styles.target,
                  {
                    width: itemSize,
                    height: itemSize,
                    borderRadius:
                      itemSize / 2,
                  },
                ]}
              >
                <Text style={styles.itemEmoji}>
                  🎯
                </Text>
              </Pressable>
            )}

            {/* COIN */}

            {itemType === 'coin' && (
              <Pressable
                onPress={hitCoin}
                style={[
                  styles.item,
                  styles.coin,
                  {
                    width: itemSize,
                    height: itemSize,
                    borderRadius:
                      itemSize / 2,
                  },
                ]}
              >
                <Text style={styles.itemEmoji}>
                  🪙
                </Text>
              </Pressable>
            )}

            {/* BOMB */}

            {itemType === 'bomb' && (
              <Pressable
                onPress={hitBomb}
                style={[
                  styles.item,
                  styles.bomb,
                ]}
              >
                <Text style={styles.itemEmoji}>
                  💣
                </Text>
              </Pressable>
            )}

          </Animated.View>
        )}

      </Pressable>

      <Text style={styles.gameHint}>
        {itemType === 'bomb'
          ? 'Đừng chạm vào bom! 💣'
          : itemType === 'coin'
          ? 'Bấm coin để nhận +3! 🪙'
          : 'Tap the target! 🎯'}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF',
    alignItems: 'center',
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  mainEmoji: {
    fontSize: 55,
    marginBottom: 8,
  },

  resultEmoji: {
    fontSize: 65,
    marginTop: 50,
    marginBottom: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1B4965',
  },

  subtitle: {
    fontSize: 15,
    color: '#6C8EA3',
    marginTop: 7,
    textAlign: 'center',
  },

  ruleCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginTop: 30,

    elevation: 5,

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },

  ruleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3A80F2',
    letterSpacing: 2,
    marginBottom: 15,
  },

  rule: {
    fontSize: 15,
    color: '#315A70',
    marginBottom: 10,
  },

  startButton: {
    backgroundColor: '#3A80F2',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 17,
    marginTop: 30,
  },

  buttonPressed: {
    transform: [
      {
        scale: 0.94,
      },
    ],
    opacity: 0.85,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',

    backgroundColor: '#FFFFFF',
    borderRadius: 20,

    paddingVertical: 13,
    paddingHorizontal: 12,

    elevation: 4,
  },

  headerItem: {
    alignItems: 'center',
    minWidth: 75,
  },

  headerLabel: {
    fontSize: 10,
    color: '#8AA5B5',
    fontWeight: 'bold',
  },

  headerValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3A80F2',
    marginTop: 3,
  },

  dangerText: {
    color: '#E45C70',
  },

  // =========================
  // LIVES
  // =========================

  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  livesLabel: {
    fontSize: 12,
    color: '#6C8EA3',
    fontWeight: 'bold',
    marginRight: 8,
  },

  lives: {
    fontSize: 18,
    letterSpacing: 3,
  },

  // =========================
  // BOMB WARNING
  // =========================

  bombWarning: {
    backgroundColor: '#FFE0E0',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 12,
  },

  bombWarningText: {
    color: '#D64545',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // =========================
  // COIN
  // =========================

  coinBadge: {
    backgroundColor: '#FFF2C7',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 12,
  },

  coinText: {
    color: '#B77900',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // =========================
  // GAME AREA
  // =========================

  gameArea: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    bottom: 0,
  },

  itemWrapper: {
    position: 'absolute',
  },

  item: {
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 8,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  target: {
    backgroundColor: '#3A80F2',

    shadowColor: '#3A80F2',
  },

  coin: {
    backgroundColor: '#FFD166',

    shadowColor: '#E8A900',
  },

  bomb: {
    width: 75,
    height: 75,
    borderRadius: 38,

    backgroundColor: '#2B2B2B',

    shadowColor: '#000000',
  },

  itemEmoji: {
    fontSize: 32,
  },

  gameHint: {
    position: 'absolute',
    bottom: 30,

    color: '#8AA5B5',
    fontSize: 13,
  },

  // =========================
  // RESULT
  // =========================

  resultCard: {
    width: '100%',

    backgroundColor: '#FFFFFF',

    borderRadius: 25,

    padding: 28,

    marginTop: 35,

    alignItems: 'center',

    elevation: 6,
  },

  resultLabel: {
    fontSize: 12,
    color: '#8AA5B5',
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  finalScore: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#3A80F2',
    marginVertical: 5,
  },

  resultRow: {
    flexDirection: 'row',

    width: '100%',

    justifyContent: 'space-around',

    marginTop: 15,
  },

  resultItem: {
    alignItems: 'center',
  },

  resultNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4965',
  },

  resultSmall: {
    fontSize: 10,
    color: '#8AA5B5',
    marginTop: 3,
  },
});
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { questionBank } from '../data/questions';

/* =========================
   LẤY 8 CÂU NGẪU NHIÊN
========================= */

const getRandomQuestions = () => {
  return [...questionBank]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
};

export default function HomeScreen() {
  const [quizQuestions, setQuizQuestions] = useState(
    getRandomQuestions()
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);

  const currentQuestion = quizQuestions[questionIndex];

  const checkAnswer = (answer: boolean) => {
    if (selectedAnswer !== null || finished) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      setScore((previous) => previous + 1);
    }
  };

  const nextQuestion = () => {
    if (questionIndex < quizQuestions.length - 1) {
      setQuestionIndex((previous) => previous + 1);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizQuestions(getRandomQuestions());
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFinished(false);
  };

  /* =========================
     MÀN HÌNH KẾT QUẢ
  ========================= */

  if (finished) {
    return (
      <View style={styles.container}>
        <View style={styles.resultCard}>

          <Text style={styles.resultEmoji}>
            🎉
          </Text>

          <Text style={styles.title}>
            Hoàn thành!
          </Text>

          <Text style={styles.subtitle}>
            Bạn đã hoàn thành 8 câu hỏi.
          </Text>

          <Text style={styles.scoreLabel}>
            Điểm của bạn
          </Text>

          <Text style={styles.finalScore}>
            {score} / 8
          </Text>

          <Text style={styles.feedback}>
            {score === 8
              ? 'Điểm tuyệt đối! 🌟'
              : score >= 4
              ? 'Làm tốt lắm! Tiếp tục cố gắng nhé! 💙'
              : 'Hãy luyện tập thêm nhé! Bạn làm được! 💪'}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.restartButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={restartQuiz}
          >
            <Text style={styles.buttonText}>
              CHƠI LẠI ↻
            </Text>
          </Pressable>

        </View>
      </View>
    );
  }

  /* =========================
     MÀN HÌNH CÂU HỎI
  ========================= */

  return (
    <View style={styles.container}>

      <Text style={styles.headerEmoji}>
        🧠
      </Text>

      <Text style={styles.title}>
        Đố vui
      </Text>

      <Text style={styles.subtitle}>
        Kiểm tra kiến thức của bạn!
      </Text>

      {/* TIẾN ĐỘ */}

      <View style={styles.progressContainer}>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((questionIndex + 1) / quizQuestions.length) * 100
                }%`,
              },
            ]}
          />
        </View>

        <View style={styles.progressInfo}>

          <Text style={styles.progressText}>
            Câu {questionIndex + 1} / {quizQuestions.length}
          </Text>

          <Text style={styles.scoreText}>
            ⭐ {score} điểm
          </Text>

        </View>
      </View>

      {/* CÂU HỎI */}

      <View style={styles.questionCard}>

        <Text style={styles.questionLabel}>
          ĐÚNG HAY SAI?
        </Text>

        <Text style={styles.questionText}>
          {currentQuestion.question}
        </Text>

        <Text style={styles.questionHint}>
          Hãy chọn câu trả lời bên dưới
        </Text>

      </View>

      {/* NÚT ĐÚNG / SAI */}

      <View style={styles.answersContainer}>

        <Pressable
          disabled={selectedAnswer !== null}
          style={({ pressed }) => [
            styles.answerButton,
            styles.trueButton,
            pressed && styles.buttonPressed,

            selectedAnswer !== null &&
              currentQuestion.answer === true &&
              styles.correctButton,

            selectedAnswer === true &&
              currentQuestion.answer === false &&
              styles.wrongButton,
          ]}
          onPress={() => checkAnswer(true)}
        >

          <Text style={styles.answerEmoji}>
            ✓
          </Text>

          <Text style={styles.answerText}>
            ĐÚNG
          </Text>

        </Pressable>

        <Pressable
          disabled={selectedAnswer !== null}
          style={({ pressed }) => [
            styles.answerButton,
            styles.falseButton,
            pressed && styles.buttonPressed,

            selectedAnswer !== null &&
              currentQuestion.answer === false &&
              styles.correctButton,

            selectedAnswer === false &&
              currentQuestion.answer === true &&
              styles.wrongButton,
          ]}
          onPress={() => checkAnswer(false)}
        >

          <Text style={styles.answerEmoji}>
            ✕
          </Text>

          <Text style={styles.answerText}>
            SAI
          </Text>

        </Pressable>

      </View>

      {/* PHẢN HỒI */}

      {selectedAnswer !== null && (

        <View
          style={[
            styles.feedbackCard,

            selectedAnswer === currentQuestion.answer
              ? styles.correctFeedback
              : styles.wrongFeedback,
          ]}
        >

          <Text style={styles.feedbackTitle}>
            {selectedAnswer === currentQuestion.answer
              ? 'Chính xác! 🎉'
              : 'Chưa đúng! 💡'}
          </Text>

          <Text style={styles.feedbackText}>
            {currentQuestion.explanation}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={nextQuestion}
          >

            <Text style={styles.buttonText}>
              {questionIndex === quizQuestions.length - 1
                ? 'XEM KẾT QUẢ →'
                : 'CÂU TIẾP THEO →'}
            </Text>

          </Pressable>

        </View>

      )}

      <Text style={styles.footer}>
        Chúc bạn may mắn ✨
      </Text>

    </View>
  );
}

/* =========================
   STYLE
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },

  headerEmoji: {
    fontSize: 42,
    marginBottom: 5,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1B4965',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#6C8EA3',
    marginTop: 6,
    marginBottom: 25,
    textAlign: 'center',
  },

  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },

  progressTrack: {
    height: 9,
    backgroundColor: '#D7EAF3',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#3A80F2',
    borderRadius: 10,
  },

  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  progressText: {
    fontSize: 13,
    color: '#6C8EA3',
  },

  scoreText: {
    fontSize: 13,
    color: '#3A80F2',
    fontWeight: 'bold',
  },

  questionCard: {
    width: '100%',
    minHeight: 205,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  questionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#3A80F2',
    marginBottom: 18,
  },

  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B4965',
    textAlign: 'center',
    lineHeight: 32,
  },

  questionHint: {
    fontSize: 13,
    color: '#8AA5B5',
    marginTop: 16,
  },

  answersContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 14,
    marginTop: 24,
  },

  answerButton: {
    flex: 1,
    height: 105,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  trueButton: {
    backgroundColor: '#65CBA5',
  },

  falseButton: {
    backgroundColor: '#F28B9C',
  },

  correctButton: {
    backgroundColor: '#2DAA78',
  },

  wrongButton: {
    backgroundColor: '#E45C70',
  },

  answerEmoji: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  answerText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },

  feedbackCard: {
    width: '100%',
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
  },

  correctFeedback: {
    backgroundColor: '#D9F7E9',
  },

  wrongFeedback: {
    backgroundColor: '#FCE4E8',
  },

  feedbackTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B4965',
    marginBottom: 5,
  },

  feedbackText: {
    fontSize: 13,
    color: '#315A70',
    lineHeight: 19,
  },

  nextButton: {
    backgroundColor: '#3A80F2',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },

  buttonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  footer: {
    color: '#8AA5B5',
    fontSize: 12,
    marginTop: 22,
  },

  resultCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },

  resultEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },

  scoreLabel: {
    color: '#6C8EA3',
    fontSize: 16,
    marginTop: 28,
  },

  finalScore: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#3A80F2',
    marginTop: 5,
  },

  feedback: {
    fontSize: 15,
    color: '#315A70',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 28,
  },

  restartButton: {
    backgroundColor: '#3A80F2',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
});
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    loadHighScore();
  }, []);

  // 画面がフォーカスされた時にハイスコアを再読み込み
  useFocusEffect(
    useCallback(() => {
      loadHighScore();
    }, [])
  );

  const loadHighScore = async () => {
    try {
      const score = await AsyncStorage.getItem("numberSnakeHighScore");
      if (score !== null) {
        setHighScore(parseInt(score));
      }
    } catch (error) {
      console.error("ハイスコアの読み込みに失敗しました:", error);
    }
  };

  const startGame = () => {
    router.push("/game");
  };

  const showInstructions = () => {
    Alert.alert(
      "ゲームの遊び方",
      "🐍 蛇を操作して数字を昇順（1→2→3...）に食べよう！\n\n" +
        "📱 画面をスワイプまたはタップして移動\n" +
        "🎯 次に食べるべき数字は金色でハイライト\n" +
        "⚡ 5個食べるごとにスピードアップ\n" +
        "❌ 間違った順序で食べるとゲームオーバー",
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* タイトル */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Number</Text>
        <Text style={styles.titleSnake}>Snake</Text>
        <Text style={styles.subtitle}>🐍 数字を順番に食べよう！</Text>
      </View>

      {/* ハイスコア */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>ハイスコア</Text>
        <Text style={styles.scoreValue}>{highScore}</Text>
      </View>

      {/* ボタン */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.playButton} onPress={startGame}>
          <Text style={styles.playButtonText}>プレイ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.instructionButton}
          onPress={showInstructions}
        >
          <Text style={styles.instructionButtonText}>遊び方</Text>
        </TouchableOpacity>
      </View>

      {/* デコレーション */}
      <View style={styles.decoration}>
        <Text style={styles.decorationText}>1 2 3 4 5 6 7 8 9</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4ade80",
    textShadowColor: "rgba(74, 222, 128, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleSnake: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fbbf24",
    textShadowColor: "rgba(251, 191, 36, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: -10,
  },
  subtitle: {
    fontSize: 18,
    color: "#94a3b8",
    marginTop: 10,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  scoreLabel: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fbbf24",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "#4ade80",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: "#4ade80",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a2e",
    textAlign: "center",
  },
  instructionButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#94a3b8",
  },
  instructionButtonText: {
    fontSize: 18,
    color: "#94a3b8",
    textAlign: "center",
  },
  decoration: {
    position: "absolute",
    bottom: 50,
    opacity: 0.3,
  },
  decorationText: {
    fontSize: 24,
    color: "#4ade80",
    letterSpacing: 8,
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ScoreRecord {
  score: number;
  date: string;
  id: string;
}

export default function RankingScreen() {
  const [highScore, setHighScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    loadScoreData();
  }, []);

  // 画面がフォーカスされた時にデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      loadScoreData();
    }, [])
  );

  const loadScoreData = async () => {
    try {
      // ハイスコア読み込み
      const highScoreData = await AsyncStorage.getItem("numberSnakeHighScore");
      if (highScoreData !== null) {
        setHighScore(parseInt(highScoreData));
      }

      // スコア履歴読み込み
      const historyData = await AsyncStorage.getItem("numberSnakeScoreHistory");
      if (historyData !== null) {
        const history = JSON.parse(historyData);
        setScoreHistory(
          history.sort((a: ScoreRecord, b: ScoreRecord) => b.score - a.score)
        );
      }
    } catch (error) {
      console.error("スコアデータ読み込みエラー:", error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      "データ削除",
      "すべてのスコアデータを削除しますか？この操作は取り消せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("numberSnakeHighScore");
              await AsyncStorage.removeItem("numberSnakeScoreHistory");
              setHighScore(0);
              setScoreHistory([]);
              Alert.alert("完了", "すべてのデータが削除されました。");
            } catch (error) {
              console.error("データ削除エラー:", error);
              Alert.alert("エラー", "データの削除に失敗しました。");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}位`;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 ランキング</Text>
      </View>

      {/* ハイスコア表示 */}
      <View style={styles.highScoreContainer}>
        <Text style={styles.highScoreLabel}>最高スコア</Text>
        <Text style={styles.highScoreValue}>{highScore}</Text>
        <Text style={styles.highScoreSubtext}>
          {highScore > 0 ? "素晴らしい記録です！" : "まだ記録がありません"}
        </Text>
      </View>

      {/* スコア履歴 */}
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>スコア履歴</Text>
          {scoreHistory.length > 0 && (
            <TouchableOpacity onPress={clearAllData} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>クリア</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
        >
          {scoreHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>🎮</Text>
              <Text style={styles.emptyStateTitle}>まだ記録がありません</Text>
              <Text style={styles.emptyStateSubtext}>
                ゲームをプレイしてスコアを記録しましょう！
              </Text>
            </View>
          ) : (
            scoreHistory.slice(0, 10).map((record, index) => (
              <View key={record.id} style={styles.scoreItem}>
                <View style={styles.rankContainer}>
                  <Text style={styles.rankText}>{getRankEmoji(index)}</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreText}>{record.score}</Text>
                  <Text style={styles.dateText}>{formatDate(record.date)}</Text>
                </View>
                {index === 0 && (
                  <View style={styles.bestBadge}>
                    <Text style={styles.bestBadgeText}>BEST</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* 統計情報 */}
      {scoreHistory.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>統計</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{scoreHistory.length}</Text>
              <Text style={styles.statLabel}>プレイ回数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(
                  scoreHistory.reduce((sum, record) => sum + record.score, 0) /
                    scoreHistory.length
                )}
              </Text>
              <Text style={styles.statLabel}>平均スコア</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fbbf24",
  },
  highScoreContainer: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  highScoreLabel: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 5,
  },
  highScoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4ade80",
    marginBottom: 5,
  },
  highScoreSubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  historyContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  clearButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  historyList: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#94a3b8",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  rankContainer: {
    width: 50,
    alignItems: "center",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fbbf24",
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 15,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4ade80",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  bestBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  bestBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  statsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4ade80",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
});

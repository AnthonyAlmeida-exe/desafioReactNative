import React, { useState, useCallback, useEffect } from "react";
import api from "./services/api";

import {
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";

export default function App() {
  const [repository, setRepository] = useState([]);

  async function loadData() {
    try {
      const { data: data } = await api.get(`/repositories`);
      setRepository(data);
    } catch (error) {
      Alert.alert("Não foi possivel encontrar os repositórios!");
    }
  }

  async function handleLikeRepository(id) {
    try {
      const req = await api.post(`/repositories/${id}/like`);
      console.log(req.data);
      setRepository([req.data]);
    } catch (error) {
      Alert.alert("Não foi possivel curtir este repositório!");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <SafeAreaView styles={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
        <FlatList
          styles={styles.techsContainer}
          data={repository}
          keyExtractor={(repo) => repo.id}
          renderItem={({ item }) => (
            <>
              <Text style={styles.repository}>{item.title}</Text>
              <View style={styles.techsContainer}>
                {item.techs.map((tech) => (
                  <Text style={styles.tech}>{tech}</Text>
                ))}
              </View>
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${item.id}`}
                >
                  {item.likes} {item.likes === 1 ? "curtida" : "curtidas"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleLikeRepository(item.id);
                }}
                testID={`like-button-${item.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});

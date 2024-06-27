import { useEffect, useRef, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { debounce } from "lodash";

import FlatListItem from "./components/FlatListItem";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [viewableItems, setViewableItems] = useState([]);
  const flatListRef = useRef(null);

  const handleViewableItemsChanged = useCallback(
    debounce(({ viewableItems }) => {
      setViewableItems(viewableItems.map((item) => item.item.id));
    }, 100),
    []
  );

  useEffect(() => {
    // Fetch messages
  }, []);

  const loadMoreMessages = useCallback(() => {
    // Fetch more messages
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <FlatListItem
        message={item}
        index={index}
        //  isViewable={viewableItems.includes(item.id) && isFocused}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.currentItem} />
      <View style={styles.flatListContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          inverted={messages.length > 0}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.flatListContent}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
          ListEmptyComponent={() => <Text>No messages.</Text>}
        />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  currentItem: {
    width: "80%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContainer: {
    backgroundColor: "gray",
  },
  flatListContent: {
    paddingHorizontal: 8,
  },
});

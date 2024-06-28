import { useEffect, useRef, useState, useCallback } from "react";
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

const ITEMS_PER_PAGE = 12;

export default function App() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [viewableItems, setViewableItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [messageData, setMessageData] = useState([]);
  const flatListRef = useRef(null);

  const handleViewableItemsChanged = useCallback(
    debounce(({ viewableItems }) => {
      setViewableItems(viewableItems.map((item) => item.item._id));
    }, 100),
    []
  );

  useEffect(() => {
    // Load initial messages
    const loadInitialMessages = async () => {
      setLoading(true);
      try {
        const md = require("./data/messages.json");

        const newMessages = md.slice(0, ITEMS_PER_PAGE);
        setMessages(newMessages);

        setMessageData(md);
        const totalPages = Math.ceil(md.length / ITEMS_PER_PAGE);
        setLastPage(totalPages);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    };
    loadInitialMessages();
    return () => {
      setMessageData([]);
      setMessages([]);
      setViewableItems([]);
      setCurrentPage(0);
      setLastPage(0);
    };
  }, []);

  const loadMessages = useCallback(() => {
    if (loading || currentPage >= lastPage) return;

    setLoading(true);
    try {
      const start = currentPage * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const newMessages = messageData.slice(start, end);
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      setCurrentPage((prevPage) => prevPage + 1);
    } finally {
      setLoading(false);
    }
  }, [loading, currentPage, lastPage, messageData]);

  const loadMoreMessages = useCallback(() => {
    if (loading) return;
    loadMessages();
  }, [loading, loadMessages]);

  const renderItem = useCallback(
    ({ item, index }) => <FlatListItem message={item} index={index} />,
    []
  );

  const keyExtractor = useCallback((item) => item._id, []);

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

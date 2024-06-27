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
      setViewableItems(viewableItems.map((item) => item.item.id));
    }, 100),
    []
  );

  useEffect(() => {
    // Load initial messages
    const loadInitialMessages = async () => {
      const md = require("./data/messages.json");
      console.log("Initial messages loaded...", md.length);

      const newMessages = md.slice(0, ITEMS_PER_PAGE);
      setMessages(newMessages);

      setMessageData(md);
      const totalPages = Math.ceil(md.length / ITEMS_PER_PAGE);
      console.log("Total pages", totalPages);
      setLastPage(totalPages);
      setCurrentPage(1);
    };
    loadInitialMessages();
  }, []);

  const loadMessages = () => {
    //if (currentPage >= lastPage) return;

    setLoading(true);
    const start = currentPage * ITEMS_PER_PAGE;
    console.log("start ", start);
    const end = start + ITEMS_PER_PAGE;
    console.log("end ", end);
    const newMessages = messageData.slice(start, end);
    console.log(
      "first id",
      newMessages[0]._id,
      "last id",
      newMessages[newMessages.length - 1]._id
    );
    console.log("Loading more messages...", newMessages);

    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    setCurrentPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  const loadMoreMessages = useCallback(() => {
    if (loading) return;
    loadMessages();
  }, [loading]);

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

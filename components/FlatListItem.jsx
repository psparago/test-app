import React, { useState, useEffect, memo } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

const FlatListItem = memo(
  ({ message, index }) => {
    const [data, setData] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
      const findThumbnailItem = async () => {
        // Support for simple text messages
        if (!message.message) {
          setData({ type: "text", data: {} });
          setInitialized(true);
          return;
        }

        let thumbnailItem = null;
        const priority = ["video", "image", "symbol", "text"];
        for (const type of priority) {
          const item = message.message.items.find(
            (item) =>
              (item.type === "media" ? item.content.mediaType : item.type) ===
              type
          );
          if (item) {
            thumbnailItem = item;
            break;
          }
        }

        switch (
          thumbnailItem.type === "media"
            ? thumbnailItem.content.mediaType
            : thumbnailItem.type
        ) {
          case "symbol":
            setData({
              type: "symbol",
              data: {},
            });
            break;
          case "text":
            setData({
              type: "text",
              data: {},
            });
            break;
          case "image":
            setData({
              type: "image",
              data: {},
            });
            break;
          case "video":
            setData({
              type: "video",
              data: {},
            });
            break;
          default:
            setData({ type: "text", data: {} });
            break;
        }
        setInitialized(true);
      };

      if (!initialized) {
        findThumbnailItem();
      }
    }, [message]);

    const renderPreview = () => {
      console.log("renderPreview", index);
      switch (data.type) {
        case "symbol":
          return (
            <View
              style={{
                padding: 4,
                width: "100%",
                height: "100%",
                alignItems: "center",
                backgroundColor: "green",
              }}
            />
          );
        case "text":
          return (
            <View
              style={{
                padding: 4,
                width: "100%",
                height: "100%",
                alignItems: "center",
                backgroundColor: "red",
              }}
            />
          );
        case "image":
          return (
            <View
              style={{
                padding: 4,
                width: "100%",
                height: "100%",
                alignItems: "center",
                backgroundColor: "blue",
              }}
            />
          );
        case "video":
          return (
            <View
              style={{
                padding: 4,
                width: "100%",
                height: "100%",
                alignItems: "center",
                backgroundColor: "purple",
              }}
            />
          );
        default:
          console.log("bad type message", message.id);
          return null;
      }
    };

    return !initialized ? (
      <ActivityIndicator size="small" color="#0000ff" />
    ) : (
      <View style={[styles.mediaContainer, { width: 100, height: 100 }]}>
        {renderPreview()}
        <View style={styles.indexCircle}>
          <Text style={styles.indexText}>{index}</Text>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    console.log(
      "TestNavigatorPreview memo",
      prevProps.message.id,
      nextProps.message.id,
      prevProps.index,
      nextProps.index
    );
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.index === nextProps.index
    );
  }
);

export default FlatListItem;

const styles = StyleSheet.create({
  mediaContainer: {
    margin: 4,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  messageText: {
    fontSize: 16,
    color: "white",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  avatar: {
    width: "75%",
    height: "75%",
    borderRadius: 50,
    borderColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
  },
  indexCircle: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  indexText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { DataTable } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import * as Clipboard from "expo-clipboard";
import { Button } from "react-native-elements";

export default function App() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState(new Date().toLocaleTimeString());
  const [history, setHistory] = useState([]);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
    ToastAndroid.show("Text is copied", ToastAndroid.SHORT);
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    setType(type);
    setDate(new Date().toLocaleTimeString());
    setHistory([...history, { data: data, date: date, type: type }]);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title="Allow Camera" onPress={() => askForCameraPermission()} />
      </View>
    );
  }

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          {scanned ? null : (
            <>
              <View style={styles.barcodebox}>
                <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  style={{ height: 400, width: 400 }}
                />
              </View>
            </>
          )}
          {scanned ? (
            <>
              <Text style={styles.maintext1}>Type: {type}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.maintext}>
                  Value: {text.split(";").join("\n")}
                </Text>

                <Button
                  buttonStyle={{
                    backgroundColor: "transparent",
                    marginLeft: 5,
                    marginTop: 10,
                    marginRight: 10,
                  }}
                  onPress={copyToClipboard}
                  icon={{
                    name: "copy",
                    type: "font-awesome",
                    size: 16,
                    color: "#6499e3",
                  }}
                  size="sm"
                  title=""
                />
              </View>

              {scanned && (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: "tomato",
                    borderRadius: 10,
                    marginBottom: 15,
                  }}
                  onPress={() => setScanned(false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    SCAN AGAIN
                  </Text>
                </TouchableOpacity>
              )}
              {history.map((value, index) => {
                return (
                  <View
                    style={{
                      marginTop: 10,
                      borderRadius: 20,
                      elevation: 5,
                      width: "95%",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      marginBottom: 5,
                    }}
                  >
                    <View style={{ width: "100%" }}>
                      <Text
                        style={{
                          marginTop: 10,
                          marginLeft: 10,
                          fontSize: 13,
                          fontWeight: "600",
                        }}
                      >
                        Type:{" "}
                        <Text style={{ color: "tomato" }}>{value.type}</Text>
                      </Text>
                      <Text
                        style={{
                          marginTop: 5,
                          marginLeft: 10,
                          fontSize: 13,
                          fontWeight: "600",
                        }}
                      >
                        Value:{" "}
                        <Text style={{ color: "tomato" }}>{value.data}</Text>
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            marginTop: 5,
                            marginLeft: 10,
                            fontSize: 13,
                            fontWeight: "600",
                          }}
                        >
                          Time:{" "}
                          <Text style={{ color: "tomato" }}>{value.date}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  maintext1: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  maintext: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 50,
    fontWeight: "bold",
    marginLeft: 20,
  },
  barcodebox: {
    alignItems: "center",
    marginTop: 100,
    justifyContent: "center",
    height: 400,
    width: windowWidth - 93,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "tomato",
  },
});

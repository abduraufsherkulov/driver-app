import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform
} from "react-native";

import { Button } from "react-native-elements";
import { Font } from "expo";
const isAndroid = Platform.OS === "android";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BG_IMAGE = require("../assets/images/loader.png");
const IMAGE_SIZE = SCREEN_WIDTH - 80;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      username: "",
      full_name: "",
      phone: ""
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    await AsyncStorage.multiGet(["username", "full_name", "phone"]).then(
      response => {
        this.setState({
          username: response[0][1],
          full_name: response[1][1],
          phone: response[2][1]
        });
      }
    );
    this.setState({
      fontLoaded: true
    });
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {this.state.fontLoaded ? (
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.statusBar} />
            <View style={styles.navBar}>
              <Text style={styles.nameHeader}>{this.state.full_name}</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={{
                    uri:
                      "https://www.instituteofhypnotherapy.com/wp-content/uploads/2016/01/tutor-8.jpg"
                  }}
                  style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 10
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 20,
                  marginHorizontal: 40,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 26,
                    color: "rgba(47,44,60,1)",
                    fontFamily: "bold"
                  }}
                >
                  {this.state.username}
                </Text>
                <Text
                  style={{
                    flex: 0.5,
                    fontSize: 15,
                    color: "gray",
                    textAlign: "left",
                    marginTop: 5
                  }}
                >
                  0.8 mi
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 26,
                    color: "green",
                    fontFamily: "bold",
                    textAlign: "right"
                  }}
                >
                  84%
                </Text>
              </View>
              {/* <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: SCREEN_WIDTH - 80,
                  marginLeft: 40
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: "white",
                    fontFamily: "regular"
                  }}
                >
                  100% Italian, fun loving, affectionate, young lady who knows
                  what it takes to make a relationship work.
                </Text>
              </View> */}
              {/* <View style={{ flex: 1, marginTop: 30 }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: "rgba(216, 121, 112, 1)",
                    fontFamily: "regular",
                    marginLeft: 40
                  }}
                >
                  INTERESTS
                </Text>
              </View> */}
              <View style={{ flex: 1, marginTop: 30 }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: "rgba(216, 121, 112, 1)",
                    fontFamily: "regular",
                    marginLeft: 40
                  }}
                >
                  ИНФО
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 20,
                    marginHorizontal: 30
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoTypeLabel}>Возраст</Text>
                      <Text style={styles.infoTypeLabel}>Машина</Text>
                      <Text style={styles.infoTypeLabel}>Номер машины</Text>
                      <Text style={styles.infoTypeLabel}>Дата регистрации</Text>
                      <Text style={styles.infoTypeLabel}>Номер телефона</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.infoAnswerLabel}>26</Text>
                      <Text style={styles.infoAnswerLabel}>Матиз</Text>
                      <Text style={styles.infoAnswerLabel}>30 A 1235</Text>
                      <Text style={styles.infoAnswerLabel}>10.01.2019</Text>
                      <Text style={styles.infoAnswerLabel}>
                        {this.state.phone}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, marginTop: 30 }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: "rgba(216, 121, 112, 1)",
                    fontFamily: "regular",
                    marginLeft: 40
                  }}
                >
                  СТАТИСТИКА
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 20,
                    marginHorizontal: 15
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoTypeLabel}>Лучшая доставка</Text>
                      <Text style={styles.infoTypeLabel}>Худшая Доставка</Text>
                      <Text style={styles.infoTypeLabel}>
                        Отработ. километры
                      </Text>
                      <Text style={styles.infoTypeLabel}>
                        Заработанные деньги
                      </Text>
                      <Text style={styles.infoTypeLabel}>Процент бонусов</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.infoAnswerLabel}>18 min</Text>
                      <Text style={styles.infoAnswerLabel}>57 min</Text>
                      <Text style={styles.infoAnswerLabel}>123 km</Text>
                      <Text style={styles.infoAnswerLabel}>2 265 500</Text>
                      <Text style={styles.infoAnswerLabel}>12 %</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Button
                  containerStyle={{ marginVertical: 20 }}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  buttonStyle={{
                    height: 55,
                    width: SCREEN_WIDTH - 40,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  linearGradientProps={{
                    colors: ["rgba(214,116,112,1)", "rgba(233,174,87,1)"],
                    start: [1, 0],
                    end: [0.2, 0]
                  }}
                  title="Выход"
                  titleStyle={{
                    fontFamily: "regular",
                    fontSize: 20,
                    color: "white",
                    textAlign: "center"
                  }}
                  onPress={this._signOutAsync}
                  activeOpacity={0.5}
                />
              </View>
            </ScrollView>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image source={BG_IMAGE} style={styles.loaderStyle} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}
export default Dashboard;

const styles = StyleSheet.create({
  statusBar: {
    height: 10
  },
  navBar: {
    height: 60,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignContent: "center"
  },
  nameHeader: {
    color: "rgba(47,44,60,1)",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "regular"
  },
  infoTypeLabel: {
    fontSize: 15,
    textAlign: "right",
    color: "rgba(126,123,138,1)",
    fontFamily: "regular",
    paddingBottom: 10
  },
  infoAnswerLabel: {
    fontSize: 15,
    color: "rgba(47,44,60,1)",
    fontFamily: "regular",
    paddingBottom: 10
  },
  loaderStyle: {
    flex: 1,
    alignSelf: "stretch",
    resizeMode: "contain",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  }
});

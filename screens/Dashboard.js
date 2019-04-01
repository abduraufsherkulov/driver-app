import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import moment from "moment";
import {
  AsyncStorage,
  View,
  StatusBar,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import axios from "axios";
import { EvilIcons } from "@expo/vector-icons";
import { Text, Button } from "react-native-elements";
import { Font } from "expo";

const isAndroid = Platform.OS === "android";

import {
  NavigationLogo,
  Phone,
  Lock,
  RectangleDivider,
  HorizontalDivider
} from "../assets/images/MainSvg";

class MyDashboardTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <NavigationLogo />
      </View>
    );
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      username: "",
      full_name: "",
      phone: "",
      token: "",
      loading: false,
      showLoading: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../assets/fonts/GoogleSans-Medium.ttf")
    });
    let token = await AsyncStorage.getItem("access_token");
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
      fontLoaded: true,
      token: token
    });
  }

  _signOutAsync = async () => {
    this.setState({
      loading: true
    });
    const urlLogout = "https://api.delivera.uz/drivers/logout";
    axios({
      method: "post",
      url: urlLogout,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: this.state.token
      }
    })
      .then(response => {
        console.log(response.data);
        this.setState(
          {
            loading: false
          },
          async () => {
            await AsyncStorage.clear();
            this.props.navigation.navigate("Auth");
          }
        );
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error, "error");
      });
  };

  static navigationOptions = ({ navigation }) => ({
    headerTitle: <MyDashboardTitle />,
    headerStyle: {
      backgroundColor: "white",
      paddingTop: 0,
      height: 60
    },
    headerTitleStyle: { color: "rgba(126,123,138,1)" },
    headerLeftContainerStyle: {
      padding: 0
    },
    headerTitleContainerStyle: {
      padding: 0
    },
    headerForceInset: { top: "never", bottom: "never" }
  });

  render() {
    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontFamily: "medium", fontSize: 20 }}>
                  {this.state.full_name}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingTop: 31,
                  paddingBottom: 43
                }}
              >
                <View style={styles.twoCols}>
                  <Phone />
                  <Text style={styles.lilTitle}>номер</Text>
                  <Text style={styles.infoPart}>{this.state.phone}</Text>
                  <Text style={styles.changeButton}>Изменить</Text>
                </View>
                <View
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <RectangleDivider />
                </View>
                <View style={styles.twoCols}>
                  <Lock />
                  <Text style={styles.lilTitle}>пароль</Text>
                  <Text style={styles.infoPart}>* * * * * * *</Text>
                  <Text style={styles.changeButton}>Изменить</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <HorizontalDivider />
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 9
                }}
              >
                <Text
                  style={{
                    fontFamily: "medium",
                    fontSize: 16,
                    color: "#707070"
                  }}
                >
                  Статистика
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingTop: 21,
                  paddingBottom: 12
                }}
              >
                <View style={styles.twoCols}>
                  <Text style={styles.subTitle}>лучшая доставка</Text>
                  <Text style={styles.subTitleInfo}>0 минут</Text>
                </View>

                <View
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <RectangleDivider />
                </View>

                <View style={styles.twoCols}>
                  <Text style={styles.subTitle}>худшая доставка</Text>
                  <Text style={styles.subTitleInfo}>0 минут</Text>
                </View>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Button
                  type="solid"
                  title="ВЫЙТИ"
                  onPress={this._signOutAsync}
                  loading={this.state.showLoading}
                  loadingProps={{ size: "small", color: "white" }}
                  buttonStyle={styles.buttonMainStyle}
                  titleStyle={{
                    color: "white",
                    fontSize: 20,
                    fontFamily: "medium"
                  }}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../assets/loader.gif")}
            />
          </View>
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  lilTitle: {
    fontFamily: "regular",
    fontSize: 14,
    color: "#acacac",
    paddingVertical: 10
  },
  infoPart: {
    fontFamily: "medium",
    fontSize: 14,
    color: "#333333",
    paddingBottom: 17
  },
  changeButton: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#acacac"
  },
  subTitle: {
    fontFamily: "regular",
    fontSize: 14,
    color: "#acacac"
  },
  subTitleInfo: {
    fontFamily: "medium",
    fontSize: 14,
    color: "#333333"
  },
  twoCols: {
    flex: 0.45,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonMainStyle: {
    height: 45,
    width: 280,
    backgroundColor: "#fb5607",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 28,
    elevation: 0
  }
});
export default Dashboard;

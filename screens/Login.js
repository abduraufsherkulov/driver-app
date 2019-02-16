import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Keyboard,
  Platform,
  Image,
  StatusBar,
  Animated
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Input, Button } from "react-native-elements";
import { Font, Permissions, Notifications } from "expo";
import axios from "axios";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BG_IMAGE = require("../assets/images/logo.png");

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  // POST the token to your backend server from where you can retrieve it to send push notifications.
  // return fetch(PUSH_ENDPOINT, {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     token: {
  //       value: token,
  //     },
  //     user: {
  //       username: 'Brent',
  //     },
  //   }),
  // });
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      username: "",
      password: "",
      username_valid: true,
      login_failed: false,
      showLoading: false,
      platform: Platform.OS,
      app_version: Platform.Version,
      device_info: Expo.Constants.deviceName,
      device_uuid: Expo.Constants.installationId,
      moveAnim: new Animated.Value(200)
    };
  }

  handleSubmit = event => {
    const {
      showLoading,
      platform,
      app_version,
      device_info,
      device_uuid,
      token
    } = this.state;

    this.setState({
      showLoading: !showLoading,
      username_valid: true
    });

    const data = JSON.stringify({
      // username: this.state.username,
      // password: this.state.password,
      username: "driver1",
      password: "3618462",
      info: {
        platform: platform,
        app_version: app_version,
        device_info: device_info,
        device_uuid: device_uuid,
        push_token: token
      }
    });

    const url = "https://api.delivera.uz/drivers/login";

    axios({
      method: "post",
      url: url,
      data: data,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: { "content-type": "application/json" }
    })
      .then(async response => {
        if (response.status === 200) {
          if (response.data.status === "Fail") {
            this.setState({
              username_valid: false,
              showLoading: false
            });
          } else {
            let token = response.data;
            await AsyncStorage.setItem("access_token", token.access_token);
            let driver_info = token.driver_info;
            await AsyncStorage.multiSet([
              ["id", driver_info.id.toString()],
              ["username", driver_info.username],
              ["full_name", driver_info.full_name],
              ["phone", driver_info.phone.toString()]
            ]);
            this.props.navigation.navigate("App");
          }
        } else {
          console.log(response, "unknown error");
        }
      })
      .catch(function(error) {
        console.log(error.response);
      });
    event.preventDefault();
  };
  _createNotificationAsync = () => {
    Expo.Notifications.presentLocalNotificationAsync({
      title: "Reminder",
      body: "This is an important reminder!!!!",
      android: {
        channelId: "new",
        color: "#8ac53f",
        icon: "../assets/notification_icon.png"
      }
    });
  };
  async componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    // this._createNotificationAsync();
    if (Platform.OS === "android") {
      Expo.Notifications.createChannelAndroidAsync("new", {
        name: "Delivera Courier",
        priority: "max",
        vibrate: [0, 250, 250, 250],
        sound: true
      });
    }
    if (Platform.OS === "android") {
      Expo.Notifications.createChannelAndroidAsync("paid", {
        name: "Delivera Courier",
        priority: "max",
        vibrate: [0, 250, 250, 250],
        sound: true
      });
    }
    registerForPushNotificationsAsync();
    let token = await Notifications.getExpoPushTokenAsync();

    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      bold: require("../assets/fonts/GoogleSans-Bold.ttf")
    });
    console.log(token);
    this.setState({ fontLoaded: true, token: token });
  }
  _keyboardDidShow = () => {
    Animated.timing(
      // Animate over time
      this.state.moveAnim, // The animated value to drive
      {
        toValue: 20, // Animate to opacity: 1 (opaque)
        duration: 1 // Make it take a while
      }
    ).start();
    console.log(this.state.moveAnim);
  };

  _keyboardDidHide = () => {
    Animated.timing(
      // Animate over time
      this.state.moveAnim, // The animated value to drive
      {
        toValue: 200, // Animate to opacity: 1 (opaque)
        duration: 1 // Make it take a while
      }
    ).start();
    console.log(this.state.moveAnim);
  };
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  render() {
    const {
      username,
      password,
      username_valid,
      showLoading,
      moveAnim
    } = this.state;
    return (
      <View style={styles.container}>
        {this.state.fontLoaded ? (
          <Animated.View
            style={{
              backgroundColor: "transparent",
              width: 280,
              height: 300,
              position: "absolute",
              bottom: moveAnim
            }}
          >
            <View style={styles.loginInput}>
              <Image source={BG_IMAGE} style={{ marginBottom: 40 }} />
              <Input
                leftIcon={<FontAwesome name="user" color="#5caa57" size={25} />}
                containerStyle={{ marginBottom: 30, width: "100%" }}
                onChangeText={username =>
                  this.setState({ username: username, username_valid: true })
                }
                value={username}
                inputStyle={{
                  color: "#494949",
                  fontFamily: "regular",
                  fontSize: 16
                }}
                inputContainerStyle={{
                  height: 45,
                  borderWidth: 1,
                  borderColor: "#f4f4f4",
                  borderRadius: 28,
                  backgroundColor: "#f4f4f4"
                }}
                keyboardAppearance="light"
                placeholder="Логин"
                autoFocus={false}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                ref={input => (this.usernameInput = input)}
                onSubmitEditing={() => {
                  this.passwordInput.focus();
                }}
                blurOnSubmit={false}
                placeholderTextColor="white"
                errorStyle={{ textAlign: "center", fontSize: 12 }}
                errorMessage={
                  username_valid
                    ? null
                    : "Пожалуйста введите действительное имя пользователя"
                }
                placeholderTextColor="#494949"
              />
              <Input
                leftIcon={<FontAwesome name="lock" color="#5caa57" size={25} />}
                containerStyle={{ marginBottom: 30, width: "100%" }}
                onChangeText={password =>
                  this.setState({ password: password, username_valid: true })
                }
                value={password}
                inputStyle={{
                  color: "#494949",
                  fontFamily: "regular",
                  fontSize: 16
                }}
                inputContainerStyle={{
                  height: 45,
                  borderWidth: 1,
                  borderColor: "#f4f4f4",
                  borderRadius: 28,
                  backgroundColor: "#f4f4f4"
                }}
                onSubmitEditing={Keyboard.dismiss}
                secureTextEntry={true}
                keyboardAppearance="light"
                placeholder="Пароль"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="done"
                ref={input => (this.passwordInput = input)}
                blurOnSubmit={true}
                placeholderTextColor="#494949"
              />

              <Button
                type="solid"
                title="ПОЕХАЛИ"
                // activeOpacity={1}
                // underlayColor="transparent"
                onPress={this.handleSubmit}
                loading={showLoading}
                // containerStyle={{ height: 45, borderRadius: 28 }}
                loadingProps={{ size: "small", color: "white" }}
                disabled={!username_valid && password.length < 8}
                buttonStyle={styles.buttonMainStyle}
                // containerStyle={{ marginVertical: 10 }}
                titleStyle={{
                  color: "white",
                  fontSize: 20,
                  fontFamily: "bold"
                }}
              />
            </View>
          </Animated.View>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: "center",
    backgroundColor: "white"
  },
  loginView: {
    // marginTop: -1,
    backgroundColor: "transparent",
    width: 280,
    height: 300,
    position: "absolute",
    bottom: 200
  },
  loginTitle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loginInput: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonMainStyle: {
    height: 45,
    width: 280,
    backgroundColor: "#5caa57",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 28,
    elevation: 0
  }
});

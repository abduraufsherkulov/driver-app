import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { Font } from "expo";
import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BG_IMAGE = require("../assets/images/wallpaper_3.jpg");

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
      device_uuid: Expo.Constants.installationId
    };
  }

  handleSubmit = event => {
    const {
      showLoading,
      platform,
      app_version,
      device_info,
      device_uuid
    } = this.state;

    this.setState({
      showLoading: !showLoading,
      username_valid: true
    });

    // username: "driver1",
    // password: "3618462",
    const data = JSON.stringify({
      username: this.state.username,
      password: this.state.password,
      info: {
        platform: platform,
        app_version: app_version,
        device_info: device_info,
        device_uuid: device_uuid
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
        console.log(response);
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
          console.log(response);
        }
      })
      .catch(function(error) {
        console.log(error.response);
      });
    event.preventDefault();
  };

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/Montserrat-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    const { username, password, username_valid, showLoading } = this.state;
    return (
      <View style={styles.container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          {this.state.fontLoaded ? (
            <View style={styles.loginView}>
              <View style={styles.loginTitle}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.travelText}>Вход </Text>
                  <Text style={styles.plusText}>в</Text>
                </View>
                <View style={{ marginTop: -10 }}>
                  <Text style={styles.travelText}>Кабинет</Text>
                </View>
              </View>
              <View style={styles.loginInput}>
                <Input
                  leftIcon={
                    <Icon
                      name="user-o"
                      color="rgba(171, 189, 219, 1)"
                      size={25}
                    />
                  }
                  containerStyle={{ marginVertical: 10 }}
                  onChangeText={username =>
                    this.setState({ username: username, username_valid: true })
                  }
                  value={username}
                  inputStyle={{
                    marginLeft: 10,
                    color: "white",
                    fontFamily: "regular"
                  }}
                  keyboardAppearance="light"
                  placeholder="Username"
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
                />
                <Input
                  leftIcon={
                    <Icon
                      name="lock"
                      color="rgba(171, 189, 219, 1)"
                      size={25}
                    />
                  }
                  containerStyle={{ marginVertical: 10 }}
                  onChangeText={password => this.setState({ password })}
                  value={password}
                  inputStyle={{
                    marginLeft: 10,
                    color: "white",
                    fontFamily: "regular"
                  }}
                  secureTextEntry={true}
                  keyboardAppearance="light"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="done"
                  ref={input => (this.passwordInput = input)}
                  blurOnSubmit={true}
                  placeholderTextColor="white"
                />
              </View>
              <Button
                title="Войти в систему"
                activeOpacity={1}
                underlayColor="transparent"
                onPress={this.handleSubmit}
                loading={showLoading}
                loadingProps={{ size: "small", color: "white" }}
                disabled={!username_valid && password.length < 8}
                buttonStyle={styles.buttonMainStyle}
                containerStyle={{ marginVertical: 10 }}
                titleStyle={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 20,
                  fontFamily: "regular"
                }}
              />
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  },
  loginView: {
    marginTop: -150,
    backgroundColor: "transparent",
    width: 250,
    height: 400
  },
  loginTitle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  travelText: {
    color: "white",
    fontSize: 30,
    fontFamily: "regular"
  },
  plusText: {
    color: "white",
    fontSize: 30
  },
  loginInput: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  footerView: {
    marginTop: 20,
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonMainStyle: {
    height: 50,
    width: 250,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 30
  }
});

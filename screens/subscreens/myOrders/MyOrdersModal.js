import React, { Component } from "react";
import {
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { Button, Input } from "react-native-elements";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import Modal from "react-native-modal";
import * as Font from 'expo-font';

class MyOrdersModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      token: "",
      hash: "",
      password: "",
      hash_valid: true,
      fontLoaded: false
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../../assets/fonts/GoogleSans-Medium.ttf"),
      roboto: require("../../../assets/fonts/Roboto-Regular.ttf")
    });
    let token = await AsyncStorage.getItem("access_token");
    this.setState({
      token: token,
      fontLoaded: true
    });
  }
  handleSubmit = event => {
    const valProps = this.props.all;
    this.setState({
      loading: true
    });
    if (valProps.status.code === "in_process") {
      const data = JSON.stringify({
        order_id: this.props.order_id
      });
      const url = "https://api.delivera.uz/drivers/take";

      axios({
        method: "post",
        url: url,
        data: data,
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
          if (response.data.reason === "Accepted") {
            this.props.closed();
            this.props.getFromRest();
            this.setState({
              loading: false
            });
          }
        })
        .catch(error => {
          console.log(error.response);
        });

      event.preventDefault();
    } else {
      const data = JSON.stringify({
        code: this.props.order_id
      });
      console.log(data);
      console.log(this.state.token);
      const url = "https://api.delivera.uz/drivers/confirm-order";

      axios({
        method: "post",
        url: url,
        data: data,
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
          if (response.data.status === "Success") {
            this.props.closed();
            this.setState({
              loading: false
            });
            this.props.nav.navigate("MyMainOrders");
            this.props.getFromRest();
          } else if (response.data.status === "Fail") {
            this.setState({
              hash_valid: false,
              loading: false
            });
          }
        })
        .catch(error => {
          console.log(error.response);
        });

      event.preventDefault();
    }
  };
  render() {
    const { hash, hash_valid } = this.state;
    let code = this.props.all.status.code;
    let confirm_input =
      code === "on_way" ? (
        <Input
          leftIcon={
            <FontAwesome
              name="qrcode"
              color="rgba(171, 189, 219, 1)"
              size={25}
            />
          }
          containerStyle={{ marginVertical: 10 }}
          onChangeText={hash => this.setState({ hash })}
          value={hash}
          inputStyle={{ marginLeft: 10, color: "rgba(47,44,60,1)" }}
          keyboardAppearance="light"
          keyboardType="numeric"
          placeholder="Код"
          autoFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholderTextColor="rgba(126,123,138,1)"
          errorStyle={{ textAlign: "center", fontSize: 12 }}
          errorMessage={
            hash_valid ? null : "Пожалуйста, введите правильный код"
          }
        />
      ) : null;
    let text_ask =
      code === "in_process" ? (
        <Text style={{ fontSize: 20 }}>
          Вы уверены, что вы получили заказ от {this.props.entity_name}?{" "}
        </Text>
      ) : (
        <Text
          style={{
            fontSize: 20,
            fontSize: 16,
            color: "#333333",
            fontFamily: "regular"
          }}
        >
          Подтвердите получение заказа:
        </Text>
      );
    let okay_btn = code === "in_process" ? "Получил" : "Доставил";
    return (
      <Modal
        isVisible={this.props.openUp}
        // onRequestClose={this.props.closed}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: 22,
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)"
          }}
        >
          {this.state.fontLoaded ? (
            <React.Fragment>
              {text_ask}
              {/* {confirm_input} */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                <Button
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  buttonStyle={{
                    height: 45,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    elevation: 0
                  }}
                  title={"НАЗАД"}
                  titleStyle={{
                    fontSize: 14,
                    color: "#ee4646",
                    fontFamily: "roboto"
                  }}
                  onPress={this.props.closed}
                />

                <Button
                  loading={this.state.loading}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  buttonStyle={{
                    height: 45,
                    width: 150,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    elevation: 0
                  }}
                  title={"ПОДТВЕРДИТЬ"}
                  titleStyle={{
                    fontSize: 14,
                    color: "#5caa57",
                    fontFamily: "roboto"
                  }}
                  onPress={this.handleSubmit}
                  loadingProps={{ size: "small", color: "#5caa57" }}
                />
              </View>
            </React.Fragment>
          ) : null}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
  // button: {
  //   backgroundColor: "lightblue",
  //   padding: 12,
  //   margin: 16,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderRadius: 4,
  //   borderColor: "rgba(0, 0, 0, 0.1)"
  // },
  // modalContent: {
  //   backgroundColor: "white",
  //   padding: 22,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderRadius: 4,
  //   borderColor: "rgba(0, 0, 0, 0.1)"
  // },
  // bottomModal: {
  //   justifyContent: "flex-end",
  //   margin: 0
  // }
});

export default MyOrdersModal;

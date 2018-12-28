import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { Button } from "react-native-elements";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

class MyOrdersModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      token: ""
    };
  }
  async componentDidMount() {
    let token = await AsyncStorage.getItem("access_token");
    this.setState({
      token: token
    });
  }
  handleSubmit = event => {
    this.setState({
      loading: true
    });
    const data = JSON.stringify({
      order_id: this.props.order_id
    });
    const url = "https://api.delivera.uz/drivers/accept";

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
      })
      .catch(error => {
        console.log(error.response);
      });

    event.preventDefault();
  };
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.openUp}
        onRequestClose={this.props.closed}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
        >
          <Text style={{ fontSize: 20 }}>
            Вы уверены, что хотите принять заказ от {this.props.entity_name}?{" "}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              marginTop: 20
            }}
          >
            <Button
              title="Отмена"
              onPress={this.props.closed}
              icon={<FontAwesome name="close" size={15} color="white" />}
              iconContainerStyle={{ marginRight: 10 }}
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                backgroundColor: "rgba(199, 43, 98, 1)",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 30
              }}
              containerStyle={{ width: 130 }}
            />
            <Button
              title="Принят"
              onPress={this.handleSubmit}
              loading={this.state.loading}
              loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
              icon={<FontAwesome name="check" size={15} color="white" />}
              iconRight
              iconContainerStyle={{ marginLeft: 10 }}
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                backgroundColor: "rgba(90, 154, 230, 1)",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 30
              }}
              containerStyle={{ width: 150 }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default MyOrdersModal;

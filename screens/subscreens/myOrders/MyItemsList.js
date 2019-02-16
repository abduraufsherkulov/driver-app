import React, { Component } from "react";
import { Text, Button, ListItem } from "react-native-elements";

import {
  Platform,
  StyleSheet,
  Image,
  View,
  Linking,
  Dimensions,
  ScrollView
} from "react-native";

import { Font } from "expo";

// import MainModal from "./subscreens/newOrders/MainModal";

import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;

class MyItemsListTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text>
        {this.state.fontLoaded ? (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 18,
              color: "black"
            }}
          >
            {"Номер заказа: " + this.props.main_id}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class MyItemsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: { coords: { latitude: 0, longitude: 0 } },
      errorMessage: null,
      fontLoaded: false,
      opened: false,
      asyncing: false,
      duration: {
        text: "",
        value: +""
      },
      checked: false,
      items: []
    };
  }

  _isMounted = false;

  _pressCall = () => {
    let allVal = this.props.navigation.getParam("all");
    const url = `tel://${allVal.user.phone}`;
    Linking.openURL(url);
  };

  handleModal = () => {
    this.setState({
      opened: true
    });
  };
  handleClose = () => {
    this.setState({
      opened: false
    });
  };

  async componentDidMount() {
    let allVal = await this.props.navigation.getParam("all");
    //console.log(allVal.items);
    this._isMounted = true;
    let items = allVal.items;

    this.setState({
      items
    });

    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../../assets/fonts/GoogleSans-Medium.ttf")
    });

    this.setState({ fontLoaded: true });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <MyItemsListTitle
        navigation={navigation}
        main_id={navigation.getParam("all").id}
      />
    ),
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

  checkItems(id, i) {
    const changedCheckbox = this.state.items.find(j => j.food_id === id);
    changedCheckbox.checked = !changedCheckbox.checked;
    const checkboxes = Object.assign({}, this.state.items, changedCheckbox);
    this.setState({
      checkboxes
    });
  }

  render() {
    let allVal = this.props.navigation.getParam("all");
    let nav = this.props.navigation.getParam("nav");
    let getFromRest = this.props.navigation.getParam("getFromRest");
    // console.log(this.state.items);
    let listProducts = this.state.fontLoaded
      ? allVal.items.map((l, i) => (
          <View key={l.food_id}>
            <ListItem
              title={
                <Text
                  style={{
                    color: "#333333",
                    flex: 1,
                    fontFamily: "regular",
                    fontSize: 14
                  }}
                >
                  {l.food_title}
                </Text>
              }
              rightTitle={
                <Text
                  style={{
                    color: "#333333",
                    flex: 1,
                    fontFamily: "regular",
                    fontSize: 14
                  }}
                >
                  x {l.food_amount}
                </Text>
              }
              containerStyle={{
                flex: 1,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(112, 112, 112, 0.1)"
              }}
              rightContentContainerStyle={{
                flex: 1
              }}
              contentContainerStyle={{
                flex: 1
              }}
            />
          </View>
        ))
      : null;

    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          {this.state.fontLoaded ? (
            <React.Fragment>
              <View
                style={{
                  width: "100%",
                  marginVertical: 13,
                  textAlign: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "medium",
                    fontSize: 14,
                    color: "#acacac",
                    textAlign: "center"
                  }}
                >
                  Активные заказы
                </Text>
              </View>
              <View style={{ flex: 1, marginTop: 5 }}>
                <View>{listProducts}</View>
              </View>
            </React.Fragment>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../../../assets/loader.gif")}
              />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});

export default MyItemsList;

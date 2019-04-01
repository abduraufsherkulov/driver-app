import React from "react";
import { SafeAreaView } from "react-navigation";
import moment from "moment";
import {
  AsyncStorage,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  Image,
  RefreshControl
} from "react-native";
import axios from "axios";
import HomeLists from "./newOrders/HomeLists";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-elements";
import { Font } from "expo";
import SvgRender from "./SvgRender";
import { NavigationLogo } from "../../assets/images/MainSvg";
import { isLoaded } from "expo-font";
const isAndroid = Platform.OS === "android";

class NewOrdersTitle extends React.Component {
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
class NewOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      openUp: "",
      id: "",
      refreshing: false,
      fontLoaded: false,
      ready: 0
    };
  }

  handlePress = () => {
    this.props.navigation.navigate("InfoScreen", {});
  };

  addUp = () => {
    this.setState({
      ready: this.state.ready + 1
    });
  };

  subtractDown = () => {
    if (this.state.ready === 0) {
      this.setState({
        ready: 0
      });
    } else {
      this.setState({
        ready: this.state.ready - 1
      });
    }
  };
  _renderItem = ({ item }) => (
    <View style={styles.list}>
      <HomeLists
        handlePress={this.handlePress}
        key={item.id}
        nav={this.props.navigation}
        allProps={item}
        ready={this.addUp}
        finished={this.subtractDown}
        acceptNewOrder={this.props.screenProps.acceptNewOrder}
        getFromRest={this.props.screenProps.getFromRest}
      />
      <Text />
    </View>
  );
  _keyExtractor = (item, index) => item.id.toString();
  async componentDidMount() {
    await Font.loadAsync({
      medium: require("../../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({
      fontLoaded: true
    });

    console.log(this.props.screenProps.newOrdersList);
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: <NewOrdersTitle />,
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
          <React.Fragment>
            {this.props.screenProps.newOrdersList.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontFamily: 20, fontFamily: "regular" }}>
                  На данный момент нет заказов.
                </Text>
              </View>
            ) : (
              <SafeAreaView
                forceInset={{
                  horizontal: "always",
                  top: "never",
                  bottom: "never"
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 30,
                    backgroundColor: "#fb5607"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row"
                    }}
                  >
                    <Text>
                      <Ionicons
                        name="ios-information-circle"
                        size={20}
                        color="white"
                      />
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "medium",
                        color: "white"
                      }}
                    >
                      {"    "}
                      {this.state.ready} заказа готово
                    </Text>
                  </View>
                </View>
                <FlatList
                  data={this.props.screenProps.newOrdersList}
                  renderItem={this._renderItem}
                  keyExtractor={this._keyExtractor}
                  initialScrollIndex={0}
                  initialNumToRender={3}
                  ListFooterComponent={<View style={{ height: 30 }} />}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.props.screenProps.refreshState}
                      onRefresh={this.props.screenProps.refreshNewOrders}
                      enabled={true}
                      colors={["#8ac53f"]}
                      progressBackgroundColor="white"
                      size={200}
                      tintColor="yellow"
                      title="loading"
                    />
                  }
                />
              </SafeAreaView>
            )}
          </React.Fragment>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../assets/loader.gif")}
            />
          </View>
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    marginTop: 0,
    borderColor: "#FD6B78",
    backgroundColor: "#fff"
  }
});

export default NewOrders;

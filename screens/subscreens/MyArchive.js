import React from "react";
import { SafeAreaView } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import {
  AsyncStorage,
  Text,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
  RefreshControl
} from "react-native";
import * as Font from 'expo-font';

import { SearchBar } from "react-native-elements";

import axios from "axios";
import ArchiveList from "./myArchive/ArchiveList";

const isAndroid = Platform.OS === "android";

const dummySearchBarProps = {
  showLoading: false,
  onFocus: () => console.log("focus"),
  onBlur: () => console.log("blur"),
  onCancel: () => console.log("cancel"),
  onClearText: () => console.log("cleared")
};

class MyArchive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myorders: [],
      openUp: "",
      id: "",
      archiveLoadList: [],
      refreshing: false,
      fontLoaded: false,
      searchID: "",
      searchedList: []
    };
  }

  _onRefreshArchive = async () => {
    this.setState({ refreshing: true });

    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/drivers/archive";
    axios({
      method: "get",
      url: urlOrders,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        this.setState({
          archiveLoadList: response.data.orders,
          refreshing: false
        });
      })
      .catch(error => {
        console.log(error, "error");
      });
  };

  updateWithInterval = () => {
    setInterval(() => {
      this.loadToArchive();
    }, 20000);
  };
  async componentDidMount() {
    this.loadToArchive();
    this.updateWithInterval();

    await Font.loadAsync({
      regular: require("../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  componentWillUnmount() {
    clearInterval(this.updateWithInterval());
  }
  loadToArchive = async () => {
    this.setState({ refreshing: true });
    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/drivers/archive";
    axios({
      method: "get",
      url: urlOrders,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        this.setState({
          archiveLoadList: response.data.orders,
          refreshing: false
        });
      })
      .catch(error => {
        console.log(error, "error");
      });
  };
  handlePress = () => {
    this.props.navigation.navigate("DummyInfoScreen", {});
  };

  isID = words => {
    return words.id === parseInt(this.state.searchID);
  };
  handleSearch = searchID => {
    this.setState({
      searchID
    });
  };
  render() {
    let newArr = [];
    let newObj = this.state.archiveLoadList.find(this.isID);

    if (newObj !== undefined) {
      newArr.push(newObj);
    }
    let allLists;
    if (newArr.length === 0 && this.state.searchID > 0) {
      allLists = (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontFamily: "regular" }}>Ничего не найдено</Text>
        </View>
      );
    } else if (newArr.length === 0) {
      allLists = this.state.archiveLoadList.map((l, i) => (
        <ArchiveList
          showAllData={this.loadToArchive}
          key={l.id}
          nav={this.props.navigation}
          allProps={l}
        />
      ));
    } else {
      allLists = newArr.map((l, i) => (
        <ArchiveList
          showAllData={this.loadToArchive}
          key={l.id}
          nav={this.props.navigation}
          allProps={l}
        />
      ));
    }
    // let allLists =
    //   newArr.length === 0
    //     ? this.state.archiveLoadList.map((l, i) => (
    //         <ArchiveList
    //           showAllData={this.loadToArchive}
    //           key={l.id}
    //           nav={this.props.navigation}
    //           allProps={l}
    //         />
    //       ))
    //     : newArr.map((l, i) => (
    //         <ArchiveList
    //           showAllData={this.loadToArchive}
    //           key={l.id}
    //           nav={this.props.navigation}
    //           allProps={l}
    //         />
    //       ));
    return (
      <SafeAreaView forceInset={{ horizontal: "always", top: "always" }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefreshArchive}
              enabled={true}
              colors={["#8ac53f"]}
              progressBackgroundColor="white"
              size={200}
              tintColor="yellow"
              title="loading"
            />
          }
        >
          {isAndroid ? (
            <SearchBar
              placeholder="ID"
              platform="android"
              keyboardType="numeric"
              onChangeText={this.handleSearch}
              // onChangeText: searchID => this.setState({searchID})
              {...dummySearchBarProps}
            />
          ) : (
            <SearchBar
              placeholder="iOS searchbar"
              platform="ios"
              {...dummySearchBarProps}
            />
          )}

          {this.state.fontLoaded ? (
            <View style={styles.list}>{allLists}</View>
          ) : (
            <Text>Loading ...</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    marginTop: 0,
    borderColor: "#FD6B78",
    backgroundColor: "#fff"
  }
});

export default MyArchive;

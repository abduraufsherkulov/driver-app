import React, { Component } from "react";

class Fonts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
  }
  render() {
    return <React.Fragment />;
  }
}

export default Fonts;

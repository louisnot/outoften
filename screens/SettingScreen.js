/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const privacyUrl =
  'https://www.privacypolicygenerator.info/download.php?lang=en&token=Ev4bxZrAHQm8YZrhohcRJck4NqKY5h2p';
export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {navigation} = this.props;
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <View style={{paddingBottom: 20}}>
          <TouchableOpacity
            style={style.buttonContainer}
            onPress={() => navigation.navigate('Help')}>
            <Text style={style.buttonText}>HELP ></Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingBottom: 20}}>
          <TouchableOpacity
            style={style.buttonContainer}
            onPress={() => navigation.navigate('EULA')}>
            <Text style={style.buttonText}>LEGAL TERMS ></Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingBottom: 20}}>
          <TouchableOpacity
            style={style.buttonContainer}
            onPress={() => Linking.openURL(privacyUrl)}>
            <Text style={style.buttonText}>PRIVACY POLICY ></Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingBottom: 20}}>
          <TouchableOpacity
            style={style.buttonContainer}
            onPress={() => this.props.screenProps.deleteJWT()}>
            <Text style={style.buttonText}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    borderWidth: 1,
    borderTopColor: 'grey',
    borderRightColor: 'white',
    borderLeftColor: 'white',
    borderBottomColor: 'grey',
    backgroundColor: 'white',
    alignContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    padding: 15,
    width: SCREEN_WIDTH,
  },
});

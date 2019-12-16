/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {Loading} from './Components/common/index'
import deviceStorage from './service/deviceStorage';
import 'react-native-gesture-handler'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import Navigator from './Navigation/Navigation';
import Auth from './Components/Auth';
import HomeScreen from './screens/HomeScreen';


export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      // 1 user is logged in, 0 user is log out, 2 he wqnts to sign up
      isLoading:true,
      jwt: ''
    }
    
    this.deleteJWT = deviceStorage.deleteJWT.bind(this)
    this.loadJWT = deviceStorage.loadJWT.bind(this)
    this.newJWT= this.newJWT.bind(this)
    this.loadJWT()
    
  }

  newJWT(jwt){
    this.setState({
      jwt:jwt
    });
  }
  
  render(){
    if(this.state.isLoading){
      return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Loading size={'large'} />
        </View>
      );
    }
      else if(!this.state.jwt){
      return(
        <Auth newJWT={this.newJWT}
        />
      )
    }
    else if (this.state.jwt){
      return(
        <Navigator
          jwt={this.state.jwt}
          deleteJWT={this.deleteJWT}
        />
      )
    }
    
  }
}

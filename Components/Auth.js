import React from 'react';
import { View } from 'react-native';
import LoginScreen from '../Components/LoginScreen';
import RegisterScreen from '../Components/RegisterScreen';

export default class Auth extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showLogin: false
    };
    this.whichForm=this.whichForm.bind(this)
  }
  authSwitch() {
    this.setState({
      showLogin: !this.state.showLogin
    });
  }
  whichForm() {
    if(this.state.showLogin){
      return(
        <RegisterScreen
        authSwitch={()=> this.setState({showLogin:!this.state.showLogin})}
        />
      );
    } else {
      return(
        <LoginScreen
        newJWT={this.props.newJWT}
        authSwitch={()=> this.setState({showLogin:!this.state.showLogin})}
        />
      );
    }
  }

  render() {
    return(
      <View style={{flex:1}}>
          {this.whichForm()}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  }
};
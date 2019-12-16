import React, { Fragment } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Button, Input } from 'react-native-elements'
import deviceStorage from '../service/deviceStorage'
import axios from 'axios'
export default class LoginScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email : "",
            password : "",
            showLogin : false,
            isLoading: false,
            errorLogin : "",
            test:"",
        };
        this.onLoginFail= this.onLoginFail.bind(this)
        this.loginFromApi = this.loginFromApi.bind(this);

    }

    onLoginFail() {
        this.setState({
            errorLogin: "Login Failed checked email and password",
            isLoading : false
        })
    }
    loginFromApi() {
        axios.post('http://localhost:5050/api/home/login/', {
            email: this.state.email,
            password:this.state.password
        },)
        .then((response)=>{
            deviceStorage.saveItem("id_token", response.data)
            console.log(response.data)
            this.props.newJWT(response.data)
        })
        .catch((error)=>{
            console.log(error);
            this.onLoginFail()
        })

    }
    testFetch =()=>{

    } 
        
    
    render(){
        return(
            <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
                <View style={styles.header}>
                    <Text style={{fontSize:56}}>Welcome to the team grader!</Text>
                </View>
                <Input
                    autoCapitalize={"none"}
                    label="Your email address"
                    placeholder="myemail@gmail.com"
                    onChangeText={(text)=> this.setState({email:text})}
                    value={this.state.email}
                >
                </Input>
                <Input
                    label="Your password"
                    placeholder="*******"
                    secureTextEntry={true}
                    onChangeText={(text)=> this.setState({password:text})}
                    value={this.state.password}
                />
                    <Text style={{color:'red'}}>{this.state.errorLogin}</Text>
                <TouchableOpacity
                style={styles.loginButton}
                onPress={()=>this.loginFromApi()}
                >
                  <Text style={{textAlign:'center', lineHeight:38}}>Login!</Text> 
                </TouchableOpacity>
                <Fragment>
                    <Text style={{fontSize:18, marginBottom:12}}>Don't have an account?</Text> 
                        <TouchableOpacity
                        onPress={this.props.authSwitch}
                        >
                        <Text style={{color : '#1CAFD3'}}>Create one here!</Text>
                        </TouchableOpacity>
                </Fragment>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5
    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'Gill Sans',
      textAlign: 'center',
      margin: 10,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
    loginButton : {
        backgroundColor : '#F06229',
        marginVertical: 20,
        width : 270,
        height : 40,
        borderRadius: 25
    },
    header:{
        fontSize:46
    }
  });
import React, { Fragment } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';
import { Button, Input } from 'react-native-elements'
import deviceStorage from '../service/deviceStorage'
import axios from 'axios'
import LinearGradient from 'react-native-linear-gradient';
import Counter from './Counter';
import { Loading } from './common';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

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
            outoften:0,

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
        this.setState({isLoading:true})
        axios.post('https://outoften.fr/api/home/login/', {
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
    
    render(){
        return(
            <LinearGradient style={styles.linearGradient} colors={['#3a7bd5','#00b4db']}>
            <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <Counter />
                    </View>
                    <Input
                        containerStyle={styles.input}
                        inputStyle={styles.textinput}
                        labelStyle={{color:'white'}}
                        inputContainerStyle={{borderColor:'white'}}
                        autoCapitalize={"none"}
                        label="Your email address"
                        placeholder="myemail@gmail.com"
                        onChangeText={(text)=> this.setState({email:text})}
                        value={this.state.email}
                    >
                    </Input>
                    <Input
                        containerStyle={styles.input}
                        labelStyle={{color:'white'}}
                        inputStyle={styles.textinput}
                        inputContainerStyle={{borderColor:'white'}}
                        label="Your password"
                        placeholder="*******"
                        secureTextEntry={true}
                        onChangeText={(text)=> this.setState({password:text})}
                        value={this.state.password}
                    />
                    <Text style={{color:'red'}}>{this.state.errorLogin}</Text>
                   {!this.state.isLoading ? 
                   <TouchableOpacity
                    style={styles.loginButton}
                    onPress={()=>this.loginFromApi()}>
                    <Text style={{textAlign:'center', lineHeight:38, color:'white',fontWeight:'700',fontSize:16}}>LOG IN</Text> 
                    </TouchableOpacity> : <Loading size={'large'} />}
                    <Fragment>
                        <Text style={{fontSize:18, marginBottom:12}}>Don't have an account?</Text> 
                            <TouchableOpacity
                            onPress={this.props.authSwitch}>
                            <Text style={{color : 'white',fontWeight:'500',textDecorationLine:'underline'}}>Create an account</Text>
                            </TouchableOpacity>
                    </Fragment>
                </SafeAreaView>
            </LinearGradient>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        height:SCREEN_HEIGHT,
        width:SCREEN_WIDTH,
        justifyContent:'center',
        alignItems:'center'
    },
    linearGradient: {
      flex: 1,
      borderRadius: 20
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
        backgroundColor:'transparent',
        borderWidth:2,
        borderColor:'white',
        marginVertical: 20,
        width : 270,
        height : 40,
        borderRadius: 25
    },
    header:{
        fontSize:46,
        position:'absolute',
        top:140
    },
    input:{
        width:SCREEN_WIDTH-60,
        paddingBottom:20
    },
    textinput:{
        color:'white',
        fontWeight:'600'
    }
  });

  /*
<LinearGradient style={styles.linearGradient} colors={['#3a7bd5','#00b4db']}>
</LinearGradient>

  */
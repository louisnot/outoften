import React, { Fragment } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Slider, SafeAreaView} from 'react-native';
import { Input,Button,CheckBox,ButtonGroup } from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import { Loading } from './common';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export default class RegisterScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email:null,
            password:null,
            name:"",
            age:undefined,
            errorRegistering: '',
            idUser : null,
            isLoading : false,
            lenName : 3,
            checked:false,
            EULA : 0,

        }
        this.apiRegister = this.apiRegister.bind(this)
        this.registrationFailed = this.registrationFailed.bind(this);
    }

        checkBoxclick = () => {
            if(this.state.checked == false){
                this.setState({checked:true})
            }
            if(this.state.checked==true){
                this.setState({checked:false})
            }
        }
        nameVerification = () => {
            if(this.state.lenName < 2){
                if(this.state.name==""||this.state.name==null){
                    return(
                        <Text style={{color:'red'}}>We want to know your name!</Text>
                    )
                }
                return(
                    <Text style={{color:'red'}}>Your name must be at least 3 characters long.</Text>
                )
            }
        }
        ageVerification = () => {
            if(this.state.age < 18 || this.state.age > 120 || this.state.age=="") {
                return(
                    <Text style={{color:'red'}}>You must be 18+ to join!</Text>
                )
            }else{
                return(true)
            }
        }
        registrationFailed () {
                if(!this.ageVerification()||this.nameVerification()){
                    return(
                        this.dropDownAlertRef.alertWithType('error','Error','Your name or age includes error please check info are correct.')
                    )
                }
                else{
                    return true;
                }
        }

        apiRegister () {
            this.setState({isLoading:true})
            if(!this.registrationFailed()){
                this.setState({isLoading:false})
                return;
            }
            if(this.state.checked==false){
                this.setState({isLoading:false})
                this.dropDownAlertRef.alertWithType('error','Error','You must accept the Conditions of USE and certify you are 18+.')
                return;
            }
            else
            {
            this.setState({errorRegistering: '', isLoading:true})
            axios.post('https://outoften.fr/api/new/register',{
                    email : this.state.email,
                    password : this.state.password,
                    name : this.state.name,
                    age: this.state.age,
            },)
            .then((response) => {
                this.dropDownAlertRef.alertWithType('success','Success','Account created succesfully!')
                this.setState({isLoading:false})
                var that = this
                setTimeout(function() {that.props.authSwitch()}, 1500)
                
            })
            .catch((error) => {
                this.setState({isLoading:false})
                this.registrationFailed()
                this.dropDownAlertRef.alertWithType('error','Error', 'Error registering, check your internet and email entered please!')
                console.log(error)
            })

        }}
     
    
    render(){
        if(this.state.EULA==0)
        {
            return(
                <LinearGradient style={styles.linearGradient} colors={['#3a7bd5','#00b4db']}>
                <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
                    <Text style={styles.RegisterTitle}>Register</Text>
                        <Input
                            containerStyle={styles.input}
                            labelStyle={{color:'white'}}
                            inputStyle={styles.textinput}
                            inputContainerStyle={{borderColor:'white'}}
                            autoCapitalize={"none"}
                            label="Your email address"
                            placeholder="hello@gmail.com"
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
                            secureTextEntry={true}
                            placeholder="**********"
                            onChangeText={(text)=> this.setState({password:text})}
                            value={this.state.password}
                        >
                        </Input>
                        <Input
                            containerStyle={styles.input}
                            labelStyle={{color:'white'}}
                            inputStyle={styles.textinput}
                            inputContainerStyle={{borderColor:'white'}}
                            label="Your name"
                            placeholder="Louis"
                            onChangeText={(text)=> this.setState({name:text,lenName:this.state.name.length})}
                            value={this.state.name}
                        >
                        </Input>
                        {this.nameVerification()}
                        <Input
                            containerStyle={styles.input}
                            labelStyle={{color:'white'}}
                            inputStyle={styles.textinput}
                            inputContainerStyle={{borderColor:'white'}}
                            label="Your age"
                            placeholder="Must be 18+"
                            onChangeText={(text)=> this.setState({age:text})}
                            value={this.state.age}
                        >
                        </Input>
                        {this.ageVerification()}
                        <TouchableOpacity onPress={() => this.setState({EULA:1})}>
                            <Text style={{color:'white', fontSize:18,paddingBottom:15, textDecorationLine:'underline'}}>Read the user Licence Agreement</Text>
                        </TouchableOpacity>
                        <Text style={{color:'black',fontWeight:'600',textAlign:'center'}}>By clicking register now button, I agree that I am 18 or older and I have read user License Agreement</Text> 
                        <View style={{marginTop:50}}>
                            {!this.state.isLoading ?
                            <TouchableOpacity
                            style={styles.loginButton} 
                            onPress={()=>this.apiRegister()}>
                                <Text style={{textAlign:'center', lineHeight:38, color:'white',fontWeight:'700',fontSize:16}}>Register now </Text>
                            </TouchableOpacity>: <Loading size={'large'}/>}
                            <TouchableOpacity
                                onPress={this.props.authSwitch}>
                            <Text style={{textAlign:'center',color : 'white',fontWeight:'500',textDecorationLine:'underline'}}>I already have an account</Text> 
                            </TouchableOpacity>
                        </View>
                        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
                </SafeAreaView>
                </LinearGradient>
        )}
        else{
            return(
                <SafeAreaView>
                <ScrollView>
                <Text style={{fontSize:30, fontWeight:'bold',textAlign:'center'}}>End-User License Agreement (EULA) of Out of Ten</Text>
                    <Text style={{fontSize:20,fontWeight:'bold',color:'grey',fontStyle:'italic'}}>LAST UPDATE : JANUARY  2020</Text>
                    <Text style={{fontSize:22, fontWeight:'bold',textAlign:'center'}}>PLEASE BE SURE TO READ THOSE TERMS CAREFULLY BEFORE USING OUT OF TEN APPLICATION </Text>
                    <Text style={{textAlign:'center'}}>
                        This End-User License Agreement ("EULA") is a legal agreement between you and Notte App

                        This EULA agreement governs your acquisition and use of our Out of Ten software ("Software") directly from Notte App or indirectly through a Notte App authorized reseller or distributor (a "Reseller").

                        Please read this EULA agreement carefully before completing the installation process and using the Out of Ten software. It provides a license to use the Out of Ten software and contains warranty information and liability disclaimers.

                        If you register for a free trial of the Out of Ten software, this EULA agreement will also govern that trial. By clicking "accept" or installing and/or using the Out of Ten software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.

                        If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.

                        This EULA agreement shall apply only to the Software supplied by Notte App herewith regardless of whether other software is referred to or described herein. The terms also apply to any Notte App updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. If so, those terms apply. This EULA was created by EULA Template for Out of Ten.

                        License Grant
                        Notte App hereby grants you a personal, non-transferable, non-exclusive licence to use the Out of Ten software on your devices in accordance with the terms of this EULA agreement.

                        You are permitted to load the Out of Ten software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the Out of Ten software.

                        You are not permitted to:

                        Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things
                        Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose
                        Allow any third party to use the Software on behalf of or for the benefit of any third party
                        Use the Software in any way which breaches any applicable local, national or international law
                        use the Software for any purpose that Notte App considers is a breach of this EULA agreement
                        Intellectual Property and Ownership
                        Notte App shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of Notte App.

                        Notte App reserves the right to grant licences to use the Software to third parties.

                        Termination
                        This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to Notte App.

                        It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.

                        Governing Law
                        This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of France.
                    </Text>
                    <TouchableOpacity onPress={()=> this.setState({EULA:0})}>
                        <Text style={{ color:'#1CAFD3'}}> I have read the terms, send me back to register page. </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
            )
        }
    }
}


const styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5
    },
    RegisterTitle:{
        fontSize:28,
        marginBottom:50

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
    errorTextStyle: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'red'
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


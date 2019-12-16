import React, { Fragment } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Slider} from 'react-native';
import { Input,Button,CheckBox,ButtonGroup } from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import { Loading } from './common';


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
            sexe:null,
            sexeSelected : 2,
            errorRegistering: '',
            idUser : null,
            isLoading : false,
            lenName : 3,
            checked:false,
        }
        this.apiRegister = this.apiRegister.bind(this)
        this.registrationFailed = this.registrationFailed.bind(this);
        this.chooseSex = this.chooseSex.bind(this)
    }

        test = (selectedIndex) => {
            if(selectedIndex==1){
                this.setState({sexe:"Man"})
            }if(selectedIndex==0){
                this.setState({sexe:"Woman"})
            }
        }
        chooseSex(selectedIndex) {
                this.setState({sexeSelected:selectedIndex})
                this.test(selectedIndex)
        }

        sexeVerification = () => {
            if(this.state.sexe=="Man" || this.state.sexe=="Woman"){
                return(true);
            }else{
                return false;
            }
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
            if(this.state.lenName < 3){
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
                if(!this.ageVerification()||this.nameVerification()||!this.sexeVerification()){
                    return(
                        this.dropDownAlertRef.alertWithType('error','Error','Your name, age or sexe includes error please check info are correct.')
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
            axios.post('http://localhost:5050/api/new/register',{
                    email : this.state.email,
                    password : this.state.password,
                    name : this.state.name,
                    age: this.state.age,
                    sexe: this.state.sexe
            },)
            .then((response) => {
                this.dropDownAlertRef.alertWithType('success','Success','Account created succesfully!')
                this.setState({isLoading:false})
                this.props.goBack()
            })
            .catch((error) => {
                this.setState({isLoading:false})
                this.registrationFailed()
                this.dropDownAlertRef.alertWithType('error','Error', 'Error registering, check your internet and email entered please!')
                console.log(error)
            })

        }}
     
    
    render(){
        return(
            <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
                <Text style={styles.RegisterTitle}>Register</Text>
                    <Input
                        autoCapitalize={"none"}
                        label="Your email address"
                        placeholder="Tind@gmail.com"
                        onChangeText={(text)=> this.setState({email:text})}
                        value={this.state.email}
                    >
                    </Input>
                    <Input
                        label="Your password"
                        secureTextEntry={true}
                        placeholder="**********"
                        onChangeText={(text)=> this.setState({password:text})}
                        value={this.state.password}
                    >
                    </Input>
                    <Input
                        label="Your name"
                        placeholder="Louis"
                        onChangeText={(text)=> this.setState({name:text,lenName:this.state.name.length})}
                        value={this.state.name}
                    >
                    </Input>
                    {this.nameVerification()}
                    <Input
                        label="Your age"
                        placeholder="Must be 18+"
                        onChangeText={(text)=> this.setState({age:text})}
                        value={this.state.age}
                    >
                    </Input>
                    {this.ageVerification()}
                    <ButtonGroup
                    buttons={['Woman','Man']}
                    selectedIndex={this.state.sexeSelected}
                    onPress={this.chooseSex}
                    />
                    <CheckBox 
                        title='By checking this box I agree that I am 18 or older and I have read condition of use'
                        containerStyle={{backgroundColor:'white', borderColor:'white'}}
                        checkedColor='#1CAFD3'
                        onPress={()=>this.checkBoxclick()}
                        checked={this.state.checked}
                    />
                    <View style={{marginTop:50}}>
                        {!this.state.isLoading ?
                        <TouchableOpacity
                        style={styles.loginButton} 
                        onPress={()=>this.apiRegister()}>
                            <Text style={{textAlign:'center', lineHeight:38}}>Register now! </Text>
                        </TouchableOpacity>: <Loading size={'large'}/>}
                        
                        <TouchableOpacity
                            onPress={this.props.authSwitch}>
                        <Text style={{fontSize:18,textAlign:'center', lineHeight:38,color : '#1CAFD3'}}>I already have an account</Text> 
                        </TouchableOpacity>
                    </View>
                    <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
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
        backgroundColor : '#F06229',
        marginVertical: 20,
        width : 270,
        height : 40,
        borderRadius: 25
    },
    errorTextStyle: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'red'
      }
  });
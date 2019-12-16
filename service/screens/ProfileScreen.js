import React from 'react';
import { View , Text , StyleSheet, FlatList, Image,Dimensions, Platform, Alert} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const createFormData = (photo, body) =>{
    const data = new FormData();
    data.append('photo', {
        name:'avatar.png',
        type:'image/png',
        uri:
      Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });
    Object.keys(body).forEach(key => {
        data.append(key, body[key]);
    });
    return data;      
};

export default class ProfileScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            dataName : "test",
            dataAge: 18,
            dataPhoto : null,
            dataScore : undefined,
            userId : null,
            test : 0,
            currentToken : null,
            editProfile:0,
            photo : null
        }
    }

    renderImage = () => {
        if (this.state.dataPhoto == null) {
            return(
                <React.Fragment>
                        <Image 
                            source={{uri:"http://localhost:5050/uploads/avatardefault.png"}}
                            style={{ width: SCREEN_WIDTH - 20, height: SCREEN_HEIGHT-300, borderRadius: 20, }}
                        />
                </React.Fragment> 
            )
        }
        else {
            return(
                <React.Fragment>
                        <Image 
                            source={{uri:"http://localhost:5050/"+this.state.dataPhoto}}
                            style={{ width: SCREEN_WIDTH - 20, height: SCREEN_HEIGHT-300, borderRadius: 20, }}
                        />
                </React.Fragment> 
            )
        }
    }
    handleChoosePhoto= () => {
        const options = {
            title :'select image',
            noData : true
        }
        
        ImagePicker.showImagePicker(options,response => {
            if (response.didCancel) {
                alert('hmm you changed your mind didnt you');
              }
            if(response.uri){
                this.setState({photo:response})
                console.log(this.state.photo.uri)
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert("An error occured try again later")
            } 
        })
    }

    handleUploadPhoto = () => {
        fetch("http://localhost:5050/api/new/uploads/"+this.state.userId,{
            method:"POST",
            body : createFormData(this.state.photo,{userid : "123"})
        })
        .then(response => response.json())
        .then(response=>{
            console.log("upload success", response);
            this.setState({photo:null})
            alert("Photo successfully changed!")
            this.setState({dataPhoto:this.state.photo.uri})
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.setState({currentToken:this.props.screenProps.jwt})
        const header = {
          'authorization':'Bearer '+this.props.screenProps.jwt
        }
        console.log(header)
        axios.get('http://localhost:5050/api/posts',{
          headers : header
        })
        .then((response) =>{
          console.log(response)
          this.setState({userId: response.data._id})
          this.updateInfo()
        })
        .catch((error)=>{
          console.log(error)
        })
    }
    updateInfo=() => {
        const newHeader = {
            'authorization' : 'Bearer '+this.state.currentToken
        }
        axios.get('http://localhost:5050/api/new/'+this.state.userId, {
            headers : newHeader
        })
        .then((res)=>{
            this.setState({
                dataName: res.data.name,
                dataAge: res.data.age,
                dataScore : res.data.Score,
                dataPhoto:res.data.userImage
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    render(){
        if(this.state.editProfile==0)
        {
            return(
            <View style={{flex:1}}>
                <View style={{height:60, fontSize:32,justifyContent:'center', alignItems:'center',top:15}}>
                    <Text style={{fontSize : 18}}>Looking great {this.state.dataName}</Text>
                </View>
                <View style={{height: SCREEN_HEIGHT - 220, width: SCREEN_WIDTH, padding: 10, justifyContent:'center',alignItems:'center'}}>
                    {this.renderImage()}
                </View>
                <View style={{flex:1}}>
                    <Text style={styles.description}> {this.state.dataName}, {this.state.dataAge}, your current score {this.state.dataScore}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-evenly',marginBottom:10}}>
                    <TouchableOpacity style={styles.editSettings}onPress={() => this.setState({editProfile:1})}>
                        <Text style={{textAlign:'center',lineHeight:35}}>Edit photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editSettings}>
                        <Text style={{textAlign:'center',lineHeight:35}}>Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }else{
        const { photo } = this.state
        return(
            <View style={{flex:1,alignContent:'center',justifyContent:'center'}}>
                {photo && (
                    <React.Fragment>
                        <Image
                        source={{ uri: photo.uri }}
                        style={{ width: 300, height: 300 }}
                        />
                        <Button title="Upload" onPress={this.handleUploadPhoto} />
                    </React.Fragment>
                )}
                <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
                <TouchableOpacity onPress={()=>this.setState({editProfile:0})}>
                    <Text>Done</Text>
                </TouchableOpacity>
            </View>
        )
    }
    }
}


const styles= StyleSheet.create({
    description:{
        fontSize: 12,
        color:'grey'
    },
    editSettings:{
        backgroundColor:'#1CAFD3',
        width: SCREEN_WIDTH/4,
        height:40,
        borderRadius:20
    }

})


/*

<React.Fragment>
                        <Image
                            source={this.state.dataPhoto}
                            style={{ width: SCREEN_WIDTH - 20, height: SCREEN_HEIGHT-300, borderRadius: 20, }}
                        />
                            <Button title='Upload image' onPress={this.handleUploadPhoto}/>
                        </React.Fragment> 

    // REVOIR L'HANDLE
    handleChoosePhoto = () =>{
        const options = {
            title : 'Select profile pic',
            noData : true,
        };
        ImagePicker.showImagePicker(options,response => {
            if (response.didCancel) {
                alert('User cancelled image picker');
              }
            if(response.uri){
                    this.setState({dataPhoto: response});
                    this.setState({test : 1})
                
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } 
            
        })
    }


                        */
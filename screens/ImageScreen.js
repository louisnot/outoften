import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Linking,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-navigation';
import { FlatList } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export default class ImageScreen extends React.Component{
    constructor(props){
        super()
        this.state={
            dataSource : []
        }
        this.getUserImage()
    }

    getUserImage = () => {
        axios({
            method:'GET',
            url:'https://outoften.fr/api/new/users/'
          })
          .then((res) => {
            for(let k = 0;k<res.data.length;k++){
                if (res.data[k].userImage=="uploads/avatardefault.png"){
                }
                else{
                    this.state.dataSource.push({
                        userImage : res.data[k].userImage,
                        id : res.data[k]._id
                    })
                }
            }
            console.log(this.state.dataSource,this.state.dataSource.length)
            this.setState(this.state)
          })
          .catch((err)=>{
            console.log(err);
          })
    }

    render(){
        if(this.state.dataSource.length==0){
            return(
                <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>Nothing to be shown here, come back later!</Text>
                    <Text>{this.state.dataSource.length}</Text>
                </SafeAreaView>
            )
        }
        else{
        return(
            <SafeAreaView style={{flex:1, justifyContent:'space-around',alignItems:'center'}}>
                <View>
                    <Text>All users Image </Text>
                </View>
                <FlatList 
                    data={this.state.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={({item})=><Image source={{uri:"https://outoften.fr/"+item.userImage}} style={{height:140,width:140}}/>}
                />
            </SafeAreaView>  
        )
        }
    }
}
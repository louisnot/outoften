import React from 'react';
import {View, Text, View, StyleSheet} from 'react-native';


export default class SettingScreen extends React.Component{
    constructor(props){
        super(props)

    }
    render(){
        return(
            <View style={style.container}>
                <Text>SettingScrren of the app</Text>
            </View>
        )
    }
}


const style = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent:'center'
    }
})
import React from 'react';
import {View, Text, StyleSheet, SafeAreaView,ScrollView} from 'react-native';

export default class Privacy extends React.Component{
    constructor(props){
        super(props)

    }
    render(){
        return(
            <SafeAreaView>
                <Text>Help</Text>
            </SafeAreaView>
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
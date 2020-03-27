import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Animated
} from 'react-native';



export default class Counter extends React.Component{
    constructor(props){
      super()
      this.state={
        counter : 0,
        end : "?",
        bounceValue: new Animated.Value(0)
      }
      
    }
   
    animationDelay = (increment) =>{
        if(increment>10){
            this.setState({counter:"?"})
            setTimeout(()=>this.animationDelay(0),1000)
        }else
            {
            this.setState({counter:increment})
            setTimeout(()=>this.animationDelay(increment+1),300) 
        }
    }

    componentDidMount(){
        this.animationDelay(0)
    }
    
    render(){
        return(
          <View>
            <Text style={[{fontSize:56,color:'white'}]}>{this.state.counter}/10</Text>
          </View>
        )
    }
  }
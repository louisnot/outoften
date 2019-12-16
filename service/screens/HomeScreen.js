import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    Animated,
    PanResponder,
    Button,
    StatusBar
  } from 'react-native';
  import Navigator from '../Navigation/Navigation';
  import {randomInt, pow,floor } from 'mathjs';
import axios from 'axios'


/*-----------------------------------------*/
  const userAPI = 'http://localhost:5050/api/new/'
  const Users = [
    {id : "1", uri: require("../assets/id.jpg"), score: 1000 },
    {id : "2" , uri: require("../assets/id2.jpg"), score: 1200 },
    {id : "3", uri: require("../assets/id3.jpg"), score: 1500},
    {id : "4", uri: require("../assets/id.jpg"), score: 1500},
    {id : "5", uri: require("../assets/id2.jpg"), score: 1500},
    {id : "6", uri: require("../assets/id3.jpg"), score: 1500},
    {id : "7", uri: require("../assets/id.jpg"), score: 1500},
    {id : "8", uri: require("../assets/id.jpg"), score: 1500},
    {id : "9", uri: require("../assets/id.jpg"), score: 1500},
    {id : "10", uri: require("../assets/id.jpg"), score: 1500},
    {id : "11", uri: require("../assets/id.jpg"), score: 1500},
    {id : "12", uri: require("../assets/id.jpg"), score: 1500},
    {id : "13", uri: require("../assets/id.jpg"), score: 1500},
    {id : "15", uri: require("../assets/id.jpg"), score: 1500},
    {id : "16", uri: require("../assets/id.jpg"), score: 1500},
    {id : "17", uri: require("../assets/id.jpg"), score: 1500},
    {id : "18", uri: require("../assets/id.jpg"), score: 1500},
    {id : "19", uri: require("../assets/id.jpg"), score: 1500},
  ];
  
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const SCREEN_HEIGHT = Dimensions.get('window').height;


  
  //randomInt(500,1500);

export default class HomeScreen extends React.Component{
    constructor(props){
        super(props)
        this.position = new Animated.ValueXY()
        this.state={
          currentIndex : 0,
          idUser : null,
          nameUser : null,
          scoreA : Users[0].score,
          scoreB : Users[1].score,
          currentToken : null,
        }
        //this.getUserInfo=this.getUserInfo.bind(this);

        this.rotate = this.position.x.interpolate({
          inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
          outputRange:['-10deg','0deg','10deg'],
          extrapolate : 'clamp'
        })

        this.rotateAndTranslate={
          transform:[{
            rotate: this.rotate
          },
        ...this.position.getTranslateTransform()
        ]
        },
        this.likeOpacity = this.position.x.interpolate({
          inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
          outputRange:[0,0,1],
          extrapolate : 'clamp'
        })
        this.dislikeOpacity = this.position.x.interpolate({
          inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
          outputRange:[1,0,0],
          extrapolate : 'clamp'
        })

        this.nextCardOpacity = this.position.x.interpolate({
          inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
          outputRange:[1,0,1],
          extrapolate : 'clamp'
        })
        this.nextCardScale= this.position.x.interpolate({
          inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
          outputRange:[1,0.8,1],
          extrapolate : 'clamp'
        })
        
      }

      test = () => 
      {
        const newHeader = {
        'authorization':'Bearer '+this.state.currentToken
      }
        axios.get('http://localhost:5050/api/new/'+this.state.idUser,{
        headers: newHeader
      })
      .then((res)=>{
        console.log(res)
        this.setState({nameUser:res.data.name})
      })
      }
        componentDidMount(){
        const header = {
          'authorization':'Bearer '+this.props.screenProps.jwt
        }
        console.log(header)
        axios.get('http://localhost:5050/api/posts',{
          headers : header
        })
        .then((response) =>{
          console.log(response)
          this.setState({idUser: response.data._id})
          console.log(this.state.idUser)
          this.test()
        })
        .catch((error)=>{
          console.log(error)
        })
      }
      componentWillMount() {
        this.setState({currentToken:this.props.screenProps.jwt})
        this.PanResponder = PanResponder.create({
    
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onPanResponderMove: (evt, gestureState) => {
    
            this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
          },
          onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx > 120) {
              this._upScore()
              Animated.spring(this.position, {
                toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
              }).start(() => {
                this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                  this.position.setValue({ x: 0, y: 0 })
                })
              })
            }
            else if (gestureState.dx < -120) {
              this._downScore()
              Animated.spring(this.position, {
                toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
              }).start(() => {
                this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                  this.position.setValue({ x: 0, y: 0 })
                })
              })
            }
            else {
              Animated.spring(this.position, {
                toValue: { x: 0, y: 0 },
                friction: 4
              }).start()
            }
    
          }
        })
      }

        
     

      renderUsers = () => {

        return Users.map((item, i) => {
          if(i< this.state.currentIndex){
            return null
          }
          else if (i == this.state.currentIndex){
            return (
              <Animated.View
                {...this.PanResponder.panHandlers}
                key={item.id} style={[this.rotateAndTranslate , { height: SCREEN_HEIGHT - 220, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
                  <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>++</Text>
                  </Animated.View> 
                  <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>--</Text>
                  </Animated.View>

                <Image
                  style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                  source={item.uri} />
              </Animated.View>
            )
          }
          else {
            return (
              <Animated.View
                key={item.id} style={[{
                  opacity: this.nextCardOpacity,
                  transform: [{scale: this.nextCardScale}], 
                  height: SCREEN_HEIGHT - 220, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
                <Image
                  style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                  source={item.uri} />
      
              </Animated.View>
            )
          }
        }).reverse()
      }
      



      _upScore(){
        let rankA= this.state.scoreA;
        let rankB = this.state.scoreB;
        var D = rankA-rankB;
        var pD = 1/(1+pow(10,-D/400));
        if(pD>0.95){
          alert(">0.95")
          facteurPonderation=7000;
          rankA=rankA+facteurPonderation*(1-pD);
        }
        if(pD>0.7 && pD<0.95){
          alert(0.7)
          facteurPonderation = 5;
          rankA=rankA+facteurPonderation*(1-pD);
        }

        if(pD>0.5 && pD<0.7){
          alert(0.5)
          facteurPonderation=8
          rankA=rankA+facteurPonderation*(1-pD);
        }
        if(pD>0.3 && pD<0.5){
          alert("petit 0.3")
          facteurPonderation = 11;
          rankA=rankA+facteurPonderation*(1-pD);
        }
        if(pD>0.2 && pD<0.3){
          alert("<0.03")
          facteurPonderation=14.65;
          rankA=rankA+facteurPonderation*(1-pD)
        }
        if(pD>0.05 && pD<0.2){
          alert("<0.02")
          facteurPonderation=18
          rankA=rankA+facteurPonderation*(1-pD)
        }
        if(pD>0.001 && pD<0.05){
          alert("tres petit 0.001")
          facteurPonderation=35;
          rankA=rankA+facteurPonderation*(1-pD);
        }
        if(pD<0.001){
          alert("<0.001")
          facteurPonderation=100
          rankA=rankA+facteurPonderation*(1-pD);
        }
        /*
        else{
          alert("else")
          rankA=rankA+facteurPonderation*(1-pD);
        }*/
        Users[0].score = rankA;
        this.setState({scoreA : floor(rankA)})
      }

      _downScore(){
        let rankA= this.state.scoreA;
        let rankB = this.state.scoreB;
        let facteurPonderation = 20;
        var D = rankA-rankB;
        var pD = 1/(1+pow(10,-D/400));
        if(pD>0.95){
          alert("test")
          facteurPonderation=50;
          rankA=rankA+facteurPonderation*(0-pD);
        }
        if(pD>0.7){
          facteurPonderation = 12;
          rankA=rankA+facteurPonderation*(0-pD);
        }
        if(pD<0.3){
          facteurPonderation = 32;
          rankA=rankA+facteurPonderation*(0-pD);
        }
        else{
          rankA=rankA+facteurPonderation*(0-pD);
        }
        Users[0].score = rankA;
        this.setState({scoreA : floor(rankA)})
      }
      

        
        render() {
          return (
            <View style={{ flex: 1 }}>
              <StatusBar 
                backgroundColor="blue"
                barStyle='default'
              />
                <View style={{ height: 60,alignItems:'center',justifyContent:'center',top:15,color:'orange' }}>
                    <Text> Hey, how you doing {this.state.nameUser}? </Text>
                </View>
                <View style={{ flex: 1 }}>
                  {this.renderUsers()}
                </View>
              <View style={{ height: 90 }}>
                <Button
                  title="Log out"
                  onPress={()=>this.props.screenProps.deleteJWT()}
                />
                <Text>Votre score :{this.state.scoreA} </Text>
          <Text>{this.state.scoreB} {this.state.idUser}</Text>
              </View>
            </View>
          );
        }
      }
      
      
      const styles = StyleSheet.create({
        card: {
          overflow:'hidden',
          backgroundColor: "white",
          borderWidth: 1,
          flex:1,
          margin: 10,
          borderColor: 'lightgrey',
          borderRadius: 10,
      
        },
      })

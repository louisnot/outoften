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
  const userAPI = 'http://localhost:5050/api/new/users'
  const realUsers = []
  

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
          scoreUser : null,
          currentAdverseId :"",
          currentToken : null,
          readyRender : 0
        }
        //this.getUserInfo=this.getUserInfo.bind(this);
        this.infoUserAdverse = {
          name :"",
          age : "",
          Score:"",
          idAdverse :""
        }
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

      fetchUsers = () => {
        axios.get(userAPI)
        .then((res)=>{
          for(var k = 0; k <(res.data.length); k++){
            if(this.state.idUser==res.data[k]._id){
                console.log("forget same user")
            }else
            {
              realUsers.push(res.data[k])
            }
          }
          console.log(realUsers)
        })
      }

      apiFetchId = () => 
      {
        const newHeader = {
        'authorization':'Bearer '+this.state.currentToken
      }
        axios.get('http://localhost:5050/api/new/'+this.state.idUser,{
        headers: newHeader
      })
      .then((res)=>{
        console.log(res)
        this.setState({
          nameUser:res.data.name,
          scoreUser:res.data.Score
        })
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
          this.apiFetchId()
          this.renderUsers()
        })
        .catch((error)=>{
          console.log(error)
        })
      }
      componentWillMount() {
        this.fetchUsers()
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
        return realUsers.map((item, i) => {
          if(i< this.state.currentIndex){
            return null
          }
          else if (i == this.state.currentIndex){
            this.infoUserAdverse=realUsers[i]
            return (
              <Animated.View
                {...this.PanResponder.panHandlers}
                key={item._id} style={[this.rotateAndTranslate , { height: SCREEN_HEIGHT - 220, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
                  <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>++</Text>
                  </Animated.View> 
                  <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>--</Text>
                  </Animated.View>

                <Image
                  style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                  source={{uri:"http://localhost:5050/"+item.userImage}} />
              </Animated.View>
              
            )
          }
          else {
            return (
              <Animated.View
                key={item._id} style={[{
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
        let juge= this.state.scoreUser;
        let jugé = this.infoUserAdverse.Score;
        let facteurPonderation=20
        var D = juge-jugé;
        var pD = 1/(1+pow(10,-D/400));
        console.log(juge,jugé)
        console.log(D,pD)
        if(pD>0.95){
          alert(">0.95")
          facteurPonderation=7000;
          jugé=jugé+facteurPonderation*(1-pD);
        }
        if(pD>0.7 && pD<0.95){
          alert(0.7)
          facteurPonderation = 5;
          jugé=jugé+facteurPonderation*(1-pD);
        }

        if(pD=>0.5 && pD<0.7){
          alert(0.5)
          facteurPonderation=8
          jugé=jugé+facteurPonderation*(1-pD);
        }
        if(pD>0.3 && pD<0.5){
          alert("petit 0.3")
          facteurPonderation = 11;
          jugé=jugé+facteurPonderation*(1-pD);
        }
        if(pD>0.2 && pD<0.3){
          alert("<0.03")
          facteurPonderation=14.65;
          jugé=jugé+facteurPonderation*(1-pD)
        }
        if(pD>0.05 && pD<0.2){
          alert("<0.02")
          facteurPonderation=18
          jugé=jugé+facteurPonderation*(1-pD)
        }
        if(pD>0.001 && pD<0.05){
          alert("tres petit 0.001")
          facteurPonderation=35;
          jugé=jugé+facteurPonderation*(1-pD);
        }
        if(pD<0.001){
          alert("<0.001")
          facteurPonderation=100
          jugé=jugé+facteurPonderation*(1-pD);
        }
        console.log(jugé)
        jugé=floor(jugé)
        console.log("arpès l'arrondi",jugé)
        console.log("id adverse",this.infoUserAdverse._id)
        axios({ 
          method: 'POST',
          url: 'http://localhost:5050/api/home/vote',
          headers: {authorization: 'Bearer '+this.state.currentToken},
          data: { 
            userId: this.infoUserAdverse._id,
            Score : jugé
          } 
        })
        .then((res)=>{
          console.log(res)
        })
        .catch((err)=>{
          console.log(err)
        })
        /*
        else{
          alert("else")
          juge=juge+facteurPonderation*(1-pD);
        }*/
      }

      _downScore(){
        let juge= this.state.scoreUser;
        let jugé = this.infoUserAdverse.Score;
        let facteurPonderation = 20;
        var D = juge-jugé;
        var pD = 1/(1+pow(10,-D/400));
        if(pD>0.95){
          alert("test")
          facteurPonderation=50;
          jugé=jugé+facteurPonderation*(0-pD);
        }
        if(pD>0.7){
          facteurPonderation = 12;
          jugé=jugé+facteurPonderation*(0-pD);
        }
        if(pD<0.3){
          facteurPonderation = 32;
          jugé=jugé+facteurPonderation*(0-pD);
        }
        else{
          jugé=jugé+facteurPonderation*(0-pD);
        }
        console.log(jugé)
        jugé=floor(jugé)
        console.log("arpès l'arrondi",jugé)
        console.log("id adverse",this.infoUserAdverse._id)
        axios({ 
          method: 'POST',
          url: 'http://localhost:5050/api/home/vote',
          headers: {authorization: 'Bearer '+this.state.currentToken},
          data: { 
            userId: this.infoUserAdverse._id,
            Score : jugé
          } 
        })
        .then((res)=>{
          console.log(res)
        })
        .catch((err)=>{
          console.log(err)
        })
        //Users[0].score = juge;
        //this.setState({scoreA : floor(juge)})
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
                <Text>{this.infoUserAdverse.name} </Text>
                  <Text>{this.infoUserAdverse.age} {this.infoUserAdverse.Score}</Text>
                <Text></Text>
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




      /*
renderUsers = () => {
        console.log('test')
        return realUsers.map((item, i) => {
          console.log("i",i,"current Index",this.state.currentIndex)
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


      */
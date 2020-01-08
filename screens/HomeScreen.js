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
  const userAPI = 'http://137.74.196.13:5050/api/new/users'
  const urlHistory = 'http://137.74.196.13:5050/api/vote/historyvote/'
  const urlArrayHistory = 'http://137.74.196.13:5050/api/vote/array/'
  const realUsers = []
  

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

  
//randomInt(500,1500);

export default class HomeScreen extends React.Component{
    constructor(props){
        super(props)
        this.retrieveId()
        this.position = new Animated.ValueXY()
        this.state={
          currentIndex : 0,
          idUser : 0,
          nameUser : null,
          scoreUser : null,
          currentAdverseId :"",
          currentToken : this.props.screenProps.jwt,
          readyRender : 0,
          voteHistory : [],
          ready : false,
          yPos : 0
        }
        this.PanResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onPanResponderMove: (evt, gestureState) => {
    
            this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
          },
          onPanResponderRelease: (evt, gestureState) => {
            this.setState({yPos:gestureState.dy})
            if(gestureState.dy<-280){
              Animated.spring(this.position, {
                toValue:{x:gestureState.dx, y:gestureState.dy-200}
              }).start(()=>{
                this.setState({currentIndex:this.state.currentIndex+1}, () => {
                  this.position.setValue({x:0,y:0})
                })
              })
            }
            if (gestureState.dx > 140) {
              this._upScore()
              Animated.spring(this.position, {
                toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
              }).start(() => {
                this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                  this.position.setValue({ x: 0, y: 0 })
                })
              })
            }
            else if (gestureState.dx < -140) {
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
        /*
        this.reportOpacity = this.position.y.interpolate({
          inputRange: [SCREEN_HEIGHT/2,0,SCREEN_HEIGHT/2],
          outputRange:[448,0,448],
          extrapolate:'clamp'
        })*/

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
    
    retrieveId = () =>{ 
      //Get back the Id of current logged in user from the token
      const header = {
        'authorization':'Bearer '+this.props.screenProps.jwt
      }
      console.log(header)
      axios.get('http://137.74.196.13:5050/api/posts',{
        headers : header
      })
      .then((response) =>{
        console.log(response)
        this.setState({idUser: response.data._id})
        console.log("retrieve ID constructor", this.state.idUser)
    })
    .catch((error)=>{
      console.log(error)
    })
  }

   

      historyUsers = () =>{
        axios({
          method:'GET',
          url : urlArrayHistory+this.state.idUser
        })
        .then((response)=>{
          const realUsersId = []
          for(let p = 0;p<realUsers.length;p++){
            realUsersId.push(realUsers[p]._id)
          }
          console.log("response de historyVote",response.data[0].historyVote,"compare with realUsers",realUsersId)
          //response.data[0].historyVote[k]
          for(let k = 0;k<=realUsersId.length;k++){
            if(response.data[0].historyVote.includes(realUsersId[k])){
              console.log("it's in")
              console.log("ici le slice",realUsers.splice(0,1))
            }
            else{
              console.log("ain't in")
            }
          }
        })
      }
      
      fetchUsers = () => {
        axios.get(userAPI) //Array from all users in DB
        .then((res)=>{
          for(var k = 0; k <(res.data.length); k++){
            if(this.state.idUser==res.data[k]._id){
            }
            else
            {
              realUsers.push(res.data[k])
            }
          }
          console.log("real users",realUsers)
          var that = this;
          setTimeout(function() {that.historyUsers()},200)
        })
      }

      apiFetchData = () => 
      {
        const newHeader = {
        'authorization':'Bearer '+this.state.currentToken
      }
        axios.get('http://137.74.196.13:5050/api/new/'+this.state.idUser,{
        headers: newHeader
      })
      .then((res)=>{
        console.log("fetch info constructor",res)
        this.setState({
          nameUser:res.data.name,
          scoreUser:res.data.Score,
          voteHistory:res.data.historyVote
        })
      })
      }

      renderUsers = () => {
        if(realUsers.length==0){
          return(
            <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
              <Text>No new users to vote for </Text>
            </View>
          )
        }
        else{
        return realUsers.map((item, i) => {
          if(i< this.state.currentIndex){
            return null
          }
          else if (i == this.state.currentIndex){
            console.log("render users cas 2")
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
                  source={{uri:"http://137.74.196.13:5050/"+item.userImage}} />
              </Animated.View>
              
            )
          }
          else {
            console.log("render users cas 3")
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
      }
      
      componentDidMount(){
        var that = this;
        this.fetchUsers()
        setTimeout(function() {that.apiFetchData()},1000)
      }
      
      
      addHisotryUser =  () => {
        let urlHistory2 = urlHistory+this.state.idUser
        console.log(urlHistory2)
        axios({ 
          method: 'PATCH',
          url: urlHistory2,
          //headers: {authorization: 'Bearer '+this.state.currentToken},
          data: { 
            userId: this.infoUserAdverse._id,
          } 
        })
        .then((res)=>{
          console.log(res)
        })
        .catch((err)=>{
          console.log(err)
        })
      }

      averageDown = () => {
        axios.patch('http://137.74.196.13:5050/api/vote/downvote/'+this.state.idUser)
        .then((res)=>{
          console.log(res)
        })
        .catch((error)=>{
          console.log(error)
        })
      }
      averageUp = () => {
        axios.patch('http://137.74.196.13:5050/api/vote/upvote/'+this.state.idUser)
        .then((res)=>{
          console.log(res)
        })
        .catch((error)=>{
          console.log(error)
        })
      }

      _reportUser(){
        console.log("user has been reported")
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
          url: 'http://137.74.196.13:5050/api/home/vote',
          headers: {authorization: 'Bearer '+this.state.currentToken},
          data: { 
            userId: this.infoUserAdverse._id,
            Score : jugé
          } 
        })
        .then((res)=>{
          console.log(res)
          this.averageUp()
          this.addHisotryUser()
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
          url: 'http://137.74.196.13:5050/api/home/vote',
          headers: {authorization: 'Bearer '+this.state.currentToken},
          data: { 
            userId: this.infoUserAdverse._id,
            Score : jugé
          } 
        })
        .then((res)=>{
          console.log(res)
          this.averageDown()
          this.addHisotryUser()
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
                <Text>{this.infoUserAdverse.name} </Text>
                  <Text>{this.infoUserAdverse.age} {this.infoUserAdverse.Score}</Text>
          <Text> {this.state.yPos} </Text>
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

      <Animated.View style={{ opacity: this.reportOpacity, position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>REPORT USER </Text>
                  </Animated.View>*/
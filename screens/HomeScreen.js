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
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {randomInt, pow, floor} from 'mathjs';
import axios from 'axios';
import Modal from 'react-native-modal';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DropdownAlert from 'react-native-dropdownalert';
import { Icon } from 'react-native-elements';

/*-----------------------------------------*/
const userAPI = 'https://outoften.fr/api/new/users';
const urlHistory = 'https://outoften.fr/api/vote/historyvote/';
const urlArrayHistory = 'https://outoften.fr/api/vote/array/';
const realUsers = [];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.retrieveId();
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      idUser: 0,
      nameUser: null,
      scoreUser: null,
      currentAdverseId: '',
      defaultAvatar: 'uploads/avatardefault.png',
      currentToken: this.props.screenProps.jwt,
      readyRender: 0,
      voteHistory: [],
      ready: false,
      isReportVisible: false,
      isHelpVisible: false,
      commentUser : "",
      needHelp:false,
      arrowLeft:'<',
    };
        this.PanResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onPanResponderMove: (evt, gestureState) => {

            this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
          },
          onPanResponderRelease: (evt, gestureState) => {
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

    this.infoUserAdverse = {};
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });
      this.rotateAndTranslate = {
      transform: [
        {rotate: this.rotate,},
        ...this.position.getTranslateTransform(),
      ],
    },
      this.likeOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      });
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });
    /*
        this.reportOpacity = this.position.y.interpolate({
          inputRange: [SCREEN_HEIGHT/2,0,SCREEN_HEIGHT/2],
          outputRange:[448,0,448],
          extrapolate:'clamp'
        })*/

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp',
    });
  }

  retrieveId = () => {
    //Get back the Id of current logged in user from the token
    const header = {
      authorization: 'Bearer ' + this.props.screenProps.jwt,
    };
    console.log(header);
    axios
      .get('https://outoften.fr/api/posts', {
        headers: header,
      })
      .then(response => {
        console.log(response);
        this.setState({idUser: response.data._id});
        console.log('retrieve ID constructor', this.state.idUser);
      })
      .catch(error => {
        console.log(error);
      });
    }

  hideKeyboard = (event) => {
    if(event.nativeEvent.key =='Enter'){
      Keyboard.dismiss();
    }
  }

  historyUsers = () => {
    axios({
      method: 'GET',
      url: urlArrayHistory + this.state.idUser,
    }).then(response => {
      const realUsersId = [];
      for (let p = 0; p < realUsers.length; p++) {
        realUsersId.push(realUsers[p]._id);
      }
      console.log(
        'response de historyVote',
        response.data[0].historyVote,
        'compare with realUsers',
        realUsersId,
      );
      let resHistory = response.data[0].historyVote
      let count = 0;
      for (let k = 0; k < realUsersId.length; k++) {
        if (resHistory.includes(realUsersId[k])) {
          console.log("it's in need splice", realUsers.splice(0+count,1));
        } 
        else {
          count +=1;
          console.log("ain't in");
        }
      }
      console.log(realUsers)
    });
  };

  fetchUsers = () => {
    axios
      .get(userAPI) //Array from all users in DB
      .then(res => {
        for (var k = 0; k < res.data.length; k++) {
          if (this.state.idUser == res.data[k]._id) 
          {} 
          else if (this.state.defaultAvatar == res.data[k].userImage) 
          {console.log("no photo")} 
          else 
          {
            realUsers.push(res.data[k]);
          }
        }
        console.log('real users', realUsers);
        this.historyUsers()
      });
  };

  apiFetchData = () => {
    const newHeader = {
      authorization: 'Bearer ' + this.state.currentToken,
    };
    axios
      .get('https://outoften.fr/api/new/' + this.state.idUser, {
        headers: newHeader,
      })
      .then(res => {
        console.log('fetch info constructor',res);
        this.setState({
          nameUser: res.data.name,
          scoreUser: res.data.Score,
          voteHistory: res.data.historyVote,
        });
      });
  };

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
                key={item._id} style={[this.rotateAndTranslate , { height: SCREEN_HEIGHT - 350, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
                  <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>++</Text>
                  </Animated.View> 
                  <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                    <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>--</Text>
                  </Animated.View>

                <Image
                  style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                  source={{uri:"https://outoften.fr/"+item.userImage}} />
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
  
  componentDidMount() {
    var that = this;
    this.fetchUsers();
    setTimeout(function() {
      that.apiFetchData();
    }, 1000);
  }


    addHisotryUser =  () => {
    let urlHistory2 = urlHistory + this.state.idUser;
    console.log("url history", urlHistory2);
    axios({
      method: 'PATCH',
      url: urlHistory2,
      //headers: {authorization: 'Bearer '+this.state.currentToken},
      data: {
        userId: this.infoUserAdverse._id,
      },
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  
  averageDown = () => {
    axios
      .patch('https://outoften.fr/api/vote/downvote/' + this.state.idUser)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };
  averageUp = () => {
    axios
      .patch('https://outoften.fr/api/vote/upvote/' + this.state.idUser)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  _sendComment = () => {
    axios({
      method:'POST',
      url: 'https://outoften.fr/api/home/comment',
      data:{
        idUser : this.infoUserAdverse._id,
        message : this.state.commentUser
      }
    })
    .then(res => {
      console.log(res)
      this.eraseComment()
    })
    .catch(err => {
      console.log(err)
    })
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
      facteurPonderation=7000;
      jugé=jugé+facteurPonderation*(1-pD);
    }
    if(pD>0.7 && pD<0.95){
      facteurPonderation = 5;
      jugé=jugé+facteurPonderation*(1-pD);
    }

    if(pD=>0.5 && pD<0.7){
      facteurPonderation=8
      jugé=jugé+facteurPonderation*(1-pD);
    }
    if(pD>0.3 && pD<0.5){
      facteurPonderation = 11;
      jugé=jugé+facteurPonderation*(1-pD);
    }
    if(pD>0.2 && pD<0.3){
      facteurPonderation=14.65;
      jugé=jugé+facteurPonderation*(1-pD)
    }
    if(pD>0.05 && pD<0.2){
      facteurPonderation=18
      jugé=jugé+facteurPonderation*(1-pD)
    }
    if(pD>0.001 && pD<0.05){
      facteurPonderation=35;
      jugé=jugé+facteurPonderation*(1-pD);
    }
    if(pD<0.001){
      facteurPonderation=100
      jugé=jugé+facteurPonderation*(1-pD);
    }
    console.log(jugé)
    jugé=floor(jugé)
    console.log("arpès l'arrondi",jugé)
    console.log("id adverse",this.infoUserAdverse._id)
    axios({ 
      method: 'POST',
      url: 'https://outoften.fr/api/home/vote',
      headers: {authorization: 'Bearer '+this.state.currentToken},
      data: { 
        userId: this.infoUserAdverse._id,
        Score : jugé
      } 
    })
    .then((res)=>{
      if(this.state.commentUser!="" && this.state.commentUser!=null){
        alert("comment sent")
        this._sendComment()
      }
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
      url: 'https://outoften.fr/api/home/vote',
      headers: {authorization: 'Bearer '+this.state.currentToken},
      data: { 
        userId: this.infoUserAdverse._id,
        Score : jugé
      } 
    })
    .then((res)=>{
      if(this.state.commentUser!="" && this.state.commentUser!=null){
        this._sendComment()
      }
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

  displayHelp = () => {
    
  }
  eraseComment = () => {
    this.setState({commentUser:""})
    this.commentTextInput.clear()
  }
  confirmReport = () => {
    axios({
      method: 'POST',
      url: 'https://outoften.fr/api/report/submit/' + this.state.idUser,
      headers: {authorization: 'Bearer ' + this.state.currentToken},
      data: {
        idReporter: this.state.idUser,
        idReportedUser: this.infoUserAdverse._id,
      },
    }).then(res => {
      console.log(res);
      this.setState({isReportVisible: false});
      this.setState({currentIndex: this.state.currentIndex + 1});
      this.position.setValue({x: 0, y: 0});
      this.addHisotryUser();
      this.dropDownAlertRef.alertWithType(
        'success',
        'Success',
        'Thanks for reporting, we will investigate this report within few hours.!',
      );
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            top: 15,
          }}>
          <Text> Hey, how you doing {this.state.nameUser}? </Text>
        </View>
        <Icon 
          name='question'
          type='font-awesome'
          color='#3a7bd5'
          iconStyle={{position:'absolute',bottom:0.3,left:SCREEN_WIDTH/1.1,zIndex:1}}
          onPress={()=>this.setState({isHelpVisible:true})}
          />
        <View style={{flex: 1}}>{this.renderUsers()}</View>
        <KeyboardAvoidingView  behavior='position' keyboardVerticalOffset={40} enabled>
            <TextInput style={styles.input}
            ref={input=>{this.commentTextInput = input}}
            onChangeText={(value) => this.setState({commentUser:value})}
            placeholder="Leave a comment (optional)"
            multiline={true}
            onKeyPress={this.hideKeyboard}
            /> 
            </KeyboardAvoidingView>
        <View style={{height: 17, marginLeft: 15}}>
          <Text style={{fontWeight: 'bold'}}>{this.infoUserAdverse.name} </Text>
          <Text>Category : {this.infoUserAdverse.imageCategory}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 10,
          }}>
          <LinearGradient colors={['#F00000','#DC281E']}>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => this.setState({isReportVisible: true})}>
              <Text style={{fontWeight:'bold',color:'white',textAlign: 'center', lineHeight: 35}}>
                Report user
              </Text>
            </TouchableOpacity>
            </LinearGradient>
        </View>  
        <Modal
          onSwipeComplete={() => this.setState({isReportVisible: false})}
          swipeDirection={['up', 'down',]}
          style={{height: 400}}
          backdropOpacity={0.2}
          coverScreen={false}
          isVisible={this.state.isReportVisible}
          onBackdropPress={() => this.setState({isReportVisible: false})}
          style={{justifyContent: 'flex-end', margin: 0}}>
          <View style={styles.content}>
            <Text style={styles.contentTitle}>
              Are you sure you want to report this user? False reporting may
              lead into your account being suspended!
            </Text>
            <Button title="Yes" onPress={() => this.confirmReport()} />
            <Button
              title="No"
              onPress={() => this.setState({isReportVisible: false})}
            />
          </View>
        </Modal>
        <Modal 
        backdropOpacity={0.4}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={850}
        animationOutTiming={500}
        onSwipeComplete={()=>this.setState({isHelpVisible:false})}
        isVisible={this.state.isHelpVisible}
        onBackdropPress={()=>this.setState({isHelpVisible:false})}
        >
          <View style={styles.contentHelp}>
            <Text style={styles.headerModal}>Help</Text>
            <Text style={styles.howToUse}>
              First thing you see is the user's photo, at the bottom you can also see the<Text style={{color:'#3a7bd5',fontWeight:'bold'}}> Category</Text></Text>
              <Text style={styles.howToUse}>Then you either swipe to the right if you like <Text style={{color:'green'}}>------></Text></Text>
              <Text style={styles.howToUse}>Or you can swipe to the left if you do not like <Text style={{color:'red'}}> {this.state.arrowLeft}------</Text></Text>
              <Text style={styles.howToUse}>You can leave a comment in the box below the photo end then swipe the photo to send it.</Text>
              <View style={{paddingTop:40}}>
                <Text style={styles.howToUse}>Finally, if you feel like a photo is unnapropirate you can hit the report <Text style={{color:'red',fontWeight:'bold'}}>button</Text></Text>
              </View>
            <View style={styles.categoryHelp}></View>
          </View>
        </Modal>
        <DropdownAlert ref={ref => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}


  const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    flex: 1,
    margin: 10,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
  reportButton: {
    //backgroundColor: '#1CAFD3',
    width: SCREEN_WIDTH / 4,
    height: 40,
    borderRadius: 20,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentHelp:{
    alignItems: 'center',
  },
  headerModal:{
    color:'white',
    fontSize:30,
    fontWeight:'bold',
    position:'absolute',
    bottom:SCREEN_HEIGHT/2.5
  },
  howToUse:{
    textAlign:'center',
    color:'white',
    fontSize:14
  },
  categoryHelp:{
    position:'absolute',
    top:SCREEN_HEIGHT/2.13,
    right:SCREEN_WIDTH/1.48,
    backgroundColor:'#3a7bd5',
    height:3,
    width:100,
    borderRadius:2,
    borderColor:'red'
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    margin: 15,
    height: 100,
    borderColor: 'grey',
    borderWidth: 1,
    color:'red'
 },
});



/*

                  */

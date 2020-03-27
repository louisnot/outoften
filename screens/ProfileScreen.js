/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Picker,
  SafeAreaView,
} from 'react-native';
import {Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import { Loading } from '../Components/common';
import LinearGradient from 'react-native-linear-gradient'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


const createFormData = (photo, body) => {
  const data = new FormData();
  data.append('photo', {
    name: 'avatar.png',
    type: 'image/png',
    uri:
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });
  return data;
};
/*
Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
*/

function Comment({ comment }) {
  return (
    <View style={styles.commentBox}>
      <Text style={styles.comment}>{comment}</Text>
    </View>
  );
}


export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataName: 'test',
      dataPhoto: null,
      dataScore: undefined,
      userId: null,
      test: 0,
      currentToken: null,
      editProfile: 0,
      photo: null,
      photoCat : null,
      dataSource : [],
      isLoading: false,
    };
  }

  renderImage = () => {
    if (this.state.dataPhoto == null) {
      return (
        <React.Fragment>
          <Image
            source={{
              uri: 'https://outoften.fr/uploads/avatardefault.png',
            }}
            style={{
              width: SCREEN_WIDTH - 20,
              height: SCREEN_HEIGHT - 300,
              borderRadius: 20,
            }}
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Image
            source={{uri: 'https://outoften.fr/' + this.state.dataPhoto}}
            style={{
              width: SCREEN_WIDTH - 20,
              height: SCREEN_HEIGHT - 300,
              borderRadius: 20,
            }}
          />
        </React.Fragment>
      );
    }
  };
  handleChoosePhoto = () => {
    const options = {
      title: 'select image',
      noData: true,
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('hmm you changed your mind didnt you');
      }
      if (response.uri) {
        this.setState({photo: response});
        console.log(this.state.photo.uri);
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        // eslint-disable-next-line no-alert
        alert('An error occured try again later');
      }
    });
};

  handleCategoryUpload = () =>{
    axios({
      method:'POST',
      url:'https://outoften.fr/api/new/cat/'+this.state.userId,
      data:{ imageCategory : this.state.photoCat}
    })
    .then(response => {
      console.log('cat success', response)
    })
    .catch(err=>{
      console.log(err)
    })
  };
  handleUploadPhoto = () => {
    this.setState({isLoading : true})
    if(this.state.photoCat==null){
      alert('Select a valid category!')
    }
    else{
      this.handleCategoryUpload()
    fetch('https://outoften.fr/api/new/uploads/' + this.state.userId, {
      method: 'POST',
      body: createFormData(this.state.photo)
    })
      .then(response => response.json())
      .then(response => {
        console.log('upload success', response);
        this.setState({isLoading : false})
        this.setState({dataPhoto: response.path});
        console.log(this.state.dataPhoto);
        alert('Photo successfully changed!');
      })
      .catch(error => {
        console.log(error);
      });
  }
};
  fecthUserComment = () => {
    console.log("fetch comment", this.state.userId)
    axios({
      method:'GET',
      url:'https://outoften.fr/api/home/commentlist/'+this.state.userId
    })
    .then((res) => {
      for(let k = 0;k<res.data.length;k++){
        this.state.dataSource.push(res.data[k])
      }
      console.log(this.state.dataSource)
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  componentDidMount() {
    this.setState({currentToken: this.props.screenProps.jwt});
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
        this.setState({userId: response.data._id});
        this.updateInfo();
      })
      .catch(error => {
        console.log(error);
      });
      var that = this;
      setTimeout(function() {
        that.fecthUserComment();
      }, 4000);
  }
  updateInfo = () => {
    const newHeader = {
      authorization: 'Bearer ' + this.state.currentToken,
    };
    axios
      .get('https://outoften.fr/api/new/' + this.state.userId, {
        headers: newHeader,
      })
      .then(res => {
        this.setState({
          dataName: res.data.name,
          dataScore: res.data.Score,
          dataPhoto: res.data.userImage,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  errorPick = function () {
    if(this.state.photoCat==null){
      return(<Text style={{color:'red'}}> You must select a valid category</Text>)
    }
  }
  render() {
    if (this.state.editProfile == 0) {
      return (
        <View style={{flex: 1}}>
          <View
            style={{
              height: 70,
              fontSize: 32,
              justifyContent: 'space-evenly',
              flexDirection:'row',
              alignItems: 'center',
              top: 15,
            }}>
            <Text style={{fontSize: 18}}>
              Looking great {this.state.dataName}
            </Text>
            <TouchableOpacity onPress={()=> this.setState({editProfile: 2})}>
              <Text>See comments</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: SCREEN_HEIGHT - 220,
              width: SCREEN_WIDTH,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.renderImage()}
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.description}>
              {' '}
              {this.state.dataName}, your current score {this.state.dataScore}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 10,
            }}>
            <LinearGradient style={styles.linearGradient} colors={['#3a7bd5','#00b4db']}>
              <TouchableOpacity
                style={styles.editSettings}
                onPress={() => this.setState({editProfile: 1})}>
                <Text style={{textAlign: 'center', lineHeight: 35}}>
                  Edit photo
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient style={styles.linearGradient} colors={['#3a7bd5','#00b4db']}>
                <TouchableOpacity
                  style={styles.editSettings}
                  onPress={() => this.props.navigation.navigate('Setting')}>
                  <Text style={{textAlign: 'center', lineHeight: 35}}>
                    Settings
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
          </View>
        </View>
      );
    }
    if (this.state.editProfile == 1) {
      const {photo} = this.state;
      return (
        <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
        <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
          {photo && (
            <React.Fragment>
              <Image
                source={{uri: photo.uri}}
                style={{width: 300, height: 300}}
              />
              { !this.state.isLoading ?
                <Button title="Upload" onPress={this.handleUploadPhoto} /> :
                <Loading size={'large'} />
              }
              <View style={{alignItems:'center'}}>
              {this.errorPick()}
              <Picker selectedValue={this.state.photoCat}
              style={{width:190,height:50}} 
              onValueChange={(itemValue)=> this.setState({photoCat:itemValue})}>
                <Picker.Item label="None" value={null} />
                <Picker.Item label="Pet" value="pet" />
                <Picker.Item label="Food" value="food" />
                <Picker.Item label="Landscapes" value="landscape" />
                <Picker.Item label="Art" value="art" />
                <Picker.Item label="Outfit" value="Outfit" />
              </Picker>
              </View>
            </React.Fragment>
          )}
        </View>
        <View style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 10,
            }}>
        <LinearGradient style={styles.linearGradient} colors={['#3a7bd5','#00b4db']}>
          <TouchableOpacity  style={{color:'white',width: SCREEN_WIDTH / 4,height: 40,borderRadius: 20,}}  onPress={() => this.handleChoosePhoto()}>
              <Text style={{textAlign: 'center', lineHeight: 35}}>Choose Photo</Text>
            </TouchableOpacity>
          </LinearGradient>
        <LinearGradient style={styles.linearGradient} colors={['#3a7bd5','#00b4db']}>
          <TouchableOpacity  style={{color:'white',width: SCREEN_WIDTH / 4,height: 40,borderRadius: 20,}}  onPress={() => this.setState({editProfile: 0})}>
              <Text style={{textAlign: 'center', lineHeight: 35}}>Back</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        </View>
      );
    }
    if(this.state.editProfile==2){
      if(this.state.dataSource.length!=0)
      {
        return(
        <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Text>Comment here</Text>
            <FlatList 
              data={this.state.dataSource}
              renderItem={({item})=><Comment comment={item.messageContent}/>}
              keyExtractor={ item => item._id}
            />
          <LinearGradient style={[styles.linearGradient,{width:100}]} colors={['#3a7bd5','#00b4db']}>
            <TouchableOpacity  style={{color:'white',}}  onPress={() => this.setState({editProfile: 0})}>
              <Text style={{textAlign: 'center', lineHeight: 35}}>Back</Text>
            </TouchableOpacity>
          </LinearGradient>
        </SafeAreaView>
      )}
      else{
        return(
        <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Text>No comment, check back later.</Text>
          <LinearGradient style={[styles.linearGradient,{width:100}]} colors={['#3a7bd5','#00b4db']}>
          <TouchableOpacity  style={{width: SCREEN_WIDTH / 4,height: 40,borderRadius: 20,}}  onPress={() => this.setState({editProfile: 0})}>
            <Text style={{color:'white',textAlign: 'center', lineHeight: 35}}>Back</Text>
          </TouchableOpacity>
          </LinearGradient>
        </SafeAreaView>

        )}
    }
  }
}

const styles = StyleSheet.create({
  description: {
    fontSize: 12,
    color: 'grey',
  },
  editSettings: {
    width: SCREEN_WIDTH / 4,
    height: 40,
    borderRadius: 20,
  },
  linearGradient: {
    borderRadius: 20
  },
  commentBox:{
    backgroundColor: '#ADD8E6',
    padding: 34,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  comment:{
    fontWeight:'bold'
  }
});

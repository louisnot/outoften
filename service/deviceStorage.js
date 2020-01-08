import AsyncStorage from '@react-native-community/async-storage';


const deviceStorage = { 
    async saveItem(key,value){
        try{
            await AsyncStorage.setItem(key,value);
        }
        catch(error){
            console.log('AsyncStorage Error: '+ error.message);
        }
    },
    async loadJWT(){
        try{    
            const value = await AsyncStorage.getItem('id_token');
            if(value!=null){
                this.setState({
                    jwt:value,
                    isLoading : false
                },
                );

            }else{
                this.setState({
                    isLoading : false
                });
            }
        }
        catch(error){
            console.log('AsyncStorage Error:' +error.message)
        }
    },
    async deleteJWT() {
        try{
            await AsyncStorage.removeItem('id_token')
            .then(
                ()=>{
                    this.setState({
                        jwt:''
                    })
                }
            );

        } catch(error) {
            console.log('AsyncStorage error:' + error.message )
        }
    }

}

export default deviceStorage
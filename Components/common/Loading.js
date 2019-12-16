import React from 'react';
import { View, ActivityIndicator} from 'react-native'

const Loading = ({size}) => {
    return(
        <View style={styles.spinnerContaienr}>
            <ActivityIndicator 
            size={size}
            
            />
        </View>
    );
};

const styles = {
    spinnerContaienr : {
    flex: -1,
    marginTop : 12,
    marginBottom : 12
    }   
}

export {Loading};
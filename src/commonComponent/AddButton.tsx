import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { View, Text ,TouchableOpacity} from 'react-native';

const AddButton = (props:any)=>{
    return(
        <TouchableOpacity style={{borderRadius:30,position:'absolute', width:50,height:50,borderWidth:1,alignSelf:'flex-end',bottom:60,right:40,justifyContent:'center',alignItems:'center'}}
        onPress={props.onPress}
        >
            <Text> ➕ </Text>
        </TouchableOpacity>
    )
}

export default AddButton;
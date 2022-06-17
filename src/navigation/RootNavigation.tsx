import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CategoryList from '../screens/CategoryList'
import CategoryDetail from '../screens/CategoryDetail';
import AddCustomCategory from '../screens/AddCustomCategory';

const Stack = createNativeStackNavigator();
const RootNavigation = () => {
    
    return (
        <Stack.Navigator>
            <Stack.Screen name="CategoryList" component={CategoryList} options={{title:'Details', headerShown:false }}/>
            <Stack.Screen name="CategoryDetail" component={CategoryDetail} options={({ route }) => ({title:route.params.name, headerShown:true })}/>
            <Stack.Screen name="AddCustomCategory" component={AddCustomCategory} options={{headerShown:true}}/>
        </Stack.Navigator>
    )

}
export default RootNavigation;
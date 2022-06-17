import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const Header = (props) => {
    const [search, SetSearch] = useState('')
    const [isFocus, SetIsFocus] = useState(false)
    const searchRef = useRef();
    const onfocusField = () => {
        SetIsFocus(true)
    }
    const onblurField = () => {
        searchRef.current.blur()
        SetIsFocus(false)
    }
    const oncancel = () => {
        SetIsFocus(false)
        SetSearch('')
        onblurField()
        props.onChangeText('')
    }
    const onChangeText = (text) =>{
        SetSearch(text)
        props.onChangeText(text)
    }
    return (
        <View style={styles.container}>
            <View style={styles.contentView}>
                <TextInput
                    placeholder='🔍  Search Category #'
                    caretHidden={false}
                    style={styles.searchBar}
                    onChangeText={onChangeText}
                    value={search}
                    onFocus={onfocusField}
                    ref={searchRef}
                    onBlur={onblurField}
                />
                {isFocus ?
                    <TouchableOpacity
                        style={{ marginRight: 20 }}
                        onPress={() => oncancel()}
                    >
                        <Text style={{ fontSize: 14, color: 'blue' }}>Cancel</Text>
                    </TouchableOpacity>
                    : <TouchableOpacity style={{marginRight:20}}
                    onPress={props.selectFilter}
                    >
                        <Text style={{fontSize:40}}>≕</Text>
                        </TouchableOpacity>}
            </View>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container:{ width: '100%', height: 40, backgroundColor: '#FFFFFF' },
    searchBar:{ marginRight: 20, paddingLeft: 20, backgroundColor: '#F4F4F4', flex: 1, height: 38, borderRadius: 19, },
    contentView:{ marginLeft: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
})
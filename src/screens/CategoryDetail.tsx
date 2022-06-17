import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';

const CategoryDetail = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const [extraData, setExtraData] = React.useState(new Date())
    const { category, parentCat } = route.params;

    useEffect(() => {

    }, [])
    const expandCategory = (item) => {
        item.expand = item.expand ? false : true
        setExtraData(new Date())
    }
    const selectCategory = (item) => {
        navigation.push('CategoryDetail', { category: item, parentCat: item, name: item.name[0].value })
    }
    const renderCate = ({ item, index }) => (
        <View style={{ margin: 12 }}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => selectCategory(item)}>
                <Text>{`▪ ${item.name[0].value}`}</Text>
                {item.subCategory ?
                    <>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={{height:20,width:40}} onPress={() => { expandCategory(item) }}>
                            <Text>{item.expand ? '⬆' : '⬇'}</Text>
                        </TouchableOpacity>
                    </>
                    : null}
            </TouchableOpacity>
            {item.subCategory && item.expand ?
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={item.subCategory}
                    renderItem={(item, index) => renderCate(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={false}
                /> : null
            }
        </View>
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.contentView]}>
                <View style={{ flexDirection: 'row' }}>
                    {category.type == 'custom'&&category.image ? <Image style={{height:54, width:66, top:8, marginRight:6}} source={{uri:category.image}}/>:null}
                    <View>
                        <Text style={styles.heading}>Category Title</Text>
                        <Text style={{ padding: 4 }}>{category.type == 'custom' ? category.nameEng : category.name[0].value}</Text>
                        <Text style={{ padding: 4 }}>{category.type == 'custom' ? category.nameHin : category.name[1].value}</Text>
                    </View>
                </View>
                <Text numberOfLines={4} style={{ padding: 4 }}>{category.description}</Text>
                {parentCat ? <>
                    <View style={{ flexDirection: 'row' }}>
                        <View>

                        </View>
                    </View>
                    <Text style={[styles.heading, { marginTop: 20 }]}>Parent Category Title</Text>
                    <Text style={{ padding: 4 }}>{parentCat.type == 'custom' ? parentCat.nameEng : parentCat.name[0].value}</Text>
                    <Text style={{ padding: 4 }}>{parentCat.type == 'custom' ? parentCat.nameHin : parentCat.name[1].value}</Text>
                    <Text numberOfLines={4} style={{ padding: 4 }}>{parentCat.description}</Text>
                </> : null}
            </View>
            <View style={[styles.contentView, { flex: 1, justifyContent: 'center' }]}>
                {category.subCategory ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={category.subCategory}
                        extraData={extraData}
                        renderItem={(item, index) => renderCate(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={false}
                    /> : <Text style={styles.noDataLbl}>Sub category not available</Text>}
            </View>
        </SafeAreaView>
    )
}

export default CategoryDetail;

const styles = StyleSheet.create({
    heading: { padding: 4, fontWeight: 'bold' },
    contentView: { margin: 10, padding: 10, backgroundColor: 'white' },
    noDataLbl: { fontWeight: 'bold', width: '100%', textAlign: 'center' }
})
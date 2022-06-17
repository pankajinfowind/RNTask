import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, FlatList, View, TouchableOpacity, StatusBar, Alert, Modal } from 'react-native';
import Header from '../commonComponent/Header';
import AddButton from '../commonComponent/AddButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TestCategoryData from '../source/TestCategoryData.json'
let mainData: any[]
const CategoryList = () => {

    const [categoryList, setCategoryList] = useState([])
    const [extraData, setExtraData] = React.useState(new Date())
    const navigation = useNavigation()
    const [featured, setFeatured] = useState()
    const [filterModel, setFilterModel] = useState(false)

    let parsedCategory: any[]
    let subCateData: any[]


    useEffect(() => {
        parseGategoryData()
    }, [])

    const parseGategoryData = () => {
        parsedCategory = []
        subCateData = []
        let categiryData = [...TestCategoryData.data]
        if (categiryData?.length > 0) {
            parsedCategory = [...categiryData.filter(cat => cat.parentID === '0')]
            subCateData = [...categiryData.filter(cat => cat.parentID !== '0')]
            assignSubCatToParent()
        }
    }
    const assignSubCatToParent = () => {
        let availbleIndex = []
        for (let i = 0; i < parsedCategory.length; i++) {
            let cat = { ...parsedCategory[i] }
            let subCat = cat.subCategory ? [...cat.subCategory] : []
            for (let j = 0; j < subCateData.length; j++) {
                if (cat.categoryId === subCateData[j].parentID) {
                    subCat.push({ ...subCateData[j] })
                    parsedCategory[i].subCategory = subCat
                    availbleIndex.push(subCateData[j].categoryId)
                }
            }
        }
        for (var i = 0; i < availbleIndex.length; i++) {
            let catId = availbleIndex[i]
            for (var j = 0; j < subCateData.length; j++) {
                if (catId == subCateData[j].categoryId) {
                    subCateData.splice(j, 1)
                    break
                }
            }
        }
        if (subCateData.length > 0) {
            assignSuperSubCat()
        } else {
            sortAlphabetic()
        }
    }
    const assignSuperSubCat = () => {
        for (let i = 0; i < parsedCategory.length; i++) {
            let cat = { ...parsedCategory[i] }
            let subCat = cat.subCategory ? [...cat.subCategory] : []
            for (let k = 0; k < subCat.length; k++) {
                let childCat = { ...subCat[k] }
                let superSubCat = childCat.subCategory ? [...childCat.subCategory] : []
                for (let j = 0; j < subCateData.length; j++) {
                    if (childCat.categoryId === subCateData[j].parentID) {
                        superSubCat.push({ ...subCateData[j] })
                        parsedCategory[i].subCategory[k].subCategory = superSubCat
                    }
                }
            }
        }
        sortAlphabetic()
    }
    const sortAlphabetic = async () => {
        let localCats = await getLocalCategory()
        parsedCategory = parsedCategory.concat(localCats)
        parsedCategory.forEach(cat => {
            cat.subCategory ?
                cat.subCategory.sort(function (a, b) {
                    var textA = a.type === 'custom' ? a.nameEng : a.name[0].value.toUpperCase();
                    var textB = b.type === 'custom' ? b.nameEng : b.name[0].value.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                }) : null;
        });
        parsedCategory.sort(function (a, b) {
            var textA = a.type === 'custom' ? a.nameEng : a.name[0].value.toUpperCase();
            var textB = b.type === 'custom' ? b.nameEng : b.name[0].value.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        mainData = parsedCategory
        setCategoryList(parsedCategory)
    }
    const getLocalCategory = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('Local_category')
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
        }
    }
    const expandCategory = (item) => {
        item.expand = item.expand ? false : true
        setExtraData(new Date())
    }
    const selectCategory = (item) => {
        let parentCat = getParentCat(item)
        console.log('Parent category is = ', parentCat)
        navigation.navigate('CategoryDetail', { category: item, parentCat: parentCat, name: item.type == 'custom' ? item.nameEng : item.name[0].value })
    }
    const getParentCat = (item) => {
        let parentCat
        if (item.parentID !== '0') {
            topLoop: for (let i = 0; i < categoryList.length; i++) {
                if (categoryList[i].categoryId == item.parentID) {
                    parentCat = categoryList[i]
                    break
                } else {
                    if (categoryList[i].subCategory) {
                        for (let j = 0; j < categoryList[i].subCategory.length; j++) {
                            if (categoryList[i].subCategory[j].categoryId == item.parentID) {
                                parentCat = categoryList[i].subCategory[j]
                                break topLoop;
                            }
                        }
                    }
                }
            }
        }
        return parentCat
    }
    const onChangeText = (text) => {
        let allCategory = [...mainData]
        console.log('all data is a = ', allCategory)
        let filter_data = mainData.filter((cat) => {
            let name = cat.type === 'custom' ? cat.nameEng : cat.name[0].value.toUpperCase()
            let searchText = text.toUpperCase()
            console.log('filter data is = ', name, searchText)
            return name.includes(searchText)
        })
        setCategoryList(filter_data)
    }
    const customItemAdded = (cat) => {
        mainData.push(cat)
        sortAlphabetic()
        alert('New custom category added successfully.')
        setTimeout(() => {
            setExtraData(new Date())
        }, 1000);
    }
    const selectFilter = () => {
        setFilterModel(true);
    }
    const applyFilter = (featured) =>{
        setFilterModel(false);
        let allCategory = [...mainData]
        console.log('all data is a = ', allCategory)
        let filter_data = mainData.filter(cat=>{
            return cat.featured === featured
        })
        setCategoryList(filter_data)
    }
    const clearFilter = () =>{
        setFilterModel(false);
        let allCategory = [...mainData]
        setCategoryList(allCategory)
    }
    const renderCate = ({ item, index }) => (
        <View style={{ margin: 12 }}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => selectCategory(item)}>
                {item.type == 'custom' ? <Text>{`▪ ${item.nameEng}`}</Text> :
                    <Text>{`▪ ${item.name[0].value}`}</Text>}
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <Header onChangeText={onChangeText} selectFilter={selectFilter} />
            <View style={{ backgroundColor: '#fbfbfb', flex: 1 }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={categoryList}
                    extraData={extraData}
                    renderItem={(item, index) => renderCate(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={false}
                />
            </View>
            <AddButton onPress={() => navigation.navigate('AddCustomCategory', { categoryList: categoryList, itemAdded: customItemAdded })} />


            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModel}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setFilterModel(false);
                }}
            >
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: 220, width: '80%', backgroundColor: 'white', alignItems: 'center' }} >

                        <Text style={{ color: 'black', marginTop: 10, fontWeight: 'bold' }}>Filter featured list</Text>

                        <TouchableOpacity style={{marginTop:20, }} onPress={()=>{applyFilter(true)}}>
                            <Text style={{textDecorationLine:'underline', color:'blue'}}>▪ Filter featured categories</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginTop:20, }} onPress={()=>{applyFilter(false)}}>
                            <Text style={{textDecorationLine:'underline', color:'blue'}}>▪ Filter non featured categories</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{marginTop:40, }} onPress={()=>{clearFilter()}}>
                            <Text style={{textDecorationLine:'underline', color:'blue'}}>Clear filter</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </SafeAreaView>
    )
}
export default CategoryList;

const styles = StyleSheet.create({

})

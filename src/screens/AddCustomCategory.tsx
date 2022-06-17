import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,Alert, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const AddCustomCategory = () => {

    const [categoryEnglish, SetCategoryEnglish] = useState('')
    const [categoryHindi, SetCategoryHindi] = useState('')
    const [description, SetDescription] = useState('')
    const [image, SetImage] = useState('')
    const [catId, SetCatId] = useState(uid())
    const [featured, setFeatured] = useState(true)

    const navigation = useNavigation()
    const route = useRoute()
    let { categoryList, itemAdded } = route.params;

    useEffect(() => {
    }, [])
    const selectPhoto = () =>{
        ImagePicker.openPicker({
            mediaType:"photo",
            width: 220,
            height: 180,
            cropping: true,
            cropperCircleOverlay:false,
            includeBase64:true
          }).then(image => {
            console.log('image is =','data:image/png;base64'+image.data);
            SetImage('data:image/png;base64,'+image.data)
          });
    }
    const saveCategory = async () =>{
        let validator = validateEstimate()
        if (!validator[0]) {
            Alert.alert(validator[1])
            return
        }
        const category = {
            'type':'custom',
            "categoryId": catId,
            "nameEng": categoryEnglish,
            "nameHin": categoryHindi,
            "description": description,
            "image": image,
            "featured": featured,
        }
        let localCat = await getLocalCategory()
        localCat.push(category)
        await saveLocalCategory(localCat)
        categoryList.push(category)
        sortAlphabetic(categoryList)
        itemAdded(category)
        navigation.navigate('CategoryList')
    }
    const sortAlphabetic = async(parsedCategory) => {
        parsedCategory.forEach(cat => {
            cat.subCategory ?
            cat.subCategory.sort(function (a, b) {
                var textA = a.type === 'custom' ? a.nameEng : a.name[0].value.toUpperCase();
                var textB = b.type === 'custom' ? b.nameEng : b.name[0].value.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }):null;
        });
        parsedCategory.sort(function (a, b) {
            var textA = a.type === 'custom' ? a.nameEng : a.name[0].value.toUpperCase();
            var textB = b.type === 'custom' ? b.nameEng : b.name[0].value.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }
    const getLocalCategory = async() =>{
        try {
            const jsonValue = await AsyncStorage.getItem('Local_category')
            return jsonValue != null ? JSON.parse(jsonValue) : [];
          } catch(e) {
          }
    }
    const saveLocalCategory = async(localCats) =>{
        try {
            const jsonValue = JSON.stringify(localCats)
            await AsyncStorage.setItem('Local_category', jsonValue)
          } catch (e) {
          }
    }
    const validateEstimate = () => {
        if (categoryEnglish == '') {
            return [false, 'Please enter category name in english.']
        } else if (categoryHindi == '') {
            return [false, 'Please enter category name in hindi.']
        }else if (description == '') {
            return [false, 'Please enter some description about category.']
        }else if (image == '') {
            return [false, 'Please select category image.']
        } else {
            return [true]
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.scrollView}>
                    <View style={{ backgroundColor: '#FFFFFF' }}>
                        <View style={{ width: '100%', borderWidth: 1, borderRadius: 20, backgroundColor: '#f0f0f0' }}>
                            <View style={[styles.itemTitle, { width: 110 }]}>
                                <Text style={{ fontWeight: 'bold' }}>Category ID</Text>
                            </View>
                            <TextInput
                                value={catId}
                                style={[styles.txtInput, { marginBottom: 10 }]}
                                placeholder="Category Id"
                                onChangeText={(text) => SetCategoryEnglish(text)}
                                editable={false}
                            />
                        </View>
                        <View style={{ width: '100%', borderWidth: 1, borderRadius: 20, marginTop: 20 }}>
                            <View style={[styles.itemTitle, { width: 190 }]}>
                                <Text style={{ fontWeight: 'bold' }}>Category name(English)</Text>
                            </View>
                            <TextInput
                                value={categoryEnglish}
                                style={[styles.txtInput, { marginBottom: 10 }]}
                                placeholder="Category name(English)"
                                onChangeText={(text) => SetCategoryEnglish(text)}
                            />
                        </View>
                        <View style={{ width: '100%', height: 62, borderWidth: 1, borderRadius: 20, marginTop: 20 }}>
                            <View style={[styles.itemTitle, { width: 175 }]}>
                                <Text style={{ fontWeight: 'bold' }}>Category name(Hindi)</Text>
                            </View>
                            <TextInput
                                value={categoryHindi}
                                style={styles.txtInput}
                                placeholder="Category name(Hindi)"
                                onChangeText={(text) => SetCategoryHindi(text)}
                            />
                        </View>
                        <View style={{ width: '100%', height: 62, borderWidth: 1, borderRadius: 20, marginTop: 20 }}>
                            <View style={[styles.itemTitle, { width: 110 }]}>
                                <Text style={{ fontWeight: 'bold' }}>Is featured ?</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop:14 }}>
                                    <TouchableOpacity style={featured ? styles.featuredBtnSelected:styles.featuredBtn} onPress={()=> setFeatured(true)}>
                                        <Text style={featured ? { fontWeight: 'bold',color:'white' }:{ fontWeight: 'bold',color:'black' }}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[!featured ? styles.featuredBtnSelected:styles.featuredBtn,{marginLeft:20}]} onPress={()=> setFeatured(false)}>
                                        <Text style={!featured ? { fontWeight: 'bold',color:'white' }:{ fontWeight: 'bold',color:'black' }}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewDescription}>
                            <View style={[styles.itemTitle, { width: 100 }]}>
                                <Text style={{ fontWeight: 'bold' }}>Description</Text>
                            </View>
                            <TextInput
                                value={description}
                                style={styles.descInput}
                                placeholder="Description.."
                                multiline={true}
                                textAlignVertical='top'
                                onChangeText={(text) => SetDescription(text)}
                            />
                        </View>
                        <TouchableOpacity style={styles.uploadBtn} onPress={()=>{
                            selectPhoto()
                        }}>
                            {image ? <Image style={{height:'100%', width:'100%'}} source={{uri:image}} />
                            :
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Upload Image</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={()=>saveCategory()}>
                            <Text style={{ fontWeight: 'bold' }}>Save</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default AddCustomCategory;

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
    itemTitle: { marginLeft: 20, backgroundColor: '#FFFFFF', marginTop: -10, paddingHorizontal: 10 },
    uploadBtn: { justifyContent: 'center', alignItems: 'center', width: '100%', height: 180, borderWidth: 1, borderStyle: 'dashed', borderRadius: 20, marginTop: 20 },
    saveBtn: { borderRadius: 20, width: 150, borderWidth: 1, height: 40, marginTop: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    descInput: { padding: 20, borderRadius: 15, marginHorizontal: 20, height: 160, marginTop: 4 },
    viewDescription: { width: '100%', height: 180, borderWidth: 1, borderRadius: 20, marginTop: 20 },
    txtInput: { borderRadius: 15, marginHorizontal: 20, height: 40, marginTop: 4 },
    featuredBtn: { borderRadius: 20, width: 70, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    featuredBtnSelected: { borderRadius: 20, width: 70, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20,backgroundColor:'black' },
})
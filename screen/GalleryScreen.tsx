import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  Pressable,
} from 'react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useScrollToTop,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import {RootStackParamList} from '../navigation/Stack';
import firestore from '@react-native-firebase/firestore';
import MMKVStorage, {
  useMMKVStorage,
  MMKVLoader,
  useIndex,
} from 'react-native-mmkv-storage';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

import {PermissionsAndroid, Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

const GalleryScreen = () => {
  const [dataPhoto, setDataPhoto] = useState<CameraRoll.PhotoIdentifier[]>([]);

  const [imageSelected, setimageSelected] = useState<CameraRoll.PhotoIdentifier[]>([]);
  //state items sélectionnés - array items vide au départ où l'on va pouvoir ajouter ou désélectionner les items sélectionnés

  //item ici c'est juste ceux qui ont été pressé
  const onPressSelected = (item: CameraRoll.PhotoIdentifier) => {
    const result = imageSelected.includes(item);
    //La méthode includes() permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, false sinon.
    // ici on verifie si l'item est déjà présent ou non dans le tableau des imageSelected - si true oui si false non
    //1 2 3 4 5 6
    //true - si item déjà présent dans le tableau  2 3 5

    if (result === true) {
      //filtrer le tableau des images sélectionnées et retirer tous les items déjà présent
      setimageSelected(imageSelected.filter(e => e !== item));
    } else {
      //false - ces items non sont pas sélectionnés, donc on les ajoute dans le tableau des items déjà sélectionnés
      setimageSelected([...imageSelected, item]); //opérateur spread
    }
  };
  const isSelected = (item: CameraRoll.PhotoIdentifier): boolean => {
    return imageSelected.includes(item);
  };

  const FlatListItems = ({item}: {item: CameraRoll.PhotoIdentifier}) => {
    //console.log(imageSelected);
console.log(item)
    return (
      <View
        style={
          isSelected(item)
            ? styles.viewTouchableImgSelected
            : styles.viewTouchableImg
        }>
        <TouchableOpacity onPress={() => onPressSelected(item)}>
          <ImageBackground
            source={{uri: item.node.image.uri}}
            resizeMode="cover"
            style={styles.image}></ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const SupprimerStorageFirebase = () => console.log('coucou2');
  const EnregistrerStorageFirebase = () => console.log('coucou');

useEffect(() =>{
  CameraRoll.getPhotos({
    first: 9,
    assetType: 'Photos',
    include: ['filename'],
  })
    .then(
      //(toto) => console.log(toto.edges)
      toto => setDataPhoto(toto.edges),
    )
    .catch(err => {
      console.log(err);

      //Error Loading Images
    });
},[])


  //console.log(typeof dataPhoto);

  //console.log(dataPhoto);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList>>();
  const useremail = auth().currentUser?.email;

  //const defaultStorageBucket = storage();
  /*  const reference = storage().ref('IMG_20220718_140300.jpg');
  const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/IMG_20220718_140300.jpg`; */
  // uploads file
  /*  reference.putFile(pathToFile); */

  /*   const mmkvStorage = new MMKVLoader().initialize(); */

  //const postsIndex = useMMKVStorage("postsIndex", mmkvStorage); // ['post123','post234'];
  // Get the posts based on those ids.
  // const [posts,update,remove] = useIndex(postsIndex,"object" mmkvStorage);
  //console.log(postsIndex);

  return (
    <View style={styles.container}>
      {/*   <View>
      
        <TouchableOpacity style={styles.btn} onPress={() => handleButonPress()}>
          <Text style={styles.btnText}>Galerie</Text>
        </TouchableOpacity>
      </View> */}
      {/*   A faire   refreshing={true}  onEndReached={}      onEndReachedThreshold={0.5} */}
      <View style={styles.viewFlatlist}>
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between'}}
          numColumns={3}
          data={dataPhoto}
          // initialNumToRender={20}
          keyExtractor={item => item.node.timestamp.toString()}
          renderItem={FlatListItems}
        />
      </View>
      <View style={styles.viewBottomTab}>
        <View style={styles.viewButtonTab}>
          <TouchableOpacity onPress={SupprimerStorageFirebase}>
            <Text>Supprimer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewButtonTab}>
          <TouchableOpacity onPress={EnregistrerStorageFirebase}>
            <Text>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
{
  /* <Image
                style={{
                  width: 120,
                  height: 100,
                }}
                source={{uri: item.node.image.uri}}
              /> */
}
export default GalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  viewBottomTab: {
    flex: 1,
    flexDirection: 'row',
  },
  viewFlatlist: {
    flex: 9,
  },
  viewFlex1: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  viewTouchableImg: {
    flex: 1,
  },
  viewTouchableImgSelected: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.1,
  },
  viewButtonTab: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 30,
  },
  btnText: {
    color: 'white',
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});

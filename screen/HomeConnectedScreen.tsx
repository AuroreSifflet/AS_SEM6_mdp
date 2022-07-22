import React, {useState} from 'react';
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

const HomeConnectedScreen = () => {
 
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList>>();
  const useremail = auth().currentUser?.email;



  const mmkvStorage = new MMKVLoader().initialize();

  //const postsIndex = useMMKVStorage("postsIndex", mmkvStorage); // ['post123','post234'];
  // Get the posts based on those ids.
  // const [posts,update,remove] = useIndex(postsIndex,"object" mmkvStorage);
  //console.log(postsIndex);

  const onSubmit = () => {
    console.log('se déconnecter');
    /* se déconnecter */
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        /* Mauvais ! car attribut une chaîne de caractère vide mmkvStorage.setString("identifiant", undefined);
              mmkvStorage.setString("logPassword", ""); */
        mmkvStorage.clearStore();
        navigation.replace('ConnexionScreen');
      });
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity style={styles.btn} onPress={() => onSubmit()}>
          <Text style={styles.btnText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/*   affichage de l'email avec les paramêtre de route */}
      <View>
        <Text>Bonjour {route.params?.identifiant}</Text>
      </View>
      {/*   affichage de l'email avec firebase - auth().currentUser?.email */}
      <View>
        <Text>Welcome {useremail}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('AddPassword')}>
          <Text style={styles.btnText}>Ajouter un mot de passe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('ShowPassword')}>
          <Text style={styles.btnText}>Voir mes mots de passe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('GalleryScreen')}>
          <Text style={styles.btnText}>Galerie</Text>
        </TouchableOpacity>
      </View>
   
    </View>
  );
};

export default HomeConnectedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  viewFlatlist: {
    flex: 1,
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

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {Text, View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import {RootStackParamList} from '../../navigation/Stack';

type FormValues = {
  identifiant: string;
  password: string;
  namePlateform: string;
  typePlatform: string;
  key: string;
};

const ShowPassword = () => {
  const useremail = auth().currentUser?.email;
  const [loading, setLoading] = useState<boolean>(true); // Set loading to true on component mount
  const [users, setUsers] = useState<FormValues[]>([]); // Initial empty array of users

  const onResult =  (querySnapshot: any) =>{
    console.log('OnResult');
    const usersData: FormValues[] = [];
    //console.log('Total users: ', querySnapshot.size);
    querySnapshot.forEach((documentSnapshot: any) => {
      /*  console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
        documentSnapshot.id, documentSnapshot.data(); */
      let toto = documentSnapshot.data();
      usersData.push({
        identifiant: toto.identifiant,
        namePlateform: toto.namePlateform,
        password: toto.password,
        typePlatform: toto.typePlatform,
        key: documentSnapshot.id,
      });
    });
    setUsers(usersData);
    setLoading(false);
  }

  //function onError(error) {
  const onError = (error:any) => {
    console.error(error);
  }

  useEffect(() => {
    const user = auth().currentUser;

    if (user) {
      /* const user = firestore().collection('Users').doc('identifiantEmail').get(); */
      /* afficher les mdp */
      const tata = firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('compte')
        .onSnapshot(onResult, onError);
        return ()=> tata()
    }
  }, []);

  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList>>();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      identifiant: '',
      password: '',
    },
  });

  const onSubmit = (key: string) => {
    const user = auth().currentUser;
    console.log('toto' + key);

    if (user) {
      /* supprimer les mdp */
      firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('compte')
        .doc(key)
        .delete()
        .then(() => {
          console.log('22Mdlllp deleted!');
        });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Bonjour {useremail}</Text>
      </View>

      <View>
        {/* Flatlist */}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={users}
            renderItem={({item}) => (
              <View style={{flex: 1, margin: 10}}>
                <Text>Nom de la plateforme : {item.namePlateform}</Text>
                <Text>typePlatform : {item.typePlatform}</Text>
                <Text>Identifiant: {item.identifiant}</Text>
                <Text>Mot de passe : {item.password}</Text>
                <Button
                  title="Supprimer le mdp"
                  onPress={handleSubmit(() => onSubmit(item.key))}
                />
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default ShowPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gold',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
});

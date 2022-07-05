import * as React from 'react';
import {Text, View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import { RootStackParamList } from '../../navigation/Stack';

type FormValues = {
  identifiant: string;
  password: string;
  namePlateform: string;
  typePlatform: string;
  uid: string;
};
const AddPassword = () => {
  const useremail = auth().currentUser?.email;

  const navigation =
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      identifiant: '',
      password: '',
      namePlateform: '',
      typePlatform: '',
    
    },
  });

  
  //   const onSubmit = (data: string) => console.log(data);
  const onSubmit = ({namePlateform, typePlatform, identifiant, password,}: FormValues) => {
 const user = auth().currentUser;
/*  console.log(user); */

  if (user) {
    firestore()
    .collection('Users')
    .doc(user.uid)
    .collection('compte')
    .add({
      namePlateform: namePlateform,
      typePlatform: typePlatform,
      identifiant: identifiant,
      password: password,
      //uid: user.uid,

    })
    .then(() => {
      console.log('Bravo User added!');
      navigation.navigate('ShowPassword')
    })
  
  }
  };

 

  return (
    <View style={styles.container}>
      <View>
           <Text>Bonjour {useremail}</Text>
        </View>
      <View>

      <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Nom du site ou de l'application"
            />
          )}
          name="namePlateform"
        />
        {errors.identifiant && <Text>This is required.</Text>}

      <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Application, site web"
            />
          )}
          name="typePlatform"
        />
        {errors.identifiant && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Identifiant, veuillez indiquer un email"
            />
          )}
          name="identifiant"
        />
        {errors.identifiant && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            minLength: 8,
            maxLength: 20,
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Mot de passe"
            />
          )}
          name="password"
        />
     {/*    obliger à avoir Au moins 3 des 4 types suivants : majuscules minuscules chiffres caractères spéciaux */}

        {errors.password && errors.password.type === "required" && <Text>Veuillez indiquer un mot de passe</Text>}
        {errors.password && errors.password.type === "minLength"  && <Text>La longueur minimale du mot de passe est de huit caractères</Text>}
        {errors.password && errors.password.type === "minLength"  && <Text>La longueur maximale du mot de passe est de 20 caractères</Text>}

       



        {/* <Button title="Inscrivez-vous" onPress={() => onSubmit(identifiantEmail, password)} /> */}
        <Button title="Ajouter le mot de passe à la liste" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default AddPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gold',
    /*  alignItems: 'center',
      justifyContent: 'center', */
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
});

import * as React from 'react';
import {Text, View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import ReactNativeBiometrics from 'react-native-biometrics'
import MMKVStorage, {
  useMMKVStorage,
  MMKVLoader,
} from 'react-native-mmkv-storage';
import storage from '@react-native-firebase/storage';


type FormValues = {
  identifiantEmail: string;
  password: string;
};

const InscriptionScreen = () => {
  const mmkvStorage = new MMKVLoader().withEncryption().initialize();
  const [userIdentifiantBiometrics, setUserIdentifiantBiometrics] = useMMKVStorage<string>('userIdentifiantBiometrics', mmkvStorage);
  const [userPasswordBiometrics, setUserPasswordBiometrics] = useMMKVStorage<string>('userPasswordBiometrics', mmkvStorage,);
  const [userKeyBiometrics, setUserKeyBiometrics] = useMMKVStorage<string>('userKeyBiometrics', mmkvStorage,);


  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      identifiantEmail: '',
      password: '',
    },
  });
  //   const onSubmit = (data: string) => console.log(data);
  const onSubmit = ({identifiantEmail, password}: FormValues) => {


    auth()
      .createUserWithEmailAndPassword(identifiantEmail, password)
      .then(() => {
        auth().currentUser?.sendEmailVerification();
        //Génère une paire de clés publique privée RSA 2048 qui sera stockée dans le magasin de clés de l'appareil. Renvoie un Promisequi se résout en un objet fournissant des détails sur les clés.
        const rnBiometrics = new ReactNativeBiometrics()

        rnBiometrics.createKeys()
        .then((resultObject) => {
          const { publicKey } = resultObject
          console.log("coucou clé"+publicKey)
          setUserIdentifiantBiometrics(identifiantEmail);
          setUserPasswordBiometrics(password);
          setUserKeyBiometrics(publicKey);


          const MyUser = {
            identifiantEmail: identifiantEmail,
            password: password,
            publicKey: publicKey,
          };
          
          console.log(MyUser.identifiantEmail, MyUser.password, MyUser.publicKey)
        })
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };
  console.log("state" + userIdentifiantBiometrics + userPasswordBiometrics + userKeyBiometrics)
  return (
    <View style={styles.container}>
      {/*   <View>
       <Text>Inscription</Text>
       <Text>La page d’inscription. Elle permet de s’inscrire sur l’application. Les données devront être stockées dans la partie Authentification de Firebase.</Text>
 </View>
       */}
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
              placeholder="Identifiant, veuillez indiquer un email"
            />
          )}
          name="identifiantEmail"
        />
        {errors.identifiantEmail && <Text>This is required.</Text>}

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

        {/* <Button title="Inscrivez-vous" onPress={() => onSubmit(identifiantEmail, password)} /> */}
        <Button title="Inscrivez-vous" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default InscriptionScreen;

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

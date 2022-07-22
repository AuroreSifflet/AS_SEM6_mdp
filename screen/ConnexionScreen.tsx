import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import auth, {firebase} from '@react-native-firebase/auth';
import {RootStackParamList} from '../navigation/Stack';
import {useForm, Controller} from 'react-hook-form';
import MMKVStorage, {
  useMMKVStorage,
  MMKVLoader,
} from 'react-native-mmkv-storage';
// aurore.sifflet@gmail.com AuroreSifflet
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import { PermissionsAndroid, Platform } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";

type FormValues = {
  identifiant: string;
  password: string;
};

type BiometricsTypes = {
  userIdentifiantBiometrics: string;
  userPasswordBiometrics: string;
};

const ConnexionScreen = () => {
 /*  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
  
  async function savePicture() {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
  
    CameraRoll.save(tag, { type, album })
  };
 */




  const rnBiometrics = new ReactNativeBiometrics();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mmkvStorage = new MMKVLoader().withEncryption().initialize();

  const [user, setUser] = useMMKVStorage<string>('user', mmkvStorage);
  const [logPassword, setLogPassword] = useMMKVStorage<string>(
    'logPassword',
    mmkvStorage,
  );
  const [error, setError] = useState<string>();

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
  // user-not-found error
  const onSubmit = ({identifiant, password}: FormValues) => {
    auth()
      .signInWithEmailAndPassword(identifiant.trim(), password.trim())
      .then(() => {
        setUser(identifiant);
        setLogPassword(password);
        console.log('User account signed in!');
        navigation.navigate('HomeConnectedScreen', {identifiant});
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          //console.log('That email address is already in use!');
          setError('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          //console.log('That email address is invalid!');
          setError('That email address is invalid!');
        } else {
          setError(error.message);
        }
        console.error(error);
      });
  };

  const userIdentifiantBiometrics = mmkvStorage.getString(
    'userIdentifiantBiometrics',
  );
  const userPasswordBiometrics = mmkvStorage.getString(
    'userPasswordBiometrics',
  );
  const userKeyBiometrics = mmkvStorage.getString('userKeyBiometrics');

  console.log(
    'stateConnexion' +
      userIdentifiantBiometrics +
      userPasswordBiometrics +
      userKeyBiometrics,
  );

  /* touch id */

  //voir si la biometrics est supporté par le téléphone
  rnBiometrics.isSensorAvailable().then(resultObject => {
    const {available, biometryType} = resultObject;

    if (available && biometryType === BiometryTypes.TouchID) {
      console.log('TouchID is supported');
    } else if (available && biometryType === BiometryTypes.FaceID) {
      console.log('FaceID is supported');
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      console.log('Biometrics is supported');
    } else {
      console.log('Biometrics not supported');
    }
  });

  //Détecte si des clés ont déjà été générées et existent dans le magasin de clés. Renvoie un Promise qui se résout en un objet indiquant des détails sur les clés.
  /*   rnBiometrics.biometricKeysExist().then(resultObject => {
    const {keysExist} = resultObject;

    
  }); 
  }*/

  /* Invite l'utilisateur à saisir son empreinte digitale ou son identifiant de visage. Renvoie un Promise qui se résout si l'utilisateur fournit une biométrie valide ou annule l'invite, sinon la promesse est rejetée.
   **REMARQUE : Cela ne valide que les données biométriques d'un utilisateur. Cela ne doit pas être utilisé pour connecter un utilisateur ou s'authentifier auprès d'un serveur, utilisez plutôt createSignature. Il ne doit être utilisé que pour contrôler certaines actions de l'utilisateur au sein d'une application.
   */
  const onSubmitTouchId = () => {
    console.log('coucou');

    rnBiometrics
      .simplePrompt({promptMessage: "confirmer l'empreinte digitale"})
      .then(resultObject => {
        const {success} = resultObject;

        if (success) {
          if (typeof userIdentifiantBiometrics == 'string' && typeof userPasswordBiometrics == 'string') {
            console.log('successful biometrics provided');
            auth()
              .signInWithEmailAndPassword(
                userIdentifiantBiometrics,
                userPasswordBiometrics,
              )
              .then(() => {
                console.log('User account signed in!');
                navigation.navigate('HomeConnectedScreen', {
                  identifiant: userIdentifiantBiometrics,
                });
              })
              .catch(error => {
                if (error.code === 'auth/user-not-found') {
                  //console.log('That email address is already in use!');
                  setError('That email address is already in use!');
                } else if (error.code === 'auth/invalid-email') {
                  //console.log('That email address is invalid!');
                  setError('That email address is invalid!');
                } else {
                  setError(error.message);
                }
                console.error(error);
              });
          }
        } else {
          console.log('user cancelled biometric prompt');
        }
      })
      .catch(() => {
        console.log('biometrics failed');
      });
  };
  /* FIN - Invite l'utilisateur */

  React.useEffect(() => {
    if (user && logPassword) {
      navigation.navigate('HomeConnectedScreen', {identifiant: user});
    }
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text>
          I am {user} and I am {logPassword} years old.
        </Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('InscriptionScreen')}>
          <Text style={styles.btnText}>Inscription</Text>
        </TouchableOpacity>
        <Text>
          Elle permet de se connecter à l’application. La vérification devra se
          faire via Firebase. Si la connexion réussi rediriger vers une
          troisième pas qui affichera « Bonjour adresseMail »
        </Text>
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
              placeholder="Identifiant, veuillez indiquer un email"
              keyboardType="email-address"
            />
          )}
          name="identifiant"
        />

        <Controller
          control={control}
          rules={{
            minLength: 8,
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

        {errors.password && errors.password.type === 'required' && (
          <Text>Veuillez indiquer un mot de passe</Text>
        )}
        {errors.password && errors.password.type === 'minLength' && (
          <Text>
            La longueur minimale du mot de passe est de huit caractères
          </Text>
        )}
        {error !== '' && <Text>{error}</Text>}

        {/* <Button title="Inscrivez-vous" onPress={() => onSubmit(identifiantEmail, password)} /> */}
        <Button title="Connectez-vous" onPress={handleSubmit(onSubmit)} />
        <Button
          title="Mot de passe oublié"
          onPress={() => navigation.navigate('ForgotPassword')}
        />
        <Button title="Touch id" onPress={() => onSubmitTouchId()} />
      </View>
    </View>
  );
};

export default ConnexionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BB0000',
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
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
});

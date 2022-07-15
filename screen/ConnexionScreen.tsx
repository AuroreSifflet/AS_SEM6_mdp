import * as React from 'react';
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
  import auth, { firebase } from '@react-native-firebase/auth';
import { RootStackParamList } from '../navigation/Stack';
import {useForm, Controller} from 'react-hook-form';
import MMKVStorage, { useMMKVStorage, MMKVLoader } from "react-native-mmkv-storage"; 
// aurore.sifflet@gmail.com AuroreSifflet

type FormValues = {
  identifiant: string;
  password: string;
}; 

  const ConnexionScreen = () => {
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
      },
    });
    const storage = new MMKVLoader().initialize();

    const [user, setUser] = useMMKVStorage<string>("identifiant", storage);
    const [logPassword, setLogPassword] = useMMKVStorage<string>("logPassword", storage);

      const onSubmit = ({identifiant, password}: FormValues) => {
        auth()
          .signInWithEmailAndPassword(identifiant.trim(), password.trim())
          .then(() => {
            console.log('User account signed in!');
            navigation.navigate('HomeConnectedScreen', {identifiant})           
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
          setUser(identifiant);
          setLogPassword(password) 
        
        };
      /*   console.log(user + logPassword); */

      if(user && logPassword){
        
        navigation.navigate('HomeConnectedScreen', {identifiant:user})
      } 
       
      
    
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
            <Text>Elle permet de se connecter à l’application. La vérification devra se faire via Firebase. Si la connexion réussi rediriger vers une troisième pas qui affichera « Bonjour adresseMail »</Text>            
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
        <Button title="Connectez-vous" onPress={handleSubmit(onSubmit)} />
        <Button title="Mot de passe oublié" onPress={() => navigation.navigate('ForgotPassword')} />
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
  
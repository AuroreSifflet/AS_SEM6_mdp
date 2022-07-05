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
  import auth from '@react-native-firebase/auth';
import { RootStackParamList } from '../navigation/Stack';
import {useForm, Controller} from 'react-hook-form';
 

type FormValues = {
  identifiantEmail: string;
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
        identifiantEmail: '',
        password: '',
      },
    });
      const onSubmit = ({identifiantEmail, password}: FormValues) => {
        auth()
          .signInWithEmailAndPassword(identifiantEmail.trim(), password.trim())
          .then(() => {
            console.log('User account signed in!');
            navigation.navigate('HomeConnectedScreen', {identifiantEmail})
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
    
    return (
      <View style={styles.container}>
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
        {errors.password && errors.password.type === "minLength"  && <Text>La longueur maximale du mot de passe est de 20 caractères</Text>}

        {/* <Button title="Inscrivez-vous" onPress={() => onSubmit(identifiantEmail, password)} /> */}
        <Button title="Connectez-vous" onPress={handleSubmit(onSubmit)} />
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
  
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
import { RootStackParamList } from '../../navigation/Stack';
import {useForm, Controller} from 'react-hook-form';
 

type FormValues = {
  identifiant: string;
}; 

  const ForgotPassword = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const {
      control,
      handleSubmit,
      formState: {errors},
    } = useForm<FormValues>({
      defaultValues: {
        identifiant: '',
      },
    });


    const onSubmitResetPassword = ({identifiant}:FormValues) => {
      const user = auth().currentUser;
      if (user) {
        /* supprimer les mdp */
        firebase.auth().sendPasswordResetEmail(identifiant)
          .then(function() {
            // Password reset email sent.
          })
          .catch(function(error) {
            // Error occurred. Inspect error.code.
          });
      }
    };
    /* const SendEmailForgot = (value: FormValuesSendMail, navigation: any) => {
        //const auth = getAuth();
        console.log("get mail" + value.email)
        firebase.auth().sendPasswordResetEmail(value.email).then((response) => setIsGood(false));
    } */





/* 
      const onSubmit = ({identifiant}: FormValues) => {
        auth()
          .signInWithEmailAndPassword(identifiant.trim())
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
      }; */
    
    return (
      <View style={styles.container}>
       
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

       
 

        {/* <Button title="Inscrivez-vous" onPress={() => onSubmit(identifiantEmail, password)} /> */}
    
        <Button title="Mot de passe oublié" onPress={handleSubmit(onSubmitResetPassword)} />
      </View>






      </View>
    );
  };

  export default ForgotPassword;
  
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
  
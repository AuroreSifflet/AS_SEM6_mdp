import * as React from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/Stack';
import {useForm, Controller} from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type FormValues = {
  identifiant: string;
  password: string;
  namePlateform: string;
  typePlatform: string;
  uid: string;
};

/* const UpdatePassword: React.FC<FormValues> = () => { */
const UpdatePasswordScreen = () => {
  const useremail = auth().currentUser?.email;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList,"UpdatePasswordScreen">>();

  const [passwordVisible, setpasswordVisible] = React.useState<boolean>(true);

  const passwordShow = () => {
    setpasswordVisible(!passwordVisible); //toggle state of password
  };

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

  console.log('identifiant' + route.params?.identifiant);
  console.log('key' + route.params?.key);
  console.log('namePlatform' + route.params?.namePlateform);
  console.log('password' + route.params?.password);
  console.log('typePlatform' + route.params?.typePlatform);

  const namePlateformOld = route.params?.namePlateform;
  const typePlatformOld = route.params?.typePlatform;
  const identifiantOld = route.params?.identifiant;
  const passwordOld = route.params?.password;
  const keyOld = route.params?.key;

  //   const onSubmit = (data: string) => console.log(data);

  const onSubmit = ({
    namePlateform,
    typePlatform,
    identifiant,
    password,
  }: FormValues) => {
    const user = auth().currentUser;
    /*  console.log(user); */
    console.log('submit1' + namePlateformOld);

    if (user) {
      firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('compte')
        .doc(keyOld)
        .update({
          /*    namePlateform: namePlateform,
          typePlatform: typePlatform,
          identifiant: identifiant,
          password: password, */
          namePlateform: namePlateform || namePlateformOld,
          typePlatform: typePlatform || typePlatformOld,
          identifiant: identifiant || identifiantOld,
          password: password || passwordOld,
          //uid: user.uid,
        })
        .then(() => {
          console.log('submit2' + namePlateformOld);
          console.log('MOdifié!');
          navigation.navigate('ShowPassword');
        });
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
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={namePlateformOld}
            />
          )}
          name="namePlateform"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={typePlatformOld}
            />
          )}
          name="typePlatform"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={identifiantOld}
            />
          )}
          name="identifiant"
        />

        <Controller
          control={control}
          rules={{
            minLength: 8,
            maxLength: 20,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View>
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={passwordOld}
                secureTextEntry={passwordVisible}
              />

              <View style={styles.viewIcon}>
                <TouchableOpacity onPress={() => passwordShow()}>
                  {passwordVisible == false ? (
                    <MaterialCommunityIcons name="eye" size={18} color="blue" />
                  ) : (
                    <MaterialCommunityIcons
                      name="eye-off"
                      size={18}
                      color="blue"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
          name="password"
        />
        {/*    obliger à avoir Au moins 3 des 4 types suivants : majuscules minuscules chiffres caractères spéciaux */}

        {errors.password && errors.password.type === 'minLength' && (
          <Text>
            La longueur minimale du mot de passe est de huit caractères
          </Text>
        )}
        {errors.password && errors.password.type === 'minLength' && (
          <Text>La longueur maximale du mot de passe est de 20 caractères</Text>
        )}

        <Button title="Modifier le mdp" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default UpdatePasswordScreen;

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
  viewIcon: {
    backgroundColor: 'red',
    position: 'absolute',
    top: 10,
    right: 20,
    //alignItems: 'center',
    /* justifyContent: 'center', */
  },
});

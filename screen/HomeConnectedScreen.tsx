import * as React from 'react';
import {
 
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
  import {NativeStackNavigationProp} from '@react-navigation/native-stack';
  import auth from '@react-native-firebase/auth';
import { RootStackParamList } from '../navigation/Stack';
import firestore from '@react-native-firebase/firestore';


const HomeConnectedScreen = () => {

  const navigation =
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList>>();
  const useremail = auth().currentUser?.email;

  return (
    <View style={styles.container}>
      {/*   affichage de l'email avec les paramêtre de route */}
        <View>
           <Text>Bonjour {route.params?.identifiantEmail}</Text>
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
  });
  
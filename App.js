// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
// import { SafeAreaProvider  } from 'react-native-safe-area-context';

// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { enableFreeze } from 'react-native-screens';
// import { enableScreens } from 'react-native-screens';

// import "firebase/app"
// import "firebase/auth";
// import "firebase/database";
// import "firebase/firestore";
// import "firebase/functions";
// import "firebase/storage";

// import Test from './ScreensApp/test';

// enableFreeze(true);
// enableScreens(false);

// const Tab = createBottomTabNavigator();

const App = () => {
  
  // useEffect(() => {
  //   var firebaseConfig = {
  //     apiKey: "AIzaSyA0s17YydhIML__VSP9ccweB-NceuX3YrM",
  //     authDomain: "data-c9b1b.firebaseapp.com",
  //     databaseURL: "https://data-c9b1b-default-rtdb.firebaseio.com",
  //     projectId: "data-c9b1b",
  //     storageBucket: "data-c9b1b.appspot.com",
  //     messagingSenderId: "350431843221",
  //     appId: "1:350431843221:web:d5f5e438a9d3b965541c9c",
  //     measurementId: "G-TRTMHDPJSV"
  //   };
  //   if (getApps().length < 1) {
  //     initializeApp(firebaseConfig);
  //     console.log("\n Kết nối thành công \n");
  //     // Initialize other firebase products here
  //   }
  // }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestUserPermission();
    const enabled =
      authStatus == messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus == messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorized Status: ', authStatus);
    }
  }
  useEffect(() => {

    if (requestUserPermission()) {
      messaging().getToken().then(token => {
        console.log(token);
      });
    }
    else {
      console.log('Failed token status ', authStatus)
    }

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit',
            remoteMessage.notification,
          );
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log("Message handler in background", remoteMessage);
    });

    const unsubcribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A New FMC message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubcribe
  }, []);

  return (
    <Text>Hello</Text>
    // <NavigationContainer>
    //   <SafeAreaProvider>
    //     <View style={{flex:1}}>
    //       <Tab.Navigator>
    //         <Tab.Screen 
    //         name="Home" 
    //         options={{tabBarIcon: () => <Text>🌐</Text>,headerShown:false}}
    //         component={Test} />
    //         <Tab.Screen 
    //         name="Thông báo" 
    //         options={{tabBarIcon: () => <Text>🔔</Text>,headerShown:false}}
    //         component={Test} />
    //       </Tab.Navigator>
    //     </View>
    //   </SafeAreaProvider>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
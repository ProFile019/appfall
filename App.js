// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect,useState } from 'react';
import messaging from '@react-native-firebase/messaging';
// import { Ionicons } from '@expo/vector-icons';

// import  {createBottomTabNavigator}  from '@react-navigation/bottom-tabs';
import Home from './ScreensApp/Home';
// import  {SafeAreaProvider}   from 'react-native-safe-area-context';
// import  {NavigationContainer}  from '@react-navigation/native';

// import { enableFreeze } from 'react-native-screens';
// import { enableScreens } from 'react-native-screens';
// enableFreeze(true);
// enableScreens(false);

// const Tab = createBottomTabNavigator();


const App = () => {

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
  return(
      <Home/>
  );
}



export default App;
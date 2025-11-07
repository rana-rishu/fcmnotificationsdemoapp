import { View, Text, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const App = () => {
  useEffect(() => {
    requestpermissionandroid();
  }, []);

  const requestpermissionandroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission Granted');
      getToken();
    } else {
      Alert.alert('Permission Denied');
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  const onDisplayNotification = async remoteMessage => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'. // make sure this exists in mipmap
        color: '#FF0000',
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('token  : ', token);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
        Notification Demo
      </Text>
    </View>
  );
};

export default App;

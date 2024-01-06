import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        GetFCMToken();
    }
}

async function GetFCMToken() {
    console.log('Func started');
    let storedToken = await AsyncStorage.getItem('token');
    if (!storedToken) {
        try {
            let newToken = await messaging().getToken();
            if (newToken) {
                console.log('New token received:', newToken);
                await AsyncStorage.setItem('token', newToken);
            } else {
                console.log('Failed to get new token');
            }
        } catch (error) {
            console.log('Error in token generation:', error);
        }
    } else {
        console.log('Existing token found:', storedToken);
    }
}

export const NotificationListener = () =>  {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state',
            remoteMessage.notification,
        );
    });

    messaging().getDidOpenSettingsForNotification()
    .then(remoteMessage => {
        if(remoteMessage){
            console.log(
                'Notification caused app from quit',
                remoteMessage.notification,
            );
        };
    });

    messaging().onMessage(async remoteMessage => {
        console.log(
            'Notification on foreground state',
            remoteMessage
        );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });

}
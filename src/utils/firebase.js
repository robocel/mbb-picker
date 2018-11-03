import {default as firebaseSDK} from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let firebase = firebaseSDK.initializeApp({
    apiKey: "AIzaSyBXeLpiaVDLCp-O3_oXfwCExUfyMxnS9Ws",
    authDomain: "mbb-picker.firebaseapp.com",
    databaseURL: "https://mbb-picker.firebaseio.com",
    projectId: "mbb-picker",
    storageBucket: "mbb-picker.appspot.com",
    messagingSenderId: "637258031285"
});

export { firebaseSDK, firebase};

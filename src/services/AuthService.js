import { BehaviorSubject } from 'rxjs';

import { firebase, firebaseSDK } from '../utils/firebase';

let subject;

function init() {
    subject = new BehaviorSubject();

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            subject.next(user);
        }
    });
}

function getUser() {
    if (!subject) {
        init();
    }
    return subject;
}

function login() {
    if (!subject) {
        init();
    }

    firebase
        .auth()
        .setPersistence(firebaseSDK.auth.Auth.Persistence.LOCAL)
        .then(() => {
            const provider = new firebaseSDK.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            firebase
                .auth()
                .signInWithPopup(provider)
                .then(() => subject.next);
        });
}

function logout() {
    if (!subject) {
        init();
    }

    firebase
        .auth()
        .signOut()
        .then(() => subject.next(null));
}

export { getUser, logout, login };

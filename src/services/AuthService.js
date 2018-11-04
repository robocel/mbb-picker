import { BehaviorSubject } from 'rxjs';

import { firebase, firebaseSDK } from '../utils/firebase';

let subject;

let isLoggedIn = false;

function init() {
    subject = new BehaviorSubject();

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            login();
            isLoggedIn = true;
        } else {
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
                .then(function({ user }) {
                    subject.next(user);
                    isLoggedIn = true;
                });
        });
}

function logout() {
    if (!subject) {
        init();
    }

    firebase
        .auth()
        .signOut()
        .then(() => {
            subject.next(null);
            isLoggedIn = false;
        });
}

export { getUser, logout, login };

import { useEffect, useState } from 'react';
import { firebase, firebaseSDK } from '../utils/firebase';

export function useAuthUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        return firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                login();
            } else {
                setUser(user);
            }
        });
    }, []);

    function login() {
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
                        setUser(user);
                    });
            });
    }

    function logout() {
        firebase
            .auth()
            .signOut()
            .then(() => {
                setUser(null);
            });
    }

    return [user, logout, login];
}

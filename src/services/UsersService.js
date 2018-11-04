import { BehaviorSubject } from 'rxjs';
import { firebase } from '../utils/firebase';
import { getUser } from './AuthService';

let subject, ref, handle;

function init() {
    subject = new BehaviorSubject({});

    getUser().subscribe(user => {
        if (user) {
            ref = firebase.database().ref(`/users`);
            handle = ref.on('value', snapshot => {
                if (snapshot.val()) {
                    subject.next(snapshot.val());
                }
            });
        } else {
            if (handle) {
                ref.off('value', handle);
            }
            ref = null;
            handle = null;
            subject.next({});
        }
    });
}

export function getUsers() {
    if (!subject) {
        init();
    }
    return subject;
}

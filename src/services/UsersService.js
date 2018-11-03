import { BehaviorSubject } from 'rxjs';
import { firebase } from '../utils/firebase';

let subject;

function init() {
    subject = new BehaviorSubject({});
    const ref = firebase.database().ref(`/users`);
    ref.on('value', snapshot => {
        if (snapshot.val()) {
            subject.next(snapshot.val());
        }
    });
}

export function getUsers() {
    if (!subject) {
        init();
    }
    return subject;
}

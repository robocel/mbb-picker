import {BehaviorSubject, combineLatest} from 'rxjs';
import { first } from 'rxjs/operators';


import { firebase } from '../utils/firebase';
import { getUser } from './AuthService';

let ref, handle, subject;

export function addToQueue(team) {
    combineLatest(getUser(), getQueue()).pipe(first()).subscribe(
        ([user, queue]) => {
            if (!queue.includes(team)) {
                firebase.database().ref(`/queues/${user.uid}/${queue.length}`).set(team);
            }
        }
    );
}

export function setQueue(queue) {
    getUser().pipe(first()).subscribe(user => {
        firebase.database().ref(`/queues/${user.uid}/`).set(queue);
    });
}

export function removeFromQueue(team) {
    combineLatest(getUser(), getQueue()).pipe(first()).subscribe(
        ([user, queue]) => {
            let idx = queue.indexOf(team);
            if (idx !== -1) {
                firebase.database().ref(`/queues/${user.uid}/${idx}`).remove();
            }
        }
    );
}

function init() {
    subject = new BehaviorSubject([]);

    getUser().subscribe(user => {
        if (user) {
            ref = firebase.database().ref(`/queues/${user.uid}`);
            handle = ref.on('value', snapshot => {
                if (snapshot.val()) {
                    subject.next(snapshot.val());
                } else {
                    subject.next([]);
                }
            });
        } else {
            if (handle) {
                ref.off('value', handle);
            }
            ref = null;
            handle = null;
            subject.next([]);
        }
    });
}

export function getQueue() {
    if (!subject) {
        init();
    }
    return subject;
}

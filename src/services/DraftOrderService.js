import {BehaviorSubject} from 'rxjs';

import {firebase} from '../utils/firebase';
import {CURRENT_YEAR} from '../utils/currentYear';
import { getUser } from './AuthService';

const subjects = {};

let ref, handle;

function init(year) {
    subjects[year] = new BehaviorSubject([]);

    getUser().subscribe(user => {
        if (user) {
            ref = firebase.database().ref(`/draftorder/${year}`);
            handle = ref.on('value', snapshot => {
                if (snapshot.val()) {
                    subjects[year].next([...snapshot.val()]);
                }
            });
        } else {
            if (handle) {
                ref.off('value', handle);
            }
            ref = null;
            handle = null;
            subjects[year].next([]);
        }
    });
}

export function getDraftOrder(year = CURRENT_YEAR) {
    if (!subjects[year]) {
        init(year);
    }
    return subjects[year];
}

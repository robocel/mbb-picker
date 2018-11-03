import {BehaviorSubject} from 'rxjs';
import {firebase} from '../utils/firebase';
import {CURRENT_YEAR} from '../utils/currentYear';

const subjects = {};

function init(year) {
    subjects[year] = new BehaviorSubject([]);
    const ref = firebase.database().ref(`/picks/${year}`);
    ref.on('value', snapshot => {
        if (snapshot.val()) {
            subjects[year].next([...snapshot.val()]);
        }
    });
}

export function getPicks(year = CURRENT_YEAR) {
    if (!subjects[year]) {
        init(year);
    }
    return subjects[year];
}

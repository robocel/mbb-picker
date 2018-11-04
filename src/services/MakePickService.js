import { firebase } from '../utils/firebase';
import { CURRENT_YEAR } from '../utils/currentYear';

export default function makePick(teamname, pick) {
    firebase.database().ref(`/picks/${CURRENT_YEAR}/` + pick).set(teamname);
}

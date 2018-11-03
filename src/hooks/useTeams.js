import { useEffect, useState } from 'react';
import { firebase } from '../utils/firebase';

export function useTeams() {
    const [teams, setTeams] = useState();

    useEffect(() => {
        const ref = firebase.database().ref(`/teams`);
        const handle = ref.on('value', snapshot => setTeams(snapshot.val()));
        return () => ref.off('value', handle);
    }, []);

    return teams;
}

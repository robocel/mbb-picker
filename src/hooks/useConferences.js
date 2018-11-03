import { useEffect, useState } from 'react';
import { firebase } from '../utils/firebase';

export function useConferences() {
    const [conferences, setConferences] = useState();

    useEffect(() => {
        const ref = firebase.database().ref(`/conferences`);
        const handle = ref.on('value', snapshot => setConferences(snapshot.val()));
        return () => ref.off('value', handle);
    }, []);

    return conferences;
}

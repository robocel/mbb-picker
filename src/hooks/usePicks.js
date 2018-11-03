import { useEffect, useState } from 'react';
import { firebase } from '../utils/firebase';

import { CURRENT_YEAR } from '../utils/currentYear';

export function usePicks() {
    const [picks, setPicks] = useState([]);

    useEffect(() => {
        const ref = firebase.database().ref(`/picks/${CURRENT_YEAR}`);
        const handle = ref.on('value', snapshot => {
            if (snapshot.val()) {
                setPicks([...snapshot.val()]);
            }
        });
        return () => ref.off('value', handle);
    }, []);

    return picks;
}

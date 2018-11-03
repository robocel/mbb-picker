import { useEffect, useState } from 'react';
import { firebase } from '../utils/firebase';

import { CURRENT_YEAR } from '../utils/currentYear';

export function useDraftOrder() {
    const [draftorder, setDraftOrder] = useState([]);

    useEffect(() => {
        const ref = firebase.database().ref(`/draftorder/${CURRENT_YEAR}`);
        const handle = ref.on('value', snapshot => setDraftOrder([...snapshot.val()]));
        return () => ref.off('value', handle);
    }, []);

    return draftorder;
}

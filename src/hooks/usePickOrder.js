import { useEffect, useState } from 'react';
import { firebase } from '../utils/firebase';

export function usePickOrder() {
    const [pickorder, setPickOrder] = useState([]);

    useEffect(() => {
        const ref = firebase.database().ref(`/pickorder`);
        const handle = ref.on('value', snapshot => setPickOrder([...snapshot.val()]));
        return () => ref.off('value', handle);
    }, []);

    return pickorder;
}

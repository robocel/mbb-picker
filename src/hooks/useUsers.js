import { useEffect, useState } from 'react';
import { firebase } from '../utils/firebase';

export function useUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const ref = firebase.database().ref(`/users`);
        const handle = ref.on('value', snapshot => setUsers([...snapshot.val()]));
        return () => ref.off('value', handle);
    }, []);

    return users;
}

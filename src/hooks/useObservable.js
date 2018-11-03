import { useState, useEffect } from 'react';

export function useObservable(obs$, defaultVal) {
    const [val, setVal] = useState(defaultVal);

    useEffect(() => {
        const handle = obs$.subscribe(newVal => setVal(newVal));
        return () => handle.unsubscribe();
    }, []);

    return val;
}

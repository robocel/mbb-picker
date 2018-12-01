import React, { useState, useEffect } from 'react';
import { firebase } from '../utils/firebase';

export default function DraftRound({user}) {
    const [picks, setPicks] = useState([]);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [myPick, setMyPick] = useState('');

    console.log('user ', user);

    useEffect(() => {
        console.log('Effect launched');
        const order = firebase.database().ref('/draftorder/2018-2019');
        order.on('value', (snapshot) => {
            console.log('order received ', snapshot.val());
            setPicks([...snapshot.val()]);
        });

        const userRef = firebase.database().ref('/users');
        userRef.on('value', (snapshot) => {
            console.log('users received ', snapshot.val());
            setUsers([...snapshot.val()]);
        });

        const teamRef = firebase.database().ref('/teams');
        teamRef.on('value', (snapshot) => {
            console.log('teams received ', snapshot.val());
            setTeams([...Object.values(snapshot.val())]);
        });

        const draftRef = firebase.database().ref('/picks/2018-2019');
        draftRef.on('value', (snapshot) => {
            console.log('picks received ', snapshot.val());
            if (snapshot.val()) {
                setDrafts([...snapshot.val()]);
            } else {
                setDrafts([]);
            }
        });
    }, []);

    let handlePick = () => {
        if (myPick && drafts && (user.uid ===  users.find(user => user.id === picks[drafts.length]).uid)) {
            firebase.database().ref('/picks/2018-2019/' + drafts.length).set(myPick);
        }
    };

    let handleTeamChange = evt => {
        setMyPick(evt.target.value);
    };

    return (
        <React.Fragment>
            <h1>Results</h1>
            { (picks.length && users.length) ? picks.map((pick, idx) => <p className={user.uid ===  users.find(user => user.id === pick).uid ? 'me' : ''}>{idx} - {users.find(user => user.id === pick).name} - {drafts[idx]}</p>) : null}
            <select onChange={handleTeamChange}>
                { teams.filter(team => !drafts.find(draft => draft === team.name)).map(team => <option value={team.name}>{team.conference} - {team.name}</option>) }
            </select>
            <button onClick={handlePick}>Make Pick</button>
            <h1>End</h1>
        </React.Fragment>
    );
}

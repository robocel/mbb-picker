import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {
    Filter1Rounded,
    Filter2Rounded,
    Filter3Rounded,
    Filter4Rounded,
    Filter5Rounded,
    Filter6Rounded,
    Filter7Rounded,
    Filter8Rounded
} from '@material-ui/icons';

import { useObservable } from '../hooks/useObservable';
import { getPickList } from '../services/PickListService';

export default function RoundPicks(props) {
    const pickList = useObservable(getPickList(), []);

    const icons = [
        <Filter1Rounded />,
        <Filter2Rounded />,
        <Filter3Rounded />,
        <Filter4Rounded />,
        <Filter5Rounded />,
        <Filter6Rounded />,
        <Filter7Rounded />,
        <Filter8Rounded />
    ];

    return (
        <List>
            {pickList.slice(0,8).map(pick => (
                <ListItem key={pick.round*10 + pick.pickInRound}>
                    <ListItemIcon>{icons[pick.pickInRound - 1]}</ListItemIcon>
                    <ListItemText primary={pick.name} secondary={pick.team.name + ' - ' + pick.team.conference.name} />
                </ListItem>
            ))}
        </List>
    );
}

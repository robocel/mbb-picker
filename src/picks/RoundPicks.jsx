import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {
    Alarm,
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
        <List className="flex-grow">
            {pickList.slice(0, 8).map(pick => (
                <ListItem
                    key={pick.round * 10 + pick.pickInRound}
                    className={
                        (pick.isCurrentPick ? 'bg-orange-lightest ' : '') +
                        (pick.isLoggedInUser ? 'bg-green-lightest' : '')
                    }
                >
                    <ListItemIcon>{icons[pick.pickInRound - 1]}</ListItemIcon>
                    <ListItemText
                        primary={
                            pick.name + (pick.isCurrentPick ? ' (PICKING)' : '')
                        }
                        secondary={
                            pick.team.name
                                ? pick.team.name +
                                  ' - ' +
                                  pick.team.conference.name
                                : ''
                        }
                    />
                    {pick.isCurrentPick ? (
                        <ListItemSecondaryAction>
                            <Alarm />
                        </ListItemSecondaryAction>
                    ) : null}
                </ListItem>
            ))}
        </List>
    );
}

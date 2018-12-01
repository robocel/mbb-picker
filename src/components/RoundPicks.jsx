import React, {useState} from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
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
    const [round, setRound] = useState(2);

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
        <div className="pt-4 flex flex-col">
            <div className="px-4 flex flex-col">
                <FormControl variant="outlined">
                    <InputLabel htmlFor="conference-input">
                        Round
                    </InputLabel>
                    <Select
                        native
                        value={round}
                        onChange={evt => setRound(evt.target.value)}
                        input={
                            <OutlinedInput
                                name="conference-input"
                                id="conference-input"
                                labelWidth={100}
                            />
                        }
                    >
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
                            .map(round => (
                                <option key={round} value={round}>
                                    Round {round}
                                </option>
                            ))}
                    </Select>
                </FormControl>
            </div>
            <List className="flex-grow">
                {pickList.slice((round-1)*8, round*8).map(pick => (
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
        </div>
    );
}

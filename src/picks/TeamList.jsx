import React, { useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
//import ListItemIcon from '@material-ui/core/ListItemIcon';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';

import { useObservable } from '../hooks/useObservable';
import { getTeamList } from '../services/TeamListService';

const DEFAULT_RANKING = 'Top 25';

export default function TeamList(props) {
    const teamlist = useObservable(getTeamList(), []);
    const [conference, setConference] = useState(DEFAULT_RANKING);

    return (
        <div className="pt-4 flex flex-col">
            <div className="px-4 flex flex-col">
                <FormControl variant="outlined">
                    <InputLabel htmlFor="conference-input">
                        Conference
                    </InputLabel>
                    <Select
                        native
                        value={conference}
                        onChange={evt => setConference(evt.target.value)}
                        input={
                            <OutlinedInput
                                name="conference-input"
                                id="conference-input"
                                labelWidth={100}
                            />
                        }
                    >
                        <option value={DEFAULT_RANKING}>
                            {DEFAULT_RANKING}
                        </option>
                        {Array.from(
                            new Set(teamlist.map(team => team.conference.name))
                        )
                            .sort()
                            .map(conference => (
                                <option key={conference} value={conference}>
                                    {conference}
                                </option>
                            ))}
                    </Select>
                </FormControl>
            </div>
            <List>
                {teamlist
                    .filter(
                        team =>
                            conference === DEFAULT_RANKING
                                ? team.isRanked
                                : !conference ||
                                  team.conference.name === conference
                    )
                    .sort((a, b) => {
                        if (conference === DEFAULT_RANKING) {
                            if (a.ranking > b.ranking) {
                                return 1;
                            } else if (a.ranking === b.ranking) {
                                return 0;
                            } else {
                                return -1;
                            }
                        } else {
                            if (a.name > b.name) {
                                return 1;
                            } else if (a.name === b.name) {
                                return 0;
                            } else {
                                return -1;
                            }
                        }
                    })
                    .map(team => (
                        <ListItem
                            key={team.name}
                            className={
                                !team.isAvailable
                                    ? 'bg-red-lightest opacity-50	'
                                    : ''
                            }
                        >
                            <ListItemText
                                primary={
                                    team.name +
                                    (team.isRanked ? ` (${team.ranking})` : '')
                                }
                                secondary={
                                    team.conference.name +
                                    (!team.isAvailable
                                        ? ' | Owner: ' + team.ownedBy
                                        : '')
                                }
                            />
                        </ListItem>
                    ))}
            </List>
        </div>
    );
}

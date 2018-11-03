import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';

import { useTeamList } from '../hooks/useTeamList';

export default function TeamList(props) {
    const teamlist = useTeamList();

    const [conference, setConference] = useState('');

    let inputRef;

    return (
        <div className="pt-4 flex flex-col">
            <div className="px-4 flex flex-col">
            <FormControl variant="outlined">
                <InputLabel htmlFor="conference-input">Conference</InputLabel>
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
                    <option value="" />
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
                {teamlist.filter(team => !conference || team.conference.name === conference).map(team => (
                    <ListItem key={team.name}>
                        <ListItemText
                            primary={team.name}
                            secondary={team.conference.name}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

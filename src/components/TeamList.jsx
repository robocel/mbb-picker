import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';

import AddIcon from '@material-ui/icons/Add';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { useObservable } from '../hooks/useObservable';
import { getTeamList } from '../services/TeamListService';
import { getPickList } from '../services/PickListService';
import { getQueue } from '../services/QueueService';
import makePick from '../services/MakePickService';
import { addToQueue } from '../services/QueueService';
import SpecialFabButton from './SpeciaFabButton';

const DEFAULT_RANKING = 'Best Available (NET)';

const styles = theme => ({
    fab: {
        position: 'fixed',
        color: 'white',
        'background-color': 'green',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    },
    fabq: {
        position: 'fixed',
        color: 'white',
        'background-color': 'red',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    }
});

export default withStyles(styles, { withTheme: true })(function TeamList(
    props
) {
    const teamlist = useObservable(getTeamList(), []);
    const picklist = useObservable(getPickList(), []);
    const queue = useObservable(getQueue(), []);
    const [selectedTeam, setSelectedTeam] = useState();
    const [snackBarOpen, setSnackbarOpen] = useState(false);
    const [conference, setConference] = useState(DEFAULT_RANKING);

    const myTurnToPick = picklist.some(
        (pick, idx) => pick.isLoggedInUser && pick.isCurrentPick && idx < 104
    );

    const currentPick = picklist.findIndex(pick => pick.isCurrentPick);

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
                    .filter(team =>
                        conference === DEFAULT_RANKING
                            ? team.isRanked
                            : !conference || team.conference.name === conference
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
                        <React.Fragment key={team.name}>
                            <ListItem
                                button
                                selected={
                                    selectedTeam &&
                                    selectedTeam.name === team.name
                                }
                                onClick={() =>
                                    selectedTeam === team
                                        ? setSelectedTeam()
                                        : setSelectedTeam(team)
                                }
                                className={
                                    !team.isAvailable ||
                                    queue.includes(team.name)
                                        ? 'opacity-50'
                                        : ''
                                }
                            >
                                <ListItemText
                                    primary={
                                        team.name +
                                        (team.isRanked
                                            ? ` (${team.ranking})`
                                            : '') +
                                        (queue.includes(team.name)
                                            ? ' - IN QUEUE'
                                            : '')
                                    }
                                    secondary={
                                        team.conference.name +
                                        (!team.isAvailable
                                            ? ' | Owner: ' + team.ownedBy
                                            : '')
                                    }
                                />
                                {team.history.length ? (
                                    selectedTeam === team ? (
                                        <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                    )
                                ) : null}
                            </ListItem>
                            {team.history.length ? (
                                <Collapse
                                    in={selectedTeam === team}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        {team.history.map(pick => (
                                            <ListItem key={pick.year}>
                                                <ListItemText
                                                    inset
                                                    primary={`${pick.year} (${
                                                        pick.owner
                                                    })`}
                                                    secondary={`Round ${
                                                        pick.round
                                                    } Pick ${pick.pick}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            ) : null}
                        </React.Fragment>
                    ))}
            </List>
            <SpecialFabButton pid="fabRoot">
                <Zoom
                    in={
                        (myTurnToPick &&
                            selectedTeam &&
                            selectedTeam.isAvailable) ||
                        (selectedTeam &&
                            selectedTeam.isAvailable &&
                            !queue.includes(selectedTeam.name))
                    }
                    timeout={{
                        enter: props.theme.transitions.duration.enteringScreen,
                        exit: props.theme.transitions.duration.leavingScreen
                    }}
                    unmountOnExit
                >
                    <Button
                        variant="fab"
                        color="inherit"
                        className={
                            myTurnToPick
                                ? props.classes.fab
                                : props.classes.fabq
                        }
                        onClick={() => {
                            if (myTurnToPick) {
                                makePick(selectedTeam.name, currentPick);
                            } else {
                                addToQueue(selectedTeam.name);
                            }
                            setSnackbarOpen(true);
                        }}
                    >
                        <AddIcon />
                    </Button>
                </Zoom>
            </SpecialFabButton>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                message={
                    <span>
                        Successfully {myTurnToPick ? 'selected ' : 'queued '}
                        {selectedTeam && selectedTeam.name}
                    </span>
                }
            />
        </div>
    );
});

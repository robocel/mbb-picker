import React, { useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import QueueIcon from '@material-ui/icons/FormatListNumbered';

import { useObservable } from '../hooks/useObservable';
import { getUser, logout, login } from '../services/AuthService';
import { getQueue } from '../services/QueueService';
import RoundPicks from './RoundPicks';
import TeamQueue from './TeamQueue';
import TeamList from './TeamList';

function AppWrapper() {
    const user = useObservable(getUser());
    const queue = useObservable(getQueue(), []);
    const [tab, setTab] = useState(0);

    const handleTabChange = (_, value) => {
        setTab(value);
    };

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        color="inherit"
                        className="flex-grow"
                    >
                        Draft Center
                    </Typography>
                    {user ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={login}
                        >
                            Login
                        </Button>
                    )}
                    <Badge className="ml-4" invisible={queue.length === 0} badgeContent={queue.length} color="secondary">
                        <QueueIcon onClick={() => setTab(2)} />
                    </Badge>
                </Toolbar>
            </AppBar>
            {user ? (
                <React.Fragment>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={tab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                        >
                            <Tab label="Round Picks" />
                            <Tab label="Team List" />
                            <Tab label="My Queue" />
                        </Tabs>
                    </AppBar>
                    {tab === 0 ? <RoundPicks /> : tab === 1 ? <TeamList /> : <TeamQueue />}
                    <div
                        className={tab !== 1  ? 'hidden' : ''}
                        id="fabRoot"
                    />{' '}
                </React.Fragment>
            ) : (
                <div className="flex flex-col flex-grow justify-center items-center content-center">
                    <Button variant="contained" color="primary" onClick={login}>
                        Login
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
}

export default AppWrapper;

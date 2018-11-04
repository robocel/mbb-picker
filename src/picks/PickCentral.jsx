import React, { useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

import { useObservable } from '../hooks/useObservable';
import { getUser, logout, login } from '../services/AuthService';
import RoundPicks from './RoundPicks';
import TeamList from './TeamList';

function PickCentral() {
    const user = useObservable(getUser());
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
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        index={tab}
                        onChangeIndex={setTab}
                        animateHeight
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1
                        }}
                        containerStyle={{
                            flexGrow: 1
                        }}
                    >
                        <RoundPicks />
                        <TeamList />
                    </SwipeableViews>
                    <div className={tab === 0 ? 'hidden' : ''} id="fabRoot" />{' '}
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

export default PickCentral;

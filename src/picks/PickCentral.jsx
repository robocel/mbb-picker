import React, { useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

import { withStyles } from '@material-ui/core/styles';
import { useAuthUser } from '../hooks/useAuthUser';
import RoundPicks from './RoundPicks';
import TeamList from './TeamList';

const styles = {
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
};

function PickCentral(props) {
    const [user, logout, login] = useAuthUser();
    const [tab, setTab] = useState(0);
    const handleTabChange = (_, value) => {
        setTab(value);
    }
    const { classes } = props;
    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        color="inherit"
                        className={classes.grow}
                    >
                        Draft Center
                    </Typography>
                    {user ? (
                        <Button variant="contained" color="primary" onClick={logout}>Logout</Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={login}>Login</Button>
                    )}
                </Toolbar>
            </AppBar>
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
                axis="x"
                index={tab}
                onChangeIndex={setTab}
            >
                <RoundPicks />
                <TeamList />
            </SwipeableViews>
        </React.Fragment>
    );
}

export default withStyles(styles)(PickCentral);

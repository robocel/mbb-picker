import { useState } from 'react';

import { useAuthUser } from './useAuthUser';
import { useConferences } from './useConferences';
import { useDraftOrder } from './useDraftOrder';
import { usePickOrder } from './usePickOrder';
import { usePicks } from './usePicks';
import { useTeams } from './useTeams';
import { useUsers } from './useUsers';

export function usePickList() {
    const [picklist, setPickList] = useState([]);

    const [user] = useAuthUser();
    const conferences = useConferences();
    const draftorder = useDraftOrder();
    const pickorder = usePickOrder();
    const picks = usePicks();
    const teams = useTeams();
    const users = useUsers();

    if (!picklist.length && draftorder.length && users.length && teams && conferences) {
        setPickList(
            pickorder.map((draftorderNumber, pickNumber) => {
                const pickUser = users[draftorder[draftorderNumber - 1]-1];
                const teamName = picks[pickNumber];
                const team = {
                    name: '',
                    conference: {
                        abbreviation: '',
                        name: ''
                    }
                };

                if (teamName) {
                    const conference = teams[teamName.replace('.', '')].conference;

                    team.name = teamName;
                    team.conference.abbreviation = conference;
                    team.conference.name = conferences[conference].name;
                }
                return {
                    round: Math.floor(pickNumber / 8 + 1),
                    pickInRound: (pickNumber % 8) + 1,
                    name: pickUser.name,
                    team,
                    isLoggedInUser: pickUser.uid === user.uid,
                    isCurrentPick: pickNumber === picks.length
                };
            })
        );
    }

    return picklist;
}

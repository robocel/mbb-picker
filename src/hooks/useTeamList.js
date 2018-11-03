import { useState } from 'react';

import { useConferences } from './useConferences';
import { useDraftOrder } from './useDraftOrder';
import { usePickOrder } from './usePickOrder';
import { usePicks } from './usePicks';
import { useTeams } from './useTeams';
import { useUsers } from './useUsers';

export function useTeamList() {
    const [teamlist, setTeamList] = useState([]);

    const conferences = useConferences();
    const draftorder = useDraftOrder();
    const pickorder = usePickOrder();
    const picks = usePicks();
    const teams = useTeams();
    const users = useUsers();

    if (
        !teamlist.length &&
        pickorder.length &&
        draftorder.length &&
        users.length &&
        teams &&
        conferences
    ) {
        setTeamList(
            Object.values(teams).map(team => {
                const allPicks = picks || []
                const isAvailable = allPicks.indexOf(team.name) === -1;
                const ownedBy = isAvailable ? '' : users[draftorder[pickorder[allPicks.indexOf(team.name)]] - 1].name
                return {
                    isAvailable,
                    ownedBy,
                    name: team.name,
                    conference: {
                        abbreviation: team.conference,
                        name: conferences[team.conference].name
                    }
                };
            })
        );
    }

    return teamlist;
}

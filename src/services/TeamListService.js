import { combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { getConferences } from './ConferenceService';
import { getDraftOrder } from './DraftOrderService';
import { getPickOrder } from './PickOrderService';
import { getPicks } from './PickService';
import { getTeams } from './TeamService';
import { getUsers } from './UsersService';
import { getRankings } from './RankingsService';

let teamlist$;

// let user = {
//     uid: 'BTqFKjoqV0S3Bm4zj2636z9ItI23'
// };

function init() {
    teamlist$ = combineLatest(
        getConferences(),
        getDraftOrder(),
        getPickOrder(),
        getPicks(),
        getTeams(),
        getUsers(),
        getRankings(),
    ).pipe(
        filter(([conferences, draftorder, pickorder,, teams, users]) => {
            return (
                pickorder.length &&
                draftorder.length &&
                users.length &&
                teams &&
                conferences
            );
        }),
        map(([conferences, draftorder, pickorder, picks, teams, users, rankings]) => {
            return Object.values(teams).map(team => {
                const allPicks = picks || [];
                const isAvailable = allPicks.indexOf(team.name) === -1;
                const ownedBy = isAvailable
                    ? ''
                    : users[
                          draftorder[pickorder[allPicks.indexOf(team.name)] - 1] - 1
                      ].name;
                const isRanked = rankings.indexOf(team.name) !== -1;
                const ranking = isRanked ? rankings.indexOf(team.name) + 1 : undefined;
                return {
                    isAvailable,
                    ownedBy,
                    name: team.name,
                    conference: {
                        abbreviation: team.conference,
                        name: conferences[team.conference].name
                    },
                    isRanked,
                    ranking
                };
            });
        })
    );
}

export function getTeamList() {
    if (!teamlist$) {
        init();
    }
    return teamlist$;
}

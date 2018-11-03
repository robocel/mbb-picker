import { combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { getConferences } from './ConferenceService';
import { getDraftOrder } from './DraftOrderService';
import { getPickOrder } from './PickOrderService';
import { getPicks } from './PickService';
import { getTeams } from './TeamService';
import { getUsers } from './UsersService';

let picklist$;

let user = {
    uid: 'BTqFKjoqV0S3Bm4zj2636z9ItI23'
};

function init() {
    picklist$ = combineLatest(
        getConferences(),
        getDraftOrder(),
        getPickOrder(),
        getPicks(),
        getTeams(),
        getUsers()
    ).pipe(
        filter(([conferences, draftorder, pickorder, picks, teams, users]) => {
            return draftorder.length && users.length && teams && conferences;
        }),
        map(([conferences, draftorder, pickorder, picks, teams, users]) => {
            return pickorder.map((draftorderNumber, pickNumber) => {
                const pickUser = users[draftorder[draftorderNumber - 1] - 1];
                const teamName = picks[pickNumber];
                const team = {
                    name: '',
                    conference: {
                        abbreviation: '',
                        name: ''
                    }
                };

                if (teamName) {
                    const conference =
                        teams[teamName.replace('.', '')].conference;

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
            });
        })
    );
}

export function getPickList() {
    if (!picklist$) {
        init();
    }
    return picklist$;
}

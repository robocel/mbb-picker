const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.makeFollowupPicks = functions.database.ref('/picks/2018-2019/{pickId}').onCreate(async (snapshot, context) => {
    let nextPickIndex = parseInt(context.params.pickId) + 1;

    let currentPick = snapshot.val();
    let nextPickId = (await snapshot.ref.root.child(`pickorder/${nextPickIndex}`).once('value')).val();
    let nextPickUserId = (await snapshot.ref.root.child(`draftorder/2018-2019/${nextPickId - 1}`).once('value')).val();
    let nextUserId = (await snapshot.ref.root.child(`users/${nextPickUserId - 1}/uid`).once('value')).val();

    let allQueues = (await snapshot.ref.root.child(`queues`).once('value')).val();
    let nextUserPick;
    let queueEdits = [];

    for (const uid in allQueues) {
        let newQueue = allQueues[uid].filter(t => t !== currentPick);
        if (allQueues[uid].length !== newQueue.length) {
            queueEdits.push(snapshot.ref.root.child('queues').child(uid).set(newQueue));
        }
        if (uid === nextUserId) {
            nextUserPick = newQueue[0];
        }
    }

    await Promise.all(queueEdits);

    if (nextUserPick) {
        return snapshot.ref.parent.child(nextPickIndex).set(nextUserPick);
    } else {
        return true;
    }
});

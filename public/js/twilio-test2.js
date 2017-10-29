const Video = Twilio.Video;
var token = '';
var _room;

// Obtain a token from the server in order to connect to the Room.
$.getJSON('/token/Fritz', function(data) {
    token = data.token;

    Video.connect(token, { name: 'crazyRoom' }).then(room => {
        _room = room;
        console.log('Connected to Room "%s"', room.name);

        // add youreself to the ui
        participantConnected(room.localParticipant);


        room.participants.forEach(participantConnected);
        room.on('participantConnected', participantConnected);

        room.on('participantDisconnected', participantDisconnected);
        room.once('disconnected', error => room.participants.forEach(participantDisconnected));
    });

});



function participantConnected(participant) {
    console.log('Participant "%s" connected', participant.identity);

    const div = document.createElement('div');
    div.id = participant.sid;
    div.innerText = participant.identity;

    participant.on('trackAdded', track => trackAdded(div, track));
    participant.tracks.forEach(track => trackAdded(div, track));
    participant.on('trackRemoved', trackRemoved);

    document.body.appendChild(div);
}

function participantDisconnected(participant) {
    console.log('Participant "%s" disconnected', participant.identity);

    participant.tracks.forEach(trackRemoved);
    document.getElementById(participant.sid).remove();
}

function trackAdded(div, track) {
    div.appendChild(track.attach());
}

function trackRemoved(track) {
    track.detach().forEach(element => element.remove());
}
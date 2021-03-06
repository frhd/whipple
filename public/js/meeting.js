// Seperation of Ui and function
// ############################################################################
const leftPanel = '#leftPanel';
const sideStreamContainer = 'SideStreamContainer';
const sideStreamContent = 'SideStreamContent';
// used for displaying the queue position
const sideStreamQueueUi = 'smallStreamQueueUi';
// the waiting list is displayed here
const queueUi = 'queueUiUsers';
const talkTimeLeftUi = 'timeLeft';

const talkerContent = 'talkerPlaceholderContent';

const btnAnalyticsDownload = "btn_analytics";

const btnToggleVideo = 'btn_toggle_video';



// Audio Files
// ############################################################################
let talkingSound = new Audio('/res/confirmation1.mp3');
let doneTalkingSound = new Audio('/res/disconnect.mp3');
let superpowerSound = new Audio('/res/gong1.mp3');
let queueInSound = new Audio('/res/queueIn.mp3');
let queueOutSound = new Audio('/res/queueOut.mp3');
let notificationSound = new Audio('/res/notification.mp3');
let joinSound = new Audio('/res/userjoin.mp3');
let alarmSound = new Audio('/res/alarm.mp3');



// volume adjustments
let vol = 0.1;
talkingSound.volume = vol;
doneTalkingSound.volume = vol;
superpowerSound.volume = vol;
queueInSound.volume = vol;
queueOutSound.volume = vol;
notificationSound.volume = vol + 0.2;
joinSound.volume = vol;
alarmSound.volume = vol + 0.2;



let session;

// used for ui adjusting
let prevTalker;

// used for managing talk time warning messages (could be solved nicer)
let alreadyWarnedAt;




class Meeting {
    constructor() {
        this.users = [];
        this.myPublisher = undefined;

        this.getUsers = this.getUsers.bind(this);
        this.addUser = this.addUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.getMaster = this.getMaster.bind(this);
        this.amIMaster = this.amIMaster.bind(this);
    }

    getUsers() {
        return this.users;
    }

    addUser(stream) {
        this.users.push(stream);
        this.users = this.users.sort(function(a, b) {
            return (a.creationTime - b.creationTime);
        });

    }

    removeUser(stream) {
        let index = this.users.indexOf(stream);

        if (index > -1) {
            this.users.splice(index, 1);
        }

        this.users = this.users.sort(function(a, b) {
            return (a.creationTime - b.creationTime);
        });

    }


    getMaster() {
        return this.getUsers()[0];
    }

    amIMaster() {
        if (!this.myPublisher) {
            return false;
        } else {
            return (this.getMaster() == this.myPublisher.stream);
        }
    }
}

let m = new Meeting();


m.queue = [];
m.talkerEndTime = null;
m.config = {
    maxTalkingTime: 90,
    talkTimeAfterNewUserInQueue: 20,
    youTalkedForMessageInterval: 999,
    superpowers: 3,
    extendTalkTimeBy: 20,
    audioOnly: false,
    maxUsersPerRoom: 8
    //audioOnly: audioOnly // ToDo: decide if audio only is useful at all
};

// Meeting Tracking / Analytics
m.analytics = "order;name;seconds\n";
m.talkingOrder = 0;
m.talkerStartedAt = null;

// inaitialize left superpowers
m.superpowersLeft = m.config.superpowers;

// timestamp synchronizing (difference to master in miliseconds)
m.timeCorrection = 0;

// keep track of afk users
m.afkUsers = [];



$(document).ready(function() {

    // get username directly in the meeting
    // This change is due to the new way to join/create meeting rooms

    swal({
            title: "Username",
            type: "info",
            text: "please enter your name",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top",
            inputPlaceholder: "your name"
        },
        function(inputValue){
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("You need to enter a name");
                return false
            }
            // remove special characters
            userName = inputValue.replace(/[^\w\s]/gi, '');

            // initialize meeting
            initializeMeeting();

        });


});

function initializeMeeting(){

    initializeSession();
    console.log("initialized");

    // disable all Buttons for so that nobody can do stuff before the everything is up and running
    $('.btn-group button').attr('disabled', true);


    // enable bootstrap tooltips
    // $('[data-toggle="tooltip"]').tooltip();

    // tooltips should disapear when button was clicked
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });


    // show tips on how to contro, a meeting
    /*
    swal({
        title: "Getting started",
        text: `Use <i class="
        fa fa-hand-pointer-o "></i> or <kbd>space</kbd> to start talking! More Information on <i class="
        fa fa-info "></i>`,
        html: true
    });
    */


    // Set Iframe URL for Etherpad
    $("#etherpad-iframe").attr("src","https://whipple-etherpad.herokuapp.com/p/"+ sessionName +"?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false");

    // jquery ui
    $("#draggable-notes").draggable();
    //$("#notes-container").resizable();
    $("#etherpad-container").resizable();
    $("#draggable-etherpad").draggable();





    // Ui sizing stuff
    //$(talkerPlaceholderContent).height($(talkerPlaceholderContent).width() * 0.8);

    // Disable Video Button if it's an audio only meeting
    //$("#" + btnToggleVideo).prop("disabled", true);
}


// Initialize Session
// ############################################################################
// Handle TokBox Errors by passing them to the console
function handleError(error) {
    if (error) {
        log("TOKBOX: " + error.message);
    }
}

function initializeSession() {

    session = OT.initSession(apiKey, sessionId);
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        // if someone is talking
        //if (talksNow != null) {
        //    signalQueueStatus();
        //}
        // Create HTML for Subscribing
        m.addUser(event.stream);
        addStreamToHTML(event.stream.streamId, event.stream.name);
        //var element = uiStreamContainer.replace("#", "") + event.stream.name;
        let element = sideStreamContent + event.stream.streamId;
        session.subscribe(event.stream, element, {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            fitMode: 'cover'

        }, handleError);

        // signal Status update to get new users up and running
        if (m.amIMaster()) {
            console.log("Status update signaled because of new user");
            signalStatusUpdate(m.queue);
            signalAfkUsersArray();
        }

        // play joining sound
        joinSound.play();

    });

    // React to destroyed Stream
    session.on("streamDestroyed", function(event) {
        // Remove affected Stream Container from DOM
        var element = sideStreamContainer + event.stream.streamId;
        $("#" + element).remove();

        // clean exit of user
        m.removeUser(event.stream);
        if (m.amIMaster()) {
            console.log("Master caught user leaving");
            if (m.queue.indexOf(event.stream.streamId) != -1) {
                // leave queue clean
                handleTalkAction(event.stream.streamId);
            }

            // remove user from queue
            //let newQueue = m.queue.filter(function(e) {
            //    return e !== event.stream.streamId
            //});
            //m.queue = newQueue;
            // queue is not empty, set new endtime for talker
            //if (m.queue.length > 0) {
            //    let talkingStartedAt = new Date().getTime();
            //    m.talkerEndTime = talkingStartedAt + (1000 * m.config.maxTalkingTime);
            //}
            //signalStatusUpdate(newQueue);
        }


    });

    // Create a publisher
    // Create HTML for Publisher
    addStreamToHTML("default", userName, true);
    //var element = uiStreamContainer.replace("#", "") + myFullUserName;
    //let element = `SideStreamContainer${event.stream.streamId}`; // TODO ui von code trennen

    //let element = $('SideStreamContainerdefault .smallStreamContent').first();
    //let el = $('#publisher .smallStreamContent');
    let element = sideStreamContent + 'default';
    let myPublisher = OT.initPublisher(element, {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        fitMode: 'cover',
        name: userName,

    });
    m.myPublisher = myPublisher;

    myPublisher.setStyle('audioLevelDisplayMode', 'on');
    myPublisher.setStyle('buttonDisplayMode', 'off')
    myPublisher.on('audioLevelUpdated', function(event) {
        //currentAudioLevel = event.audioLevel;
        //log("Audio Level " + currentAudioLevel);
        //if (audioLevel > 0.2) {
        //log(" Currently talking. audioLevel " + event.audioLevel);
        //}
    });

    function publishStream() {

        session.publish(myPublisher).on("streamCreated", function(event) {
            // check if room is already full
            // it's not nice to kick a user out after he entered his name, but is is for now the easiest way
            console.log("total users " + m.getUsers().length);
            if(m.getUsers().length >=  m.config.maxUsersPerRoom){

                swal({
                        title: "Sorry...",
                        text: "This room is already at max capacity, please choose a different room",
                        type: "error",
                        showCancelButton: false,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "ok",
                        closeOnConfirm: false
                    },
                    function(){
                        window.location.replace("http://whipple.io");
                    });
            }

            //log(myUserName + " started publishing Stream " + myPublisher.stream.streamId);
            // enter meeting with audio turned off
            myPublisher.publishAudio(false);
            myPublisher.publishVideo(!m.config.audioOnly);
            m.addUser(myPublisher.stream);

            // correct IDs of publisher (overwrite defaults)
            $('#SideStreamContentdefault').attr('id', 'SideStreamContent' + myPublisher.stream.streamId);
            $('#SideStreamContainerdefault').attr('id', 'SideStreamContainer' + myPublisher.stream.streamId);
            // enable buttons
            $('.btn-group button').attr('disabled', false);

        });
    }

    session.connect(token, publishStream);
    // Which function to call if a signal is received
    session.on("signal", receiveSignal);


}


// Signals
// ############################################################################


// Fired if you click the Let me talk Button
function signalTalkAction() {
    console.log("You dispatched a signalLetMeTalk");
    session.signal({
        data: "talkAction#" + m.myPublisher.stream.streamId
    });
}

// This directly lets you talk for the given amount of time, independet of the queue
function signalTalkActionManual(){
    console.log("You dispatched a signalLetMeTalkManual");
    session.signal({
        data: "talkActionManual#" + m.myPublisher.stream.streamId + "#" + m.config.talkTimeAfterNewUserInQueue
    });
}

// Fired if you click the done talking button
function signalDoneTalking() {
    //log("You dispatched a signalDoneTalking");
    session.signal({
        data: "doneTalking#" + m.myPublisher.stream.streamId
    });
}


// Signal Agreement to something the talker just said
function signalExpressAgreement() {
    session.signal({
        data: "expressAgreement#" + m.myPublisher.stream.streamId
    });
}

// Signal Disagreement to something the talker just said
function signalExpressDisagreement() {
    session.signal({
        data: "expressDisagreement#" + m.myPublisher.stream.streamId
    });
}

// Signal that teh speaker should get back on track
function signalGetBackOnTrack() {
    session.signal({
        data: "getBackOnTrack#"
    });
}

// Signal status of current talkingQueue (used to inform new users on the status)
// Only users with a empty Queue should react to this signal
function signalQueueStatus() {
    session.signal({
        data: "queueStatus#" + talksNow + "#" + JSON.stringify(talkingQueue)
    });
}

// Signal that you want to leave the Queue if you are in it
function signalLeaveQueue() {
    //log("You dispatched a signalLeaveQueue");
    session.signal({
        data: "leaveQueue#" + m.myPublisher.stream.streamId
    });
}

// Signal that you want want to use one superpower action
function signalUseSuperpower() {
    session.signal({
        data: "useSuperPower#" + m.myPublisher.stream.streamId
    });
}

// Signal with the current meeting status
function signalStatusUpdate(queue) {
    let currTime = Date.now();
    //console.log("statusUpdate#" + JSON.stringify(queue) + "#" + m.talkerEndTime);
    session.signal({
        data: "statusUpdate#" + JSON.stringify(queue) + "#" + m.talkerEndTime + "#" + currTime
    });
}

// Visulaize Queue adding and leaving
function signalVisualizeAddQueue(_streamName) {
    session.signal({
        data: "visualizeAddQueue#" + _streamName
    });
}

function signalVisualizeLeaveQueue(_streamName) {
    session.signal({
        data: "visualizeLeaveQueue#" + _streamName
    });
}

function signalToggleAfk(_streamName) {
    session.signal({
        data: "toggleAfk#" + _streamName
    });
}

function signalAfkUsersArray() {
    session.signal({
        data: "afkUsersArray#" + JSON.stringify(m.afkUsers)
    });
}



// ##################################################################
// Processing Signals
function receiveSignal(event) {
    var res = event.data.split("#");
    var cmd = res[0];

    switch (cmd) {
        case "log":
            var message = res[1];
            //logGlobal(message);
            break;
        case "talkAction":
            var senderStreamId = res[1];
            console.log("LetMeTalk");
            handleTalkAction(senderStreamId);
            break;
        case "talkActionManual":
            var senderStreamId = res[1];
            var amountSeconds = res[2];
            console.log("LetMeTalkManual");
            handleTalkActionManual(senderStreamId, amountSeconds);
            break;
        case "doneTalking":
            var senderStreamId = res[1];
            //handleDoneTalking(senderStreamId);
            break;
        case "talkTimeLeft":
            var senderStreamId = res[1];
            var talkTimeLeft = res[2];
            //handleTalkTimeLeft(senderFullName, talkTimeLeft);
            break;
        case "expressAgreement":
            var senderStreamId = res[1];
            handleAgreement(senderStreamId);
            break;
        case "expressDisagreement":
            var senderStreamId = res[1];
            handleDisagreement(senderStreamId);
            break;
        case "getBackOnTrack":
            handleGetBackOnTrack(senderStreamId);
            break;
        case "queueStatus":
            var talksNow = res[1];
            var queueJson = res[2];
            //handleQueueStatusUpdate(talksNow, queueJson);
            break;
        case "leaveQueue":
            var senderStreamId = res[1];
            //handleLeaveQueue(senderStreamId);
            break;
        case "useSuperPower":
            var senderStreamId = res[1];
            handleUseSuperpower(senderStreamId);
            break;

        case "statusUpdate":
            var _queueJSON = res[1];
            var _talkerEndTime = res[2];
            var _masterTime = res[3];
            handleStatusUpdate(_queueJSON, _talkerEndTime, _masterTime);
            break;
        case "visualizeAddQueue":
            //handleVisualizeAddQueue(res[1]);
            break;
        case "visualizeLeaveQueue":
            //handleVisualizeLeaveQueue(res[1]);
            break;
        case "toggleAfk":
            var senderStreamId = res[1];
            handleToggleAfk(senderStreamId);
            break;
        case "afkUsersArray":
            var afkUsersArrayJSON = res[1];
            handleAfkUsersArray(afkUsersArrayJSON);
            break;
        default:
            //log("ERROR: signaled command not found " + cmd);
    }
}

function handleTalkAction(senderStreamId) {

    console.log("handleTalkAction");
    if (m.amIMaster()) {
        let queue = JSON.parse(JSON.stringify(m.queue));

        let inQueue = $.inArray(senderStreamId, queue);
        if (inQueue == -1) {
            queue.push(senderStreamId);
            //signalSoundAddQueue();
        } else {
            let newQueue = queue.filter(function(e) {
                //signalSoundLeaveQueue();
                return e !== senderStreamId
            });
            queue = newQueue;
        }

        // only change endtime, if front position of queue changed
        if (queue[0] != m.queue[0]) {
            let talkingStartedAt = new Date().getTime();
            m.talkerEndTime = talkingStartedAt + (1000 * m.config.maxTalkingTime);
        }

        signalStatusUpdate(queue);
    }
}

function handleTalkActionManual(senderStreamId, amountSeconds) {
    if (m.amIMaster()) {
        // only if calling user ist current talker
        if (senderStreamId == m.queue[0]){
            // change talking endtime of calling user
            let talkingStartedAt = new Date().getTime();
            m.talkerEndTime = talkingStartedAt + (1000 * amountSeconds);
            // signal the upadate to everyone
            signalStatusUpdate(m.queue);
        }
    }
}

function handleUseSuperpower(senderStreamId) {
    let timeAdd = null;
    if (m.amIMaster()) {
        // if sender talks, make his talk time longer 
        // this should depend on the left time
        if (senderStreamId == m.queue[0]) {
            let secondsLeft = (m.talkerEndTime - new Date().getTime()) / 1000;
            if (secondsLeft > 0) {
                let extendMultiplier = (m.config.maxTalkingTime / (secondsLeft * 0.2)) / m.config.maxTalkingTime;
                console.log("Time extend Multiplier " + extendMultiplier);
                timeAdd = m.config.extendTalkTimeBy * extendMultiplier;
                if (timeAdd > m.config.extendTalkTimeBy) {
                    timeAdd = m.config.extendTalkTimeBy;
                }
                // console.log("Time added " + timeAdd);
                // m.talkerEndTime += timeAdd * 1000;

                // extend time by static amount

                m.talkerEndTime += m.config.extendTalkTimeBy * 1000;
                signalStatusUpdate(m.queue);
            }
        }

        // if sender is in queue but not the next talker
        else if (m.queue.indexOf(senderStreamId) > 1) {
            console.log("someone wants to get to front of queue");
            // get current position of tailgater
            let idx = m.queue.indexOf(senderStreamId);
            //console.log("idx: " + idx);
            // get subarray of everyone above the tailgater
            let above = m.queue.slice(1, idx);
            // and the ones below
            let below = m.queue.slice(idx + 1, m.queue.length);
            // put sender at first place
            let talkingQueueTMP = [];
            talkingQueueTMP.push(m.queue[0]);
            talkingQueueTMP.push(senderStreamId);
            talkingQueueTMP = talkingQueueTMP.concat(above);
            talkingQueueTMP = talkingQueueTMP.concat(below);
            signalStatusUpdate(talkingQueueTMP);

        }


    }

    // everyone should play a sound
    superpowerSound.play();
    // everyone should visualize the use of superpower in the central panel
    // send queue position of superpower user to decide what symbol should be displayed
    visualizeSuperpowerUse(senderStreamId, m.queue.indexOf(senderStreamId));


}

function handleStatusUpdate(_queueJSON, _talkerEndTime, _masterTime) {
    //console.log("handleStatusUpdate");
    //console.log(_queueJSON);

    m.timeCorrection = _masterTime - Date.now();
    console.log("Time correction " + m.timeCorrection);

    let oldQueueLength = m.queue.length;
    prevTalker = m.queue[0];
    m.queue = JSON.parse(_queueJSON);
    let talksNow = m.queue[0];
    //console.log("Endtime in Status Update " + _talkerEndTime);
    m.talkerEndTime = new Date(parseInt(_talkerEndTime)).getTime();

    // log usernamequeue
    let userNameQueue = getUserNameQueue();
    console.log("User Name Queue");
    console.log(userNameQueue);

    let myId = m.myPublisher.stream.streamId
        /*
        console.log("talksNow");
        console.log(talksNow);
        console.log("myId");
        console.log(myId);
        console.log(talksNow == myId);
        console.log(prevTalker);
        console.log(prevTalker != myId);
        */



    // if you are the one that wants to talk
    if (talksNow == myId && prevTalker != myId) {
        // create timestamp to known when your talking started
        m.talkerStartedAt = Date.now();
        m.myPublisher.publishAudio(true)
            // warn user that its his turn now (via audio)
            //console.log("talkingSound")
        talkingSound.play();
    } else if (prevTalker == myId && talksNow != myId) {
        m.myPublisher.publishAudio(false);
        doneTalkingSound.play();
        // reset global variable for managing talk time warnings
        alreadyWarnedAt = null;
        //console.log("donetalkingSound")
    } else {
        // if someone else queued in
        if (oldQueueLength < m.queue.length) {
            console.log("Queuein Sound");
            queueInSound.play();
        }

        // if someone else left the queue
        if (oldQueueLength > m.queue.length) {
            console.log("Queueout Sound");
            queueOutSound.play();
        }

        //console.log("thirdElse")
    }
    // talker changed

    if (prevTalker != talksNow) {

        // be sure its not the very first talker
        if (prevTalker != null && prevTalker != "null") {
            //console.log("add to analytics " + getStreamName(prevTalker));
            addToAnalytics(getStreamName(prevTalker));
        }
        //console.log("talker started at set to " + new Date().getTime());
        m.talkerStartedAt = new Date().getTime();
        updateUiTalkStatus(prevTalker, talksNow);
    }

    //updateUi();

    updateUiQueue();


}

function handleAgreement(senderStreamId) {

    // play sound
    notificationSound.play();

    let html = `<i class="fa fa-thumbs-up" id="animate-agreement" aria-hidden="true" style="opacity: 0.0; color: #ffd89b;"></i>`;
    blendOver("talkerPlaceholderContent", html, "animate-agreement", 1);

    html = `<span id="name-overblend" style="background-color: #245a7c; opacity: 0.0; color: white; border-radius: 3px;">&nbsp${getStreamName(senderStreamId)}&nbsp</span>`;
    blendOver("talkerPlaceholderContent", html, "name-overblend", getStreamName(senderStreamId).length + 3);
}


function handleDisagreement(senderStreamId) {

    notificationSound.play();

    let html = `<i class="fa fa-thumbs-down" id="animate-disagreement" aria-hidden="true" style="opacity: 0.0; color: #ffd89b;"></i>`;
    blendOver("talkerPlaceholderContent", html, "animate-disagreement", 1);

    html = `<span id="name-overblend" style="background-color: #245a7c; opacity: 0.0; color: white; border-radius: 3px;">&nbsp${getStreamName(senderStreamId)}&nbsp</span>`;
    blendOver("talkerPlaceholderContent", html, "name-overblend", getStreamName(senderStreamId).length + 3);

}

function handleGetBackOnTrack(){
    notificationSound.play();
    let html = `<i class="fa fa-road" id="animate-getbackontrack" aria-hidden="true" style="opacity: 0.0; color: #ffd89b;"></i>`;
    blendOver("talkerPlaceholderContent", html, "animate-getbackontrack", 1);

    html = `<span id="text-overblend" style="background-color: #245a7c; opacity: 0.0; color: white; border-radius: 3px;">&nbsp get back on track &nbsp</span>`;
    blendOver("talkerPlaceholderContent", html, "text-overblend", 20);
}

// visualize, that someone used a superpower
function visualizeSuperpowerUse(senderStreamId, userQueuePosition) {
    console.log(getStreamName(senderStreamId) + " used a Superpower");


    // blend over superpower Symbol
    let html = `<i class="fa fa-bolt" id="animate-superpower" aria-hidden="true" style="opacity: 0.0; color: #ffd89b;"></i>`;
    blendOver("talkerPlaceholderContent", html, "animate-superpower", 1);

    // if time bonus was given display the amount instead of name
    if (userQueuePosition == 0) {
        html = `<span id="name-overblend" style="background-color: #245a7c; opacity: 0.0; color: white; border-radius: 3px;">&nbsp + ${m.config.extendTalkTimeBy.toFixed(2)} s &nbsp</span>`;
        blendOver("talkerPlaceholderContent", html, "name-overblend", 8);
    } else {
        // blend over name
        html = `<span id="name-overblend" style="background-color: #245a7c; opacity: 0.0; color: white; border-radius: 3px;">&nbsp${getStreamName(senderStreamId)}&nbsp</span>`;
        blendOver("talkerPlaceholderContent", html, "name-overblend", getStreamName(senderStreamId).length + 3);

    }
}


function handleToggleAfk(senderStreamId){
    // check if sender is already in afk array
    if(!m.afkUsers.includes(senderStreamId)){
        m.afkUsers.push(senderStreamId);
        $("#"+sideStreamContent + senderStreamId).addClass("blurred");
        $("#"+sideStreamContainer + senderStreamId + " .smallStreamInfo").html(getStreamName(senderStreamId) + " <i class=\"fa fa-coffee\" aria-hidden=\"true\"></i>");
    }else{
        var index = m.afkUsers.indexOf(senderStreamId);
        if (index > -1) {
            m.afkUsers.splice(index, 1);
        }
        $("#"+sideStreamContent + senderStreamId).removeClass("blurred");
        $("#"+sideStreamContainer + senderStreamId + " .smallStreamInfo").html(getStreamName(senderStreamId));
    }
}

// used when joining a session to get correct current afk status
function initializeAfkUi(){

    m.afkUsers.forEach(function(streamId) {
        $("#"+sideStreamContent + streamId).addClass("blurred");
        $("#"+sideStreamContainer + streamId + " .smallStreamInfo").html(getStreamName(streamId) + " <i class=\"fa fa-coffee\" aria-hidden=\"true\"></i>");
    });

}

function handleAfkUsersArray(array){
    console.log("got new afk array");
    m.afkUsers = JSON.parse(array);
    initializeAfkUi();
}

// general function for blending font based stuff in
// if size is not set, it will fill the target (ToDO: implement custom sizing)
function blendOver(targetId, _html, id, textLength, animate=true) {
    //console.log("blend over called");
    // delete possibly existing element
    $("#" + id).remove();

    let html = _html;
    let center = getElementCenter("#" + targetId);

    $(document.body).append(html);



    $("#" + id).css("font-size", (0.65 * $("#" + targetId).width()) / textLength);
    $("#" + id).css("left", center[0] - ($("#" + id).width() / 2));
    $("#" + id).css("top", center[1] - ($("#" + id).height() / 2));
    $("#" + id).css("position", "absolute");

    if(animate){
        $("#" + id).animate({
            opacity: '1.0'
        }, 2000);
        $("#" + id).animate({
            opacity: '0.0'
        }, {
            complete: function() {
                $("#" + id).remove();
            }
        }, 2000);
    }
}

// return the center coordinates for a html element
function getElementCenter(element) {
    let position = $(element).offset();
    let width = $(element).width();
    let height = $(element).height();
    let centerX = position.left + width / 2;
    let centerY = position.top + height / 2;

    let center = [centerX, centerY];
    return center;
}


// return queue of usernames from streamId Queue
function getUserNameQueue() {
    let userNameQueue = [];
    let index;

    for (index = 0; index < m.queue.length; ++index) {
        userNameQueue.push(getStreamName(m.queue[index]));
    }
    return userNameQueue;
}


// get Stream Name for given Stream ID
function getStreamName(streamId) {
    let index;
    for (index = 0; index < m.getUsers().length; ++index) {
        if (m.getUsers()[index].streamId == streamId) {
            return m.getUsers()[index].name;
        }
    }
}



// Update Ui according to current Queue
function updateUiQueue() {
    /*
    // for every user
    m.getUsers().forEach(function(user) {
        // get position in queu
        let position = m.queue.indexOf(user.streamId);

        // if user is not in queue, clear the queue span
        if (position == -1) {
            $("#" + sideStreamContainer + user.streamId + " ." + sideStreamQueueUi).html("");
        } else if (position > 0) {
            $("#" + sideStreamContainer + user.streamId + " ." + sideStreamQueueUi).html(`<span class="badge badge-primary">${position}</span>`);
        } else {
            $("#" + sideStreamContainer + user.streamId + " ." + sideStreamQueueUi).html(`<span class="badge badge-primary">talks</span>`);
        }
    });
    */
    // clear ui display
    $("#" + queueUi).html("");
    let first = true;
    m.queue.forEach(function(user) {
        if (first) {
            first = false;
            $("#" + queueUi).append(`<span class="badge badge-warning badge-queue"> ${getStreamName(user)} </span>`);
        } else {
            $("#" + queueUi).append(`<span class="badge badge-primary badge-queue"> ${getStreamName(user)} </span>`);
        }
    });


}

// this function is called when the talker changed
// also if the new talker is null
function updateUiTalkStatus(prevTalker, talksNow) {

    console.log("Update Ui talk status called");

    // if there is a prev talker, move his stream back to the sidePanel
    if (prevTalker != null && prevTalker != "null") {
        console.log("moving back prevTaler Stream to sidePanel");
        $("#" + sideStreamContent + prevTalker).html($("#" + talkerContent).children("div:first"));
    }


    // if nobody talks
    if (m.queue.length == 0) {
        // clear central ui
        $("#" + talkerContent).html(`<i class="fa fa-user-circle-o fa-5x"></i>`);
        $("#" + talkTimeLeftUi).html(`<i class="fa fa-hourglass" aria-hidden="true"></i>`);
    } else {
        // remove placeholder
        //$("#" + talkerContent).html("");
        // add shadow to sidepanel
        $("#" + sideStreamContainer + m.queue[0]).addClass("talker");
        // set heigth equal to width
        //$(talkerPlaceholderContent).height($(talkerPlaceholderContent).width() * 0.8);

        /* old version where a new stream was generated for the talker
        let stream = getStreamFromId(m.queue[0]);
        lastMainStream = stream;
        let element = talkerPlaceholderContent;
        session.subscribe(stream, element, {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            fitMode: 'contain',
            audioVolume: 0
        }, handleError);
        */

        // new version: move the exisiting stream to the middle and back if the talking is over
        // like this: $("#talkerPlaceholderContent").html($("#"+"OT_bc800252-fa1a-4485-a358-54e10a3da243"))
        $("#" + talkerContent).html($("#" + sideStreamContent + m.queue[0]).children("div:first"));
        $("#" + sideStreamContent + m.queue[0]).html(`<i class="fa fa-user-circle-o fa-5x"></i>`);

    }


    // delete talker visualization for everybody not talking
    let index;
    for (index = 0; index < m.getUsers().length; ++index) {
        if (m.getUsers()[index].streamId != m.queue[0]) {
            $("#" + sideStreamContainer + m.getUsers()[index].streamId).removeClass("talker");

        }
    }



    // move stream element of talker to central position
    //let talkerElement = sideStreamContent + m.queue[0];
    //$("#" + talkerContent).html($("#" + talkerElement).html());


}

// return stream object for a given streamId
function getStreamFromId(streamId) {
    let index;
    for (index = 0; index < m.getUsers().length; ++index) {
        if (m.getUsers()[index].streamId == streamId) {
            return m.getUsers()[index];
        }
    }
    console.log("could not find stream object for id " + streamId);
}

// React to Button Clicks
// TODO: seperate UI ids to variables
// ############################################################################

// Toogle Video for own Stream
$("#btn_toggle_video").click(function() {
    if (m.myPublisher.stream.hasVideo) {
        //log(myPublisher.stream.name + "  disabled Video", true);
        m.myPublisher.publishVideo(false);
    } else {
        //log(myPublisher.stream.name + "  enabled Video", true);
        m.myPublisher.publishVideo(true);
    }
});

// remove focus from button after click
$("#btn_toggle_video").mouseup(function() {
    $(this).blur();
});


// Info Modal Button
$("#btn_infoModal").mouseup(function() {
    $(this).blur();
});


// Send a let me talk signal
$("#btn_letmetalk").click( () => {
    manageTalkAction();
});

function manageTalkAction(){
    if(m.afkUsers.includes(m.myPublisher.stream.streamId)){
        signalToggleAfk(m.myPublisher.stream.streamId);
    }
    signalTalkAction();
}

// remove focus from button after click
$("#btn_letmetalk").mouseup(function() {
    $(this).blur();
})

$("#btn_superpower").click(function() {
    if (m.config.superpowers > 0) {

        // ToDo: if own position is worse than 2
        if (m.queue[0] == m.myPublisher.stream.streamId || m.queue.indexOf(m.myPublisher.stream.streamId) > 1) {
            // use up one superpower
            m.config.superpowers -= 1;
            // display left superpower
            $("#superpower_left").html(m.config.superpowers);
            signalUseSuperpower();
        }
    }
    if (m.config.superpowers <= 0) {
        // disable button
        // $("#btn_superpower").prop('disabled', true);
    }
});

// remove focus from button after click. Otherwise spacebar could trigger it.
$("#btn_superpower").mouseup(function() {
    $(this).blur();
})

// leave the meeting button
$("#btn_leave").click(function() {

    swal({
            title: "Leave the Meeting",
            text: "do you realy want to leave this meeting?",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
        },
        function(inputValue) {
            if (inputValue === false) return false;

            if (inputValue === "") {
                swal.showInputError("You need to enter a name");
                return false
            }
            window.location.href = "http://www.whipple.io";
        });

    //window.location.href = "/";
});

// A click on Spacebar does the same than a click on the talk button
document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
        // only if focus is not on the notes
        if (document.activeElement != document.getElementById('notes')) {
            manageTalkAction();
        }
    }
}

// this blocks the page from scrolling down when spacebar is pressed
// deactivated to mae space usable in the notes
document.body.onkeydown = function(e) {
    if (e.keyCode == 32) {
        //return false;
    }
}


// Send a done talking Signal
// Send a let me talk signal
// All talk management will be one button and current status
/*
$("#btn_donetalking").click(function() {
    if (talksNow === myFullUserName) {
        log(myPublisher.stream.name + "  will stop talking", true);
        signalDoneTalking();
    }
});
*/

// React to clicks on agreement Buttons
$("#btn_agreement").click(signalExpressAgreement);
$("#btn_agreement").mouseup(function() {
    $(this).blur();
});
$("#btn_disagreement").click(signalExpressDisagreement);
$("#btn_disagreement").mouseup(function() {
    $(this).blur();
});

$("#btn_getbackontrack").click(signalGetBackOnTrack);
$("#btn_getbackontrack").mouseup(function() {
    $(this).blur();
});

// Meeting Analytics Download Button
btnAnalyticsDownload
$("#" + btnAnalyticsDownload).click(downloadAnalytics);



// Meeting Analytics
// ############################################################################
function addToAnalytics(streamName) {

    // calculate talk time of last talker
    let timeNow = new Date().getTime();
    let userTalkedFor = (timeNow - m.talkerStartedAt) / 1000;
    // reset
    m.talkerStartedAt = null;
    //construct csv to add
    m.analytics += m.talkingOrder + ";" + streamName + ";" + userTalkedFor.toFixed(2) + "\n";
    //console.log(m.analytics);

    // increment order counter by one
    m.talkingOrder += 1;
}

$("#get-analytics").click(downloadAnalytics);

function downloadAnalytics() {
    // force download
    let meetingAnalytics = m.analytics.replace(/\n/g, "\r\n");
    window.location.href = "data:application/octet-stream," + encodeURIComponent(meetingAnalytics);
}

// note related click events
$("#btn_close_notes").click(function() {
    // make notes invisible
    $("#draggable-notes").css("display", "none");
});

$("#show_notes").click(function() {
    $("#draggable-notes").css("display", "inline");
});

// etherpad related click events
$("#btn_close_etherpad").click(function() {
    // make notes invisible
    $("#draggable-etherpad").css("display", "none");
});

$("#show_etherpad").click(function() {
    $("#draggable-etherpad").css("display", "inline");
});

// AFK click events
$("#toggle_afk").click(() => {
    // if you are talking, stop and then send signal afk
    if(m.myPublisher.stream.streamId == m.queue[0]){
        signalTalkAction();
    }
    signalToggleAfk(m.myPublisher.streamId);

});


// Interval Functions that run all the time to update stuff like 
// left talking time or total meeting time
// ############################################################################

// Timekeeping
window.setInterval(function() {
    uiTimeToEnd();
}, 500);


function uiTimeToEnd() {
    let secondsLeft = Math.floor(((m.talkerEndTime - m.timeCorrection) - Date.now()) / 1000);

    if (m.queue.length > 0) {
        //sconsole.log(Math.floor(secondsLeft) + " seconds left");
        $("#" + talkTimeLeftUi).html(secondsLeft);

        // if you have 10 seconds left, play warning sound
        if (secondsLeft == 10) {
            // alarm if you are the talker or the next one in line
            if (((m.queue[0] == m.myPublisher.stream.streamId) && m.queue.length > 1) || (m.queue[1] == m.myPublisher.stream.streamId)) {
                alarmSound.play();
            }
        }

        // if you are the talker, show reminders on how long you are already talking
        if (m.queue[0] == m.myPublisher.stream.streamId) {
            let talkedFor = Math.floor((Date.now() - m.talkerStartedAt)/1000);
            if(talkedFor % m.config.youTalkedForMessageInterval == 0 && talkedFor > 0){
                // make sure warning is only showed once per timestamp
                if(alreadyWarnedAt != talkedFor){

                    // show warning about current talk time that automatically disapears
                    swal({
                        title: 'Watch your time!',
                        type: 'info',
                        // language=HTML
                        text: 'You are now talking for ' + talkedFor + ' seconds already...',
                        timer: 2500
                    })

                    alreadyWarnedAt = talkedFor;
                }
            }
        }

        // if time is over
        if (secondsLeft <= 0) {
            $("#" + talkTimeLeftUi).html(`<i class="fa fa-hourglass" aria-hidden="true"></i>`);
            // if you are the talker, stop now
            if (m.queue[0] == m.myPublisher.stream.streamId) {

                // only stop talking if there is someone in the queue, else keep talking
                if(m.queue.length > 1){
                    // if there already was somebody in the queue waiting
                    // ToDo: find a better way to descriminate here on the queue status
                    if(secondsLeft > -1){
                        signalTalkAction();
                    }
                    // else: someone got in line while you were already over your talk time
                    // now you have x seconds left before the next one gets to talk
                    else{
                        // signal a new talk action with manually set time
                        // this will always get you to talk for the set amount of time while ignoring the current
                        // queue status. Here m.config.talkTimeAfterNewUserInQueue is used as time amount
                        signalTalkActionManual();
                    }
                }
            }
        }
    } else {
        //
    }
}

// Meeting Link Sharing
// ############################################################################
$("#room-link").click(function() {
    var clipboard = new Clipboard('#room-link', {
        text: function() {
            return window.location.href ;
        }
    });
    $("#room-link").css("color", "#e4c897");
});


// HTML Templating
// ############################################################################
function addStreamToHTML(streamId, streamName, you) {

    let extraClass = "";
    if (you) {
        extraClass = "streamYou";
    }


    const template =
        `
                <div id="SideStreamContainer${streamId}" class="smallStreamContainer">
                <div id="SideStreamContent${streamId}" class="smallStreamContent aligner">
                   
                </div>

                <div class="smallStreamInfo ${extraClass}">
                    <!--<hr>-->
                    ${streamName}
                    <span class="smallStreamQueueUi"></span>
                </div>
            </div>
    `
        // Insert html to Stream Area
    $(leftPanel).append(template);

}
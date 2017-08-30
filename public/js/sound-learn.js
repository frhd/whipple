// sounds are initialized in meeting.js

$("#btn_sound-learn-start-talk").click(function() {
    talkingSound.play();
});

$("#btn_sound-learn-end-talk").click(function() {
    doneTalkingSound.play();
});

$("#btn_sound-learn-queue-in").click(function() {
    queueInSound.play();
});

$("#btn_sound-learn-queue-out").click(function() {
    queueOutSound.play();
});

$("#btn_sound-learn-join").click(function() {
    joinSound.play();
});

$("#btn_sound-learn-alarm").click(function() {
    alarmSound.play();
});

$("#btn_sound-learn-notification").click(function() {
    notificationSound.play();
});
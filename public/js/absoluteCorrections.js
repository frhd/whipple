// make talker placeholder squared
//resizeUi();




$(window).resize(function() {
    resizeUi();
});

$(document).ready(function() {
    resizeUi();
});

$(window).on('load', function() {
    resizeUi();
});


function resizeUi() {
    $("#talkerPlaceholder").height($("#talkerPlaceholder").width());
    let maxHeight = 0.95 * $("#rightPanel").height();
    $("#talkerPlaceholder").css("max-height", maxHeight + "px");

    // set height for talkerPlaceholderContent
    $("#talkerPlaceholderContent").height($("#talkerPlaceholder").height() - ($("#bigStreamInfoContainer").height() * 1.3));



    /*
    let sideStreams = $('.smallStreamContainer');

    for (let sideStream in sideStreams) {
        $(sideStream).height(($('#leftPanel').height() / sideStreams.length) * 0.95);
    }
    */
}
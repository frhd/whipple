// non dynamic test resizing for 6 stream-boxen
let num_streams = 5;
let total_height = $(".percentage-main-body").height();
let left_panel_width = $("#left-panel").width();
let single_height = $(".small-stream-container").height();

let available_height = total_height / num_streams;
console.log("single_height: " + single_height);
console.log("available_height: " + available_height)

let available_width_factor = single_height / available_height;

console.log("Width Factor: " + available_width_factor);




$(".small-stream-container").css("max-height", 0.9 * available_height);
//$(".small-stream-container").css("max-width", 0.9 * available_height);

$(window).resize(function() {
    let num_streams = 5;
    let total_height = $(".percentage-main-body").height();
    let left_panel_width = $("#left-panel").width();
    let single_height = $(".small-stream-container").height();

    let available_height = total_height / num_streams;
    console.log("single_height: " + single_height);
    console.log("available_height: " + available_height)

    let available_width_factor = single_height / available_height;

    console.log("Width Factor: " + available_width_factor);

    $(".small-stream-container").css("max-height", 0.9 * available_height);
});
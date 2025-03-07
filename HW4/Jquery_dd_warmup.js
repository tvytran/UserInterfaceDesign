$(function() {
    $("#draggable").draggable({
        revert: "invalid" // Reverts back if dropped outside a valid target
    });

    $("#droppable").droppable({
        over: function(event, ui) {
            $(this).css("background-color", "lightgreen"); // Change to light green when hovering
        },
        out: function(event, ui) {
            $(this).css("background-color", ""); // Reset when dragging out
        },
        drop: function(event, ui) {
            $(this)
                .css("background-color", "green") // Set to green when successfully dropped
                .addClass("ui-state-highlight")
                .find("p")
                .html("Dropped!");
        }
    });
});

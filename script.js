$(document).ready(function(){
    // Open menu panel
    $(".menu-button").on('click', function(){
        console.log("ciao");
        $(".menu-panel").toggleClass("menu-panel--open");
        $(".bar1").toggleClass("bar1--open");
        $(".bar2").toggleClass("bar2--open");
        $(".bar3").toggleClass("bar3--open");
    });

});
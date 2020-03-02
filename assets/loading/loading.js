$('head').append('<link rel="stylesheet" type="text/css" href="./assets/loading/loading.css">');

var loading =   "<div id='loading'>"+
                    "<div id='loader'></div>"+
                "</div>";

function addLoading(){
    $("body").append(loading);
}

function removeLoading(){
    $("#loading").remove();
}
var unhide = document.getElementsByClassName('unhide');
var hiddenDiv = document.getElementsByClassName('toHide');

$(unhide).on('click', function(){
    $(hiddenDiv).toggleClass('hidden');
});
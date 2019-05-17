var createBtn = document.getElementsByClassName('createBtn');
var removeBtn = document.getElementsByClassName('removeBtn');
var form = document.querySelector('#clone');
var forma = document.getElementById('forma');
var laikas = document.querySelector('.laikas');


$(createBtn).click(function() {
    var clone = $(form).clone(forma);
    $(forma).append(clone);
  });

  $(removeBtn).click(function() {
    $(this).parent().remove();
  });
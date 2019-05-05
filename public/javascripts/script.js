var createBtn = document.getElementsByClassName('createBtn');
var removeBtn = document.getElementsByClassName('removeBtn');
var form = document.querySelector('#clone');
var forma = document.getElementById('forma');

$(createBtn).click(function() {
    var clone = $(form).clone(forma);
    $(forma).append(clone);
  });

  $(removeBtn).click(function() {
    $(this).parent().remove();
  });


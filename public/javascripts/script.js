var createBtn = document.getElementsByClassName('createBtn');
var removeBtn = document.getElementsByClassName('removeBtn');
var form = document.querySelector('#clone');
var forma = document.getElementById('forma');
var minutes = document.querySelector('timer');
var minutes = document.querySelector('timer');

$(createBtn).click(function() {
    var clone = $(form).clone(forma);
    $(forma).append(clone);
  });

  $(removeBtn).click(function() {
    $(this).parent().remove();
  });

const orderInfo = document.querySelector('.orderInfo');


const info = $(forma).val();

$(orderInfo).append(info);
$(document).foundation();

var app = {
  i: 1,

  init: function() {
    var myForm = document.querySelector('form');
    myForm.onsubmit = this.addName;
  },

  buildList: function(name) {
    var dl = document.createElement('dl');
    dl.style.border = '0px solid blue';
    dl.innerHTML += this.buildListItem(name);

    return dl;
  },

  buildListItem: function(term) {
    return ' \
      <li> \
        <dt>' + term + '</dt> \
        <dd> \
          <a href="#" class="delete" id="d' + app.i + '"><u>delete</u></a> \
          <a href="#" class="promote" id="p' + app.i + '"><u>promote</u></a> \
        </dd> \
      </li>';
  },

  addName: function(event) {
    event.preventDefault();
    var roster = document.querySelector('div.roster');
    var firstName = this.firstName.value;

    roster.insertBefore(app.buildList(firstName), roster.firstChild);

    var thisDelete = document.querySelector('#d' + app.i);
    var thisPromote = document.querySelector('#p' + app.i);
    thisDelete.addEventListener("click", app.deleteName, false);
    thisPromote.addEventListener("click", app.promoteName, false);
    app.i++;
  },

  deleteName: function(event) {
    event.preventDefault();
    var roster = document.querySelector('div.roster');
    var child = this.parentNode.parentNode.parentNode;
    roster.removeChild(child);
  },

  promoteName: function(event) {
    event.preventDefault();
    var dl = this.parentNode.parentNode.parentNode;
    if (dl.style.border == '0px solid blue')
      dl.style.border = '1px solid blue';
    else dl.style.border = '0px solid blue';
  }
};

app.init();

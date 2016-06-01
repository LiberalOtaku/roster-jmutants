$(document).foundation();

var i = 0;

var app = {

  init: function() {
    var myForm = document.querySelector('form');
    var myDelete = document.querySelectorAll('a.delete');
    var myPromote = document.querySelectorAll('a.promote');
    myForm.onsubmit = this.addName;
    // myDelete.onclick = this.deleteName;
    // myPromote.onclick = this.promoteName;
  },

  buildList: function(name) {
    var dl = document.createElement('dl');
    dl.id = i;
    i++;
    dl.style.border = '0px solid blue';
    dl.innerHTML += this.buildListItem(name);

    return dl;
  },

  buildListItem: function(term) {
    return ' \
      <li> \
        <dt>' + term + '</dt> \
        <dd> \
          <a href="#" class="delete"><u>delete</u></a> \
          <a href="#" class="promote"><u>promote</u></a> \
        </dd> \
      </li>';
  },

  addName: function(event) {
    event.preventDefault();
    var roster = document.querySelector('div.roster');
    var firstName = this.firstName.value;

    roster.insertBefore(app.buildList(firstName), roster.firstChild);
  },

  // deleteName: function(event) {
  //   event.preventDefault();
  //
  // },
  //
  // promoteName: function(event) {
  //   event.preventDefault();
  //   var dl = document.getElementById(this.id);
  //   if (dl.style.border = '0px solid blue') {
  //     dl.style.border = '1px solid blue';
  //   }
  //   else {
  //     dl.style.border = '0px solid blue';
  //   }
  // }
};

app.init();

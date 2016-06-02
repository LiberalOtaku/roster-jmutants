$(document).foundation();

var app = {
  // counter for tracking list items
  i: 1,

  // initialize app
  init: function() {
    document.querySelector('form').onsubmit = this.addName;
  },

  // now build the actual list for each new name
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
    var studentName = this.studentName.value;

    roster.insertBefore(app.buildList(studentName), roster.firstChild);

    // add delete and promote capabilities
    var thisDelete = document.querySelector('#d' + app.i);
    var thisPromote = document.querySelector('#p' + app.i);
    thisDelete.addEventListener("click", app.deleteName, false);
    thisPromote.addEventListener("click", app.promoteName, false);
    app.i++;
  },

  deleteName: function(event) {
    event.preventDefault();
    var roster = document.querySelector('div.roster');

    // this === clicked <a>delete</a>, child === surrounding <dl></dl>
    var child = this.parentNode.parentNode.parentNode;

    // remove the selected dl from the roster
    roster.removeChild(child);
  },

  promoteName: function(event) {
    event.preventDefault();

    // this === clicked <a>promote</a>, dl === surrounding <dl></dl>
    var dl = this.parentNode.parentNode.parentNode;

    // just switching the item border for now
    if (dl.style.border == '0px solid blue')
      dl.style.border = '1px solid blue';
    else dl.style.border = '0px solid blue';
  }
};

app.init();

$(document).foundation();

var app = {
  // initialize app
  init: function() {
    this.setupEventListeners();

    // counter for tracking list items
    this.count = 0;
  },

  setupEventListeners: function() {
    document.querySelector('form').onsubmit = this.addStudent.bind(this);
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
          <a href="#" class="delete" id="d' + this.count + '"><u>delete</u></a> \
          <a href="#" class="promote" id="p' + this.count + '"><u>promote</u></a> \
        </dd> \
      </li>';
  },

  addStudent: function(event) {
    event.preventDefault();
    var list = document.querySelector('#studentList');
    var form = document.querySelector('#studentForm');
    var studentName = form.studentName.value;
    this.count++;

    list.insertBefore(app.buildList(studentName), list.firstChild);
    form.reset();
    form.studentName.focus();

    // add delete and promote capabilities
    var thisDelete = document.querySelector('#d' + this.count);
    var thisPromote = document.querySelector('#p' + this.count);
    thisDelete.addEventListener("click", app.deleteName, false);
    thisPromote.addEventListener("click", app.promoteName, false);
  },

  deleteName: function(event) {
    event.preventDefault();
    var list = document.querySelector('#studentList');

    // this === clicked <a>delete</a>, child === surrounding <dl></dl>
    var child = this.parentNode.parentNode.parentNode;

    // remove the selected dl from the roster
    list.removeChild(child);
  },

  promoteName: function(event) {
    event.preventDefault();

    // this === clicked <a>promote</a>, dl === surrounding <dl></dl>
    var dl = this.parentNode.parentNode.parentNode;

    // just switching the item border for now
    if (dl.style.border == '0px solid blue')
      dl.style.border = '1px solid blue';
    else dl.style.border = '0px solid blue';
  },
};

app.init();

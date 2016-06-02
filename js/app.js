$(document).foundation();

var app = {
  // initialize app
  init: function() {
    this.setupEventListeners();
  },

  setupEventListeners: function() {
    document.querySelector('form').onsubmit = this.addStudent.bind(this);
  },

  // now build the actual list for each new name
  buildList: function(name) {
    var dl = document.createElement('dl');
    dl.style.border = '0px solid blue';
    dl.appendChild(this.buildListItem(name));

    return dl;
  },

  buildListItem: function(term) {
    var li = document.createElement('li');
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    var ul = document.createElement('ul');
    ul.className = "button-group";

    dt.innerText += term;
    li.appendChild(dt);

    var editLink = this.buildLink({
      text: 'edit',
      class: "button small radius secondary",
      handler: function() {
        // edits go here
      }
    });

    var deleteLink = this.buildLink({
      text: 'remove',
      class: "button small radius alert",
      handler: function() {
        li.parentNode.remove();
      }
    });

    var promoteLink = this.buildLink({
      text: 'promote',
      class: "button small radius",
      handler: function() {
        var dl = li.parentNode;

        // just switching the item border for now
        if (dl.style.border == '0px solid blue')
          dl.style.border = '1px solid blue';
        else dl.style.border = '0px solid blue';
      }
    });

    ul.appendChild(editLink);
    ul.appendChild(deleteLink);
    ul.appendChild(promoteLink);
    dd.appendChild(ul);
    li.appendChild(dd);
    return li;
  },

  buildLink: function(options) {
    var link = document.createElement('a');
    link.href = "#";
    link.className = options.class;
    link.onclick = options.handler;
    link.innerText = options.text;

    return link;
  },

  // called on form submit
  addStudent: function(event) {
    event.preventDefault();
    var list = document.querySelector('#studentList');
    var form = document.querySelector('#studentForm');
    var studentName = form.studentName.value;
    this.count++;

    this.prependChild(list, this.buildList(studentName));
    form.reset();
    form.studentName.focus();
  },

  prependChild: function(parent, child) {
    parent.insertBefore(child, parent.firstChild);
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

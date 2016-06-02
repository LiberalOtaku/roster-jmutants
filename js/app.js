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

    var li = document.createElement('li');
    var dt = document.createElement('dt');
    dt.innerText += name;
    li.appendChild(dt);

    var dd = document.createElement('dd');
    var ul = document.createElement('ul');
    ul.className = "button-group";

    var input = document.createElement('input');
    input.type = "text";
    input.className = "edit";
    input.placeholder = "Enter Student Name";
    input.value = dt.innerText;

    var editLink = this.buildLink({
      text: 'edit',
      class: "button small radius secondary",
      handler: function() {
        dt.innerText = '';
        dt.appendChild(input);

        ul.replaceChild(submitLink, editLink);
      }
    });

    var submitLink = this.buildLink({
      text: 'submit',
      class: "button small radius success",
      handler: function() {
        if (input.value != '') {
          dt.innerHTML = '';
          dt.innerText = input.value;

          ul.replaceChild(editLink, submitLink);
        }
      }
    });

    var deleteLink = this.buildLink({
      text: 'remove',
      class: "button small radius alert",
      handler: function() {
        dl.remove();
      }
    });

    var promoteLink = this.buildLink({
      text: 'promote',
      class: "button small radius",
      handler: function() {
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
    dl.appendChild(li);
    return dl;
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
};

app.init();

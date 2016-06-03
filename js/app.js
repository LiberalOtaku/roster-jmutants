$(document).foundation();

var app = {
  // initialize app
  init: function(listSelector) {
    this.list = document.querySelector(listSelector);
    this.roster = [];
    this.setupEventListeners();
    this.list.innerHTML = localStorage.getItem('roster');
  },

  setupEventListeners: function() {
    document.querySelector('form').onsubmit = this.addStudent.bind(this);
  },

  // now build the actual list entry for each new name
  buildList: function(name) {
    var dl = document.createElement('dl');
    dl.style.border = '0px dashed blue';

    var li = document.createElement('li');
    var dt = document.createElement('dt');
    dt.innerText = name;
    li.appendChild(dt);

    var dd = document.createElement('dd');
    var ul = document.createElement('ul');
    ul.className = "button-group";

    // create edit field
    var input = document.createElement('input');
    input.type = "text";
    input.className = "edit";
    input.placeholder = "Enter Student Name";
    input.value = dt.innerText;

    // create edit button
    var editLink = this.buildLink({
      contents: '<i class="fa fa-pencil fa-lg"></i>',
      class: "edit button small radius secondary",
      handler: function() {
        dt.innerText = '';
        dt.appendChild(input);

        ul.replaceChild(updateLink, editLink);
      }
    });

    // create update button
    var updateLink = this.buildLink({
      contents: '<i class="fa fa-check fa-lg"></i>',
      class: "update button small radius success",
      handler: function() {
        if (input.value !== '') {
          dt.innerHTML = '';
          dt.innerText = input.value;

          ul.replaceChild(editLink, updateLink);
          app.saveList();
        }
      }
    });

    // create delete button
    var deleteLink = this.buildLink({
      contents: '<i class="fa fa-times fa-lg"></i>',
      class: "remove button small radius alert",
      handler: function() {
        dl.remove();
        app.refreshRoster();
        app.saveList();
      }
    });

    // create favorite button
    var favoriteLink = this.buildLink({
      contents: '<i class="fa fa-star fa-lg"></i>',
      class: "favorite button small radius",
      handler: function() {
        // just switching the item border for now
        if (dl.style.border === '0px dashed blue')
          dl.style.border = '1px dashed blue';
        else dl.style.border = '0px dashed blue';
      }
    });

    // create top button
    var topLink = this.buildLink({
      contents: '<i class="fa fa-arrow-circle-up fa-lg"></i>',
      class: "top button small radius",
      handler: function() {
        // move item to the top
        app.list.insertBefore(dl, dl.parentNode.firstElementChild);
        app.refreshRoster();
        app.saveList();
      }
    });

    // create up button
    var upLink = this.buildLink({
      contents: '<i class="fa fa-arrow-up fa-lg"></i>',
      class: "up button small radius",
      handler: function() {
        // move item up one space
        var prevDL = dl.previousElementSibling;
        if (prevDL !== null) {
          app.list.insertBefore(dl, prevDL);
          app.refreshRoster();
          app.saveList();
        }
      }
    });

    // create down button
    var downLink = this.buildLink({
      contents: '<i class="fa fa-arrow-down fa-lg"></i>',
      class: "down button small radius",
      handler: function() {
        // move item down one space
        var nextDL = dl.nextElementSibling;
        if (nextDL !== null) {
          app.list.insertBefore(dl, nextDL.nextElementSibling);
          app.refreshRoster();
          app.saveList();
        }
      }
    });

    // put it all together
    ul.appendChild(editLink);
    ul.appendChild(deleteLink);
    ul.appendChild(favoriteLink);
    ul.appendChild(topLink);
    ul.appendChild(upLink);
    ul.appendChild(downLink);
    dd.appendChild(ul);
    li.appendChild(dd);
    dl.appendChild(li);
    return dl;
  },

  buildLink: function(options) {
    var link = document.createElement('a');
    link.href = "#";
    link.innerHTML = options.contents;
    link.className = options.class;
    link.onclick = options.handler;

    return link;
  },

  refreshRoster: function() {
    var allTop = document.querySelectorAll('a.top');
    var allUp = document.querySelectorAll('a.up');
    var allDown = document.querySelectorAll('a.down');

    var disableTop = document.querySelector('dl:first-child a.top');
    var disableUp = document.querySelector('dl:first-child a.up');
    var disableDown = document.querySelector('dl:last-child a.down');

    for (var i = 0; i < allTop.length; ++i) {
      allTop[i].className = "top button small radius";
      allUp[i].className = "up button small radius";
      allDown[i].className = "down button small radius";
    }

    disableTop.className += " disabled";
    disableUp.className += " disabled";
    disableDown.className += " disabled";
  },

  // called on form submit
  addStudent: function(event) {
    event.preventDefault();
    var form = document.querySelector('#studentForm');
    var studentName = form.studentName.value;

    this.prependChild(this.list, this.buildList(studentName));
    this.refreshRoster();
    this.roster.unshift({
      name: studentName,
    });
    form.reset();
    form.studentName.focus();
  },

  prependChild: function(parent, child) {
    parent.insertBefore(child, parent.firstElementChild);
  },

  saveList: function() {
    localStorage.setItem('roster', this.list.innerHTML);
  },
};

app.init('#studentList');

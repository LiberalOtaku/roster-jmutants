$(document).foundation();

var app = {
  // initialize app
  init: function(listSelector) {
    this.list = document.querySelector(listSelector);
    this.getLocalStorage();
    this.setupEventListeners();
    this.refreshRoster();
  },

  getLocalStorage: function() {
    var roster = JSON.parse(localStorage.getItem('roster'));
    var favorite = JSON.parse(localStorage.getItem('favorite'));
    if (roster !== null) {
      for (var i = 0; i < roster.length; ++i) {
        var newChild = this.list.appendChild(this.buildList(roster[i], favorite[i]));
      }
    }
  },

  setupEventListeners: function() {
    document.querySelector('form').onsubmit = this.addStudent.bind(this);
  },

  // now build the actual list entry for each new name
  buildList: function(name, favorite) {
    var dl = document.createElement('dl');
    if (favorite)
      dl.className = "favorite";

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
      class: "edit button tiny radius secondary",
      handler: function() {
        dt.innerText = '';
        dt.appendChild(input);

        ul.replaceChild(updateLink, editLink);
      }
    });

    // create update button
    var updateLink = this.buildLink({
      contents: '<i class="fa fa-check fa-lg"></i>',
      class: "update button tiny radius success",
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
      class: "remove button tiny radius alert",
      handler: function() {
        dl.remove();
        app.refreshRoster();
        app.saveList();
      }
    });

    // create favorite button
    var favoriteLink = this.buildLink({
      contents: '<i class="fa fa-star fa-lg"></i>',
      class: "favorite button tiny radius",
      handler: function() {
        // just switching the item background color for now
        if (dl.className === '')
          dl.className = "favorite";
        else dl.className = '';
        app.saveList();
      }
    });

    // create top button
    var topLink = this.buildLink({
      contents: '<i class="fa fa-arrow-circle-up fa-lg"></i>',
      class: "top button tiny radius",
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
      class: "up button tiny radius",
      handler: function() {
        // move item up one space
        var prevDL = dl.previousElementSibling;
        if (prevDL !== null) {
          app.list.insertBefore(dl, prevDL);
          app.saveList();
          app.refreshRoster();
        }
      }
    });

    // create down button
    var downLink = this.buildLink({
      contents: '<i class="fa fa-arrow-down fa-lg"></i>',
      class: "down button tiny radius",
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
    if (app.list.firstElementChild !== null) {
      var allTop = document.querySelectorAll('a.top');
      var allUp = document.querySelectorAll('a.up');
      var allDown = document.querySelectorAll('a.down');

      var disableTop = document.querySelector('dl:first-child a.top');
      var disableUp = document.querySelector('dl:first-child a.up');
      var disableDown = document.querySelector('dl:last-child a.down');

      for (var i = 0; i < allTop.length; ++i) {
        allTop[i].className = "top button tiny radius";
        allUp[i].className = "up button tiny radius";
        allDown[i].className = "down button tiny radius";
      }

      disableTop.className += " disabled";
      disableUp.className += " disabled";
      disableDown.className += " disabled";
    }
  },

  // called on form submit
  addStudent: function(event) {
    event.preventDefault();
    var form = document.querySelector('#studentForm');
    var studentName = form.studentName.value;

    this.prependChild(this.list, this.buildList(studentName, false));
    this.refreshRoster();
    app.saveList();
    form.reset();
    form.studentName.focus();
  },

  prependChild: function(parent, child) {
    parent.insertBefore(child, parent.firstElementChild);
  },

  saveList: function() {
    // simplest solution for me to save the list
    // may be changed to reduce time complexity later
    var newList = [];
    var favoriteList = [];
    var dlList = app.list.children;

    for (var i = 0; i < dlList.length; ++i) {
      newList.push(dlList[i].firstElementChild.innerText);
      if (dlList[i].className === "favorite")
        favoriteList.push(true);
      else favoriteList.push(false);
    }

    localStorage.setItem('roster', JSON.stringify(newList));
    localStorage.setItem('favorite', JSON.stringify(favoriteList));
  },
};

app.init('#studentList');

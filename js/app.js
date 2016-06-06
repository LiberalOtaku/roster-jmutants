$(document).foundation();

var app = {
  // initialize app
  init: function(formSelector, listSelector) {
    this.list = $(listSelector);
    this.form = $(formSelector);
    this.getLocalStorage();
    this.setupEventListeners();
    this.refreshRoster();
  },

  getLocalStorage: function() {
    var roster = JSON.parse(localStorage.getItem('roster'));
    var favorite = JSON.parse(localStorage.getItem('favorite'));
    if (roster !== null && roster.length) {
      for (var i = 0; i < roster.length; ++i) {
        var newChild = this.list.append(this.buildList(roster[i], favorite[i]));
      }
    }
  },

  setupEventListeners: function() {
    this.form.submit(this.addStudent.bind(this));
  },

  // now build the actual list entry for each new name
  buildList: function(name, favorite) {
    var dl = $('<dl/>').attr({
      "class": function() {
          if (favorite)
            return "favorite";
          else return "";
      }
    });

    var li = $('<li/>');
    var dt = $('<dt/>').text(name);
    var dd = $('<dd/>');
    var ul = $('<ul/>').attr({"class": "button-group actions"});

    // create edit button
    var editLink = this.buildLink({
      contents: '<i class="fa fa-pencil fa-lg"></i>',
      class: "edit button tiny radius secondary",
      handler: function() {
        // create edit field
        if ((editLink.attr("class") === "update button tiny radius success") &&
        ($('#input').val() !== '')) {
          dt.text($('#input').val());
          editLink.attr("class", "edit button tiny radius secondary");
          app.saveList();
        }
        else {
          dt.html($('<input/>').attr({
            id: "input",
            type: "text",
            "class": "edit medium-6 columns",
            placeholder: "Enter Student Name",
          }).val(dt.text()));
          editLink.attr("class", "update button tiny radius success");
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
        var className = dl.attr("class");
        if (dl.attr("class") === "")
          dl.attr({"class": "favorite"});
        else dl.attr("class", "");
        app.saveList();
      }
    });

    // create top button
    var topLink = this.buildLink({
      contents: '<i class="fa fa-arrow-circle-up fa-lg"></i>',
      class: "top button tiny radius",
      handler: function() {
        // move item to the top
        dl.insertBefore(dl.siblings().first());
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
        var prevDL = dl.prev();
        if (prevDL.length) {
          dl.insertBefore(prevDL);
          app.refreshRoster();
          app.saveList();
        }
      }
    });

    // create down button
    var downLink = this.buildLink({
      contents: '<i class="fa fa-arrow-down fa-lg"></i>',
      class: "down button tiny radius",
      handler: function() {
        // move item down one space
        var nextDL = dl.next();
        if (nextDL.length) {
          dl.insertAfter(nextDL);
          app.refreshRoster();
          app.saveList();
        }
      }
    });

    // put it all together
    ul.append(editLink, deleteLink, favoriteLink, topLink, upLink, downLink);
    return dl.append(li.append(dt, dd.append(ul)));
  },

  buildLink: function(options) {
    return $('<a/>').attr({
      href: "#",
      "class": options.class,
    }).html(options.contents)
      .click(options.handler);
  },

  refreshRoster: function() {
    if (app.list.children().length) {
      var allTop = $('a.top');
      var allUp = $('a.up');
      var allDown = $('a.down');

      for (var i = 0; i < allTop.length; ++i) {
        allTop.eq(i).attr({"class": "top button tiny radius"});
        allUp.eq(i).attr({"class": "up button tiny radius"});
        allDown.eq(i).attr({"class": "down button tiny radius"});
      }

      $('dl:first-child a.top').attr({"class": "top button tiny radius disabled"});
      $('dl:first-child a.up').attr({"class": "up button tiny radius disabled"});
      $('dl:last-child a.down').attr({"class": "down button tiny radius disabled"});
    }
  },

  // called on form submit
  addStudent: function(event) {
    event.preventDefault();
    var studentName = this.form.find('#studentName');

    this.list.prepend(this.buildList(studentName.val(), false));
    this.refreshRoster();
    app.saveList();
    studentName.val('').focus();
  },

  saveList: function() {
    // simplest solution for me to save the list
    // may be changed in the future to reduce time complexity
    var newList = [];
    var favoriteList = [];
    var dlList = app.list.children();

    for (var i = 0; i < dlList.length; ++i) {
      newList.push(dlList.eq(i).children().first().text());
      if (dlList.eq(i).attr("class") === "favorite")
        favoriteList.push(true);
      else favoriteList.push(false);
    }

    localStorage.setItem('roster', JSON.stringify(newList));
    localStorage.setItem('favorite', JSON.stringify(favoriteList));
  },
};

app.init('#studentForm', '#studentList');

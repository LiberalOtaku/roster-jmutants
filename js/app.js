$(document).foundation();

var app = {
  // initialize app
  init: function(formSelector, listSelector) {
    this.form = $(formSelector);
    this.list = $(listSelector);
    this.getLocalStorage();
    this.setupEventListeners();
    this.refreshRoster();
  },

  getLocalStorage: function() {
    var roster = JSON.parse(localStorage.getItem('roster'));
    if (roster) {
      $.each(roster, function(i, student) {
        app.list.append(app.buildList(student.name, student.favorite));
      });
    }
  },

  setupEventListeners: function() {
    this.form.submit(this.addStudent.bind(this));
    $('#load').click(this.loadRoster.bind(this));
    $('#clear').click(this.clearRoster.bind(this));
  },

  // now build the actual list entry for each new name
  buildList: function(name, favorite) {
    var dl = $('<dl/>').attr({
      "class": (function() {
          if (favorite)
            return "favorite";
          else return "";
      })(),
    });

    var li = $('<li/>');
    var dt = $('<dt/>').text(name);
    var dd = $('<dd/>');
    var ul = $('<ul/>').attr({"class": "button-group actions"});
    var editGroup = $('<li/>');
    var moveGroup = $('<li/>');

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
          dt.children().first().focus().select();
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
        if (dl.attr("class") === "favorite")
          dl.removeClass("favorite");
        else dl.addClass("favorite");
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
    editGroup.append(editLink, deleteLink, favoriteLink);
    moveGroup.append(topLink, upLink, downLink);
    ul.append(editGroup, moveGroup);
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
    $('a.top, a.up, a.down').removeClass("disabled");
    $('dl:first-child a.top, \
       dl:first-child a.up, \
       dl:last-child a.down').addClass("disabled");
  },

  // called on form submit
  addStudent: function(event) {
    event.preventDefault();
    var studentName = app.form.find('[name="studentName"]');

    app.list.prepend(app.buildList(studentName.val(), false));
    app.refreshRoster();
    app.saveList();
    studentName.val('').focus();
  },

  saveList: function() {
    // simplest solution for me to save the list
    // may be changed in the future to reduce time complexity
    var studentList = [];
    $.each(app.list.children(), function(i, dl) {
      studentList.push({
        name: $(dl).children().children().first().text(),
        favorite: (function() {
          if ($(dl).attr("class") === "favorite")
            return true;
          else return false;
        })(),
      });
    });

    localStorage.setItem('roster', JSON.stringify(studentList));
  },

  loadRoster: function(event) {
    $.ajax({
      method: 'get',
      url: 'https://mutant-school.herokuapp.com/api/v1/mutants',
      success: function(roster) {
        $.each(roster, function(i, student) {
          app.list.append(app.buildList(student.real_name, false));
        });
      },
    });
  },

  clearRoster: function(event) {
    this.list.html('');
    app.saveList();
  },
};

app.init('#studentForm', '#studentList');

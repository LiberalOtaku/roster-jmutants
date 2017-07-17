$(document).foundation();

var app = {
  // initialize app
  init: function(formSelector, listSelector, url) {
    this.form = $(formSelector);
    this.list = $(listSelector);
    this.url = url;
    this.setupEventListeners();
    this.refreshRoster();
  },

  setupEventListeners: function() {
    this.form.submit(this.addStudent.bind(this));
    this.form.find('#load').click(this.loadRoster.bind(this));
    this.form.find('#clear').click(this.clearRoster.bind(this));
  },

  // now build the actual list entry for each new name
  buildList: function(real_name, mutant_name, power, id) {
    var dl = $('<dl/>').attr('data-id', id);
    var li = $('<li/>');
    var dt = $('<dt/>').html(' \
      <ul> \
        <li>' + real_name + '</li> \
        <li>' + mutant_name + '</li> \
        <li>' + power + '</li> \
      </ul>');
    var dd = $('<dd/>');
    var buttonGroup = $('<ul/>').attr({"class": "button-group actions"});
    var editGroup = $('<li/>');
    var topGroup = $('<li/>');
    var moveGroup = $('<li/>');

    // create edit button
    var editLink = this.buildLink({
      contents: '<i class="fa fa-pencil fa-lg"></i>',
      class: "edit button tiny radius secondary",
      handler: function() {
        // create edit field
        if ((editLink.attr("class") === "update button tiny radius success")
        && $('[name="editRealName"]').val().length
        && $('[name="editMutantName"]').val().length
        && $('[name="editPower"]').val().length) {
          $.ajax({
            url: app.url + dl.attr('data-id'),
            method: 'patch',
            contentType: "application/json",
            data: JSON.stringify({
              "mutant": {
                "real_name": $('[name="editRealName"]').val(),
                "mutant_name": $('[name="editMutantName"]').val(),
                "power": $('[name="editPower"]').val(),
              }
            }),
            success: function(data) {
              dt.html(' \
                <ul> \
                  <li>' + $('[name="editRealName"]').val() + '</li> \
                  <li>' + $('[name="editMutantName"]').val() + '</li> \
                  <li>' + $('[name="editPower"]').val() + '</li> \
                </ul>');
              editLink.attr("class", "edit button tiny radius secondary");
              editLink.children().first().attr("class", "fa fa-pencil fa-lg");
            },
          });
        }
        else {
          var editRealName = $('<input/>').attr({
            name: "editRealName",
            type: "text",
            "class": "edit medium-6 columns",
            placeholder: "Enter Your Name",
            required: true,
          }).val(dt.children().children().eq(0).text());

          var editMutantName = $('<input/>').attr({
            name: "editMutantName",
            type: "text",
            "class": "edit medium-6 columns",
            placeholder: "Enter Mutant Name",
            required: true,
          }).val(dt.children().children().eq(1).text());

          var editPower = $('<input/>').attr({
            name: "editPower",
            type: "text",
            "class": "edit medium-6 columns",
            placeholder: "Enter Superpower",
            required: true,
          }).val(dt.children().children().eq(2).text());

          dt.html('');
          dt.append(editRealName, editMutantName, editPower);
          dt.children().first().focus().select();
          editLink.attr("class", "update button tiny radius success");
          editLink.children().first().attr("class", "fa fa-check fa-lg");
        }
      }
    });

    // create delete button
    var deleteLink = this.buildLink({
      contents: '<i class="fa fa-times fa-lg"></i>',
      class: "remove button tiny radius alert",
      handler: function() {
        app.list.slideUp();
        $.ajax({
          url: app.url + dl.attr('data-id'),
          method: 'delete',
          success: function() {
            dl.remove();
            app.refreshRoster();
          },
        });
        app.list.slideDown();
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

        // reorder students to API

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

          // reorder students to API

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

          // reorder students to API

        }
      }
    });

    // put it all together
    editGroup.append(editLink, deleteLink);
    moveGroup.append(upLink, downLink);
    buttonGroup.append(editGroup, topGroup.append(topLink), moveGroup);
    return dl.append(li.append(dt, dd.append(buttonGroup)));
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
    $('dl:first-child a.top, dl:first-child a.up, dl:last-child a.down').addClass("disabled");
  },

  // called on form submit
  addStudent: function(event) {
    event.preventDefault();
    this.list.slideUp();

    var realName = this.form.find('[name="realName"]');
    var mutantName = this.form.find('[name="mutantName"]');
    var power = this.form.find('[name="power"]');
    var dl = this.buildList(realName.val(), mutantName.val(), power.val());

    this.list.append(dl);
    $.ajax({
      url: this.url,
      method: 'post',
      contentType: "application/json",
      data: JSON.stringify({
        "mutant": {
          "real_name": realName.val(),
          "mutant_name": mutantName.val(),
          "power": power.val(),
        }
      }),
      success: function(data) {
        dl.attr('data-id', data.id);
        realName.val('').focus();
        mutantName.val('');
        power.val('');
      },
    });

    this.refreshRoster();
    this.list.slideDown();
  },

  loadRoster: function(event) {
    app.form.slideUp();
    $.ajax({
      url: app.url,
      method: 'get',
      success: function(roster) {
        $.each(roster, function(i, mutant) {
          app.list.append(app.buildList(mutant.real_name, mutant.mutant_name, mutant.power, mutant.id));
        });
      },
    });
    app.refreshRoster();
    app.form.slideDown();
  },

  clearRoster: function(event) {
    // DELETE all from API
    $.each(app.list.children(), function(i, dl) {
      $.ajax({
        url: app.url + dl.attr('data-id'),
        method: 'delete',
        success: function() {
          dl.remove();
          app.refreshRoster();
        },
      });
    });
  },
};

app.init('#mutantForm', '#mutantList', 'https://mutant-school.herokuapp.com/api/v1/mutants/');

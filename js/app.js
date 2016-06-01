$(document).foundation();

var app = {

  init: function() {
    var myForm = document.querySelector('form');
    myForm.onsubmit = this.addDetails;
  },

  buildColorDiv: function(color) {
    return '<div style="height: 20px; width: 100px; background-color: ' + color + '"></div>';
  },

  buildList: function(list) {
    var dl = document.createElement('dl');
    dl.style.border = '1px solid red';
    dl.innerHTML += this.buildListItem('Name', list.firstName) +
      this.buildListItem('Hair Color', list.hairColor) +
      this.buildListItem('Age', list.age) +
      this.buildListItem('Birthplace', list.birthplace);

    return dl;
  },

  buildListItem: function(term, definition) {
    return ' \
      <li> \
        <dt>' + term + '</dt> \
        <dd>' + definition + '</dd> \
      </li>';
  },

  addDetails: function(event) {
    event.preventDefault();
    var details = document.querySelector('div.details');
    var hairColor = this.hairColor.value;

    var list = {
      firstName: this.firstName.value,
      hairColor: app.buildColorDiv(hairColor),
      age: this.age.value,
      birthplace: this.birthplace.value
    };

    details.appendChild(app.buildList(list));
  }
};

app.init();

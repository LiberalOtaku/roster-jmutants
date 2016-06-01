$(document).foundation()

var buildColorDiv = function(color) {
  return '<div style="height: 20px; width: 100px; background-color: ' + color + '"></div>';
};

var buildList = function(list) {
  return ' \
    <dl>' +
      buildListItem('Name', list.firstName) +
      buildListItem('Hair Color', list.hairColor) +
      buildListItem('Age', list.age) +
      buildListItem('Birthplace', list.birthplace) + ' \
    </dl>';
};

var buildListItem = function(term, definition) {
  return ' \
    <li> \
      <dt>' + term + '</dt> \
      <dd>' + definition + '</dd> \
    </li>';
};

var addDetails = function(ev) {
  ev.preventDefault();
  var details = document.querySelector('div.details');
  var hairColor = this.hairColor.value;

  var list = {
    firstName: this.firstName.value,
    hairColor: buildColorDiv(hairColor),
    age: this.age.value,
    birthplace: this.birthplace.value
  };

  details.innerHTML += buildList(list);
};

var myForm = document.querySelector('form');
myForm.onsubmit = addDetails;

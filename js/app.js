$(document).foundation()

var buildColorDiv = function(color) {
  return '<div style="height: 20px; width: 100px; background-color: ' + color + '"></div>';
};

var buildList = function(list) {
  return ' \
    <dl> \
      <dt>Name</dt> \
      <dd>' + list.firstName + '</dd> \
        \
      <dt>Hair Color</dt> \
      <dd>' + list.hairColor + '</dd> \
        \
      <dt>Age</dt> \
      <dd>' + list.age + '</dd> \
        \
      <dt>Birthplace</dt> \
      <dd>' + list.birthplace + '</dd> \
    </dl>';
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

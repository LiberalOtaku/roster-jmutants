$(document).foundation();

(function() {
  var buildColorDiv = function(color) {
    return '<div style="height: 20px; width: 100px; background-color: ' + color + '"></div>';
  };

  var buildList = function(list) {
    var dl = document.createElement('dl');
    dl.style.border = '1px solid red';
    dl.innerHTML += buildListItem('Name', list.firstName) +
      buildListItem('Hair Color', list.hairColor) +
      buildListItem('Age', list.age) +
      buildListItem('Birthplace', list.birthplace);

    return dl;
  };

  var buildListItem = function(term, definition) {
    return ' \
      <li> \
        <dt>' + term + '</dt> \
        <dd>' + definition + '</dd> \
      </li>';
  };

  var addDetails = function(event) {
    event.preventDefault();
    var details = document.querySelector('div.details');
    var hairColor = this.hairColor.value;

    var list = {
      firstName: this.firstName.value,
      hairColor: buildColorDiv(hairColor),
      age: this.age.value,
      birthplace: this.birthplace.value
    };

    details.appendChild(buildList(list));
  };

  var myForm = document.querySelector('form');
  myForm.onsubmit = addDetails;
})();

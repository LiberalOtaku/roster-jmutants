$(document).foundation()

var myForm = document.querySelector('form');
myForm.onsubmit = function(ev) {
  ev.preventDefault();
  var details = document.querySelector('div.details');

  var firstName = this.firstName.value;
  var hairColor = this.hairColor.value;
  var age = this.age.value;
  var birthplace = this.birthplace.value;

  var colorDiv = '<div style="height: 20px; width: 100px; background-color: ' + hairColor + '"></div>';

  details.innerHTML += ' \
    <dl> \
      <dt>Name</dt> \
      <dd>' + firstName + '</dd> \
        \
      <dt>Hair Color</dt> \
      <dd>' + colorDiv + '</dd> \
        \
      <dt>Age</dt> \
      <dd>' + age + '</dd> \
        \
      <dt>Birthplace</dt> \
      <dd>' + birthplace + '</dd> \
    </dl>';
};

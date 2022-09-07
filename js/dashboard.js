let habits = [];
let userId = "guest";

// Set user's name and picture
const user = JSON.parse(window.localStorage.getItem('user'));

if (user != null) {
  $('#user-name').text(user.name);
  $('#user-picture').attr('src', user.picture);
  userId = user.email;
}

function populateHabit(element) {
  const habitItem = `
  <li class="d-flex">
    <img src="assets/img/habit-icon.svg" class="m-3 mr-0" />
    <div class="w-100 d-flex habit-details align-items-center">
      <div class="row m-0 flex-column">
        <span class="habit-name">${element.name}</span>
        <span class="habit-goal mt-1 text-lowercase">0 / ${element.goal.number} ${element.goal.times} ${element.goal.per}</span>
      </div>
      <div class="ml-auto mr-3">
        <a class="search-btn mr-2">
          <i class="fa fa-check mr-1"></i>
          Done
        </a>
          <a class="search-btn px-3">
          <i class="fa fa-ellipsis-vertical"></i>
        </a>
      </div>
    </div>
  </li>`;
  $('#list-of-habits').append(habitItem);
}

function populateHabits() {
  habits = JSON.parse(window.localStorage.getItem(`${userId}-habits`));

  if (habits != null) {
    for(const habit of habits) populateHabit(habit);
  }
}

$( document ).ready(
  populateHabits(),
  habitSectionForEmptyList(),
  disableSaveButton()
  );

function disableSaveButton() {
  $('#save-btn')
  .css('cursor', 'default')
  .css('opacity', '30%')
  .prop("onclick", null).off("click");
}

function enableSaveButton() {
  $('#save-btn')
  .css('cursor', 'pointer')
  .css('opacity', '100%')
  .attr("onclick", 'addHabit()');
}

function emptyFields() {
  $('#habit-name').val("");
  $('#goal-number').val("1");
  $('#goal-times').val("Times");
  $('#goal-per').val("Per Day");
}

function habitSectionForEmptyList() {
  if (habits == null) $('.habits-section').removeAttr('hidden')
  else $('.habits-section').attr('hidden', 'true')
}

function addHabit() {
  // Loading existing habits of current user
  let habits = JSON.parse(window.localStorage.getItem(`${userId}-habits`));

  if (habits == null) habits=[];

  const habit = {
    name: $('#habit-name').val(),
    goal: {
      number: parseInt($('#goal-number').val()),
      times: $('#goal-times').find(':selected').val(),
      per: $('#goal-per').find(':selected').val()
    }
  }

  habits.push(habit);

  window.localStorage.setItem(`${userId}-habits`, JSON.stringify(habits));

  populateHabit(habit);
  $('#addHabitModal').modal('toggle');
  $('.habits-section').attr('hidden', 'true');
}

function validate() {
  const value = parseFloat($('#goal-number').val());
  if ($('#habit-name').val() == "" || !Number.isSafeInteger(value) || value < 1 || value > 100) disableSaveButton();
  else enableSaveButton();
}

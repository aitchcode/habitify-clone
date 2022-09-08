let habits = [];
let userId = "guest";

let habitId = null;
let obj = null;

// Set user's name and picture
const user = JSON.parse(window.localStorage.getItem('user'));

if (user != null) {
  $('#user-name').text(user.name);
  $('#user-picture').attr('src', user.picture);
  userId = user.email;
}

const populateHabit = (element) => {
  const habitItem = `
  <li class="d-flex">
    <img src="assets/img/habit-icon.svg" class="m-3 mr-0" />
    <div class="w-100 d-flex habit-details align-items-center">
      <div class="row m-0 flex-column">
        <span class="habit-name">${element.name}</span>
        <span class="habit-goal mt-1 text-lowercase">0 / ${element.goal.number} ${element.goal.times} ${element.goal.per}</span>
      </div>
      <div class="ml-auto mr-3 habit-menu">
        <a class="search-btn mr-2">
          <i class="fa fa-check mr-1"></i>
          Done
        </a>
        <a class="search-btn px-3" id="habitMenu" data-toggle="dropdown">
          <i class="fa fa-ellipsis-vertical"></i>
        </a>
        <div class="dropdown-menu" aria-labelledby="habitMenu">
          <a class="dropdown-item mt-1" href="#">
            <i class="fa fa-check mr-1 text-center"></i>
            Check-in
          </a>
          <a class="dropdown-item" href="#">
            <i class="fa fa-arrow-right mr-1 text-center"></i>
            Skip
          </a>
          <a class="dropdown-item" href="#">
            <i class="fa fa-xmark mr-1 text-center"></i>
            Fail
          </a>
          <a class="dropdown-item mb-1" href="#" data-toggle="modal"
          data-target="#editHabitModal" onclick="populateInputFields('${element.id}')">
            <i class="fa fa-pen mr-1 text-center"></i>
            Edit
          </a>
        </div>
      </div>
    </div>
  </li>`;

  $('#list-of-habits').append(habitItem);
}

const populateHabits = () => {
  $('#list-of-habits').html('');
  habits = JSON.parse(window.localStorage.getItem(`${userId}-habits`));

  if (habits != null) {
    for(const habit of habits) populateHabit(habit);
  }

  searchHabits();
}

const saveHabit = (id) => {
  obj.name = $('#edit-habit-name').val();
  obj.goal.number = $('#edit-goal-number').val();
  obj.goal.times = $('#edit-goal-times').val();
  obj.goal.per = $('#edit-goal-per').val();

  window.localStorage.setItem(`${userId}-habits`, JSON.stringify(habits));
  populateHabits();
  $('#editHabitModal').modal('toggle');
}

const deleteHabit = (id) => {
  habits = habits.filter(habit => habit != obj);

  window.localStorage.setItem(`${userId}-habits`, JSON.stringify(habits));
  populateHabits();
  $('#editHabitModal').modal('toggle');
}

const disableEditSaveButton = () => {
  $('#edit-save-btn')
  .css('cursor', 'default')
  .css('opacity', '30%')
  .prop("onclick", null).off("click");
}

const enableEditSaveButton = (id) => {
  $('#edit-save-btn')
  .css('cursor', 'pointer')
  .css('opacity', '100%')
  .attr("onclick", `saveHabit('${id}')`);
}

// Validate input fields for edit habit
const validateForEdit = () => {
  const value = parseFloat($('#edit-goal-number').val());
  if ($('#edit-habit-name').val() == "" || !Number.isSafeInteger(value) || value < 1 || value > 100) disableEditSaveButton();
  else enableEditSaveButton();
}

const populateInputFields = (id) => {
  $('#delete-habit-btn').attr("onclick", `deleteHabit('${id}')`);
  habitId = id;
  enableEditSaveButton(id);
  obj = habits.find((habit) => habit.id == id);
  $('#edit-habit-name').val(obj.name);
  $('#edit-goal-number').val(obj.goal.number);
  $('#edit-goal-times').val(obj.goal.times);
  $('#edit-goal-per').val(obj.goal.per);
}

const habitSectionForEmptyList = () => {
  if (habits == null) $('.habits-section').removeAttr('hidden')
  else $('.habits-section').attr('hidden', 'true')
}

const disableSaveButton = () => {
  $('#save-btn')
  .css('cursor', 'default')
  .css('opacity', '30%')
  .prop("onclick", null).off("click");
}

$( document ).ready(
  populateHabits(),
  habitSectionForEmptyList(),
  disableSaveButton()
  );

const enableSaveButton = () => {
  $('#save-btn')
  .css('cursor', 'pointer')
  .css('opacity', '100%')
  .attr("onclick", 'addHabit()');
}

const emptyFields = () => {
  $('#habit-name').val("");
  $('#goal-number').val("1");
  $('#goal-times').val("Times");
  $('#goal-per').val("Per Day");
}

const onModalOpen = () => {
  disableSaveButton();
  emptyFields();
}

// Generate random id for new habit
const generateId = () => {
  const random = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return random() + random() + '-' + random() + '-' + random() + random();
}

const addHabit = () => {
  // Loading existing habits of current user
  habits = JSON.parse(window.localStorage.getItem(`${userId}-habits`));

  if (habits == null) habits=[];

  const habit = {
    id: generateId(),
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
  $('.habits-section').attr('hidden', 'true');
  $('#addHabitModal').modal('toggle');
}

// Validate input fields
const validate = () => {
  const value = parseFloat($('#goal-number').val());
  if ($('#habit-name').val() == "" || !Number.isSafeInteger(value) || value < 1 || value > 100) disableSaveButton();
  else enableSaveButton();
}

const searchHabits = () => {
  const searchedHabits = habits.filter(habit => habit.name.toLowerCase().includes($('#search-txt').val().toLowerCase()));
  $('#list-of-habits').html('');
  searchedHabits.forEach(habit => populateHabit(habit));
}
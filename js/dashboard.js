// Set user's name and picture
const user = JSON.parse(window.localStorage.getItem('user'));

$("#user-name").text(user.name);
$("#user-picture").attr("src", user.picture);
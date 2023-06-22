// Google signin
function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);

  // Storing user in local storage
  const user = {
    name: responsePayload.name,
    picture: responsePayload.picture,
    email: responsePayload.email
  }
  window.localStorage.setItem('user', JSON.stringify(user));

  // Redirect to dashboard after successful signin
  window.location.href = "https://habitify-clone.netlify.app/dashboard.html";
}

window.onload = function () {
  google.accounts.id.initialize({
      client_id: "378597707916-k6cav18vjuhtfhoqnv3dkps4bbj5be9t.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      auto_select: true,
      auto: true
  });
  google.accounts.id.renderButton(
      document.getElementById("google-button"),{});
}

function decodeJwtResponse(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function signOut() {
  google.accounts.id.disableAutoSelect();
  location.reload();
}
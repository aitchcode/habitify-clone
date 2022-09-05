// Google signin
function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);
  alert(responsePayload.name);
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
  google.accounts.id.prompt(); 
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
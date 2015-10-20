if(userLoggedInToSquarespace()) {
  window.location = "whatever... " //just do a string replace on window.location to replace https with http
}

function userLoggedInToSquarespace() {
  return window.top != window.self;
}
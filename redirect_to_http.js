function redirectToHTTPWhenUserIsNotLoggedIn() {
	if(userNotLoggedInToSquarespace() && accessingSiteWithHTTPS()) {
		window.location = "http://"+ window.location.hostname + window.location.pathname
	 }
}

function userNotLoggedInToSquarespace() {
  return window.top == window.self;
}

function accessingSiteWithHTTPS() {
	return window.location.protocol == "https:";
}
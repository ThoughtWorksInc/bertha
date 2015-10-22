function userNotLoggedInToSquarespace() {
  return window.top == window.self;
}

function accessingSiteWithHTTPS() {
	return window.location.protocol == "https:";
}
const $alertsBox = $('#alerts');
const $alertsTitle = $('#alerts-title');
const $alertsBody = $('#alerts-body');

window.show_alert = function (title, body) {
	$alertsTitle.text(title);
	$alertsBody.text(body);
	$alertsBox.modal('show');
};
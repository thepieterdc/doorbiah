const $alertsBox = $('#alerts');
const $alertsTitle = $('#alerts-title');
const $alertsBody = $('#alerts-body');

window.show_alert = function (title, body, closeFn) {
	$alertsTitle.text(title);
	$alertsBody.text(body);
	$alertsBox.modal('show');
	
	$alertsBox.on('hidden.bs.modal', function () {
		if (typeof closeFn !== "undefined") {
			closeFn();
		}
	});
};
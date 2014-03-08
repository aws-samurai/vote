var APP_EB_URL = 'http://localhost:8080/eventbus';
var ADDR_VOTE = 'vote';
var ADDR_RESULT = 'result';

var eb = null;
var bg = null;

function subscribe(address) {
    if (eb) {
		eb.registerHandler(address, function(msg, replyTo) {
			var json = JSON.parse(msg);
			bg.addText(json["userName"], json["price"]);
			bg.addStar();
		});
	}
}

function openConn() {
    if (!eb) {
		eb = new vertx.EventBus(APP_EB_URL);

		eb.onopen = function() {
			$("#status_info").text("Connected");
			subscribe(ADDR_RESULT);
		};

		eb.onclose = function() {
			$("#status_info").text("Not connected");
			eb = null;
		};
    }
}

$(document).ready(function() {
    openConn();

	bg = new Background();
	bg.startUp();
});

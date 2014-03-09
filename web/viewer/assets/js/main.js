var APP_EB_URL = 'http://localhost:8080/eventbus';
var ADDR_VOTE = 'viewVote';
var ADDR_STAR = 'viewStar';

var eb = null;
var bg = null;

function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

function subscribe(address) {
    if (eb) {
		eb.registerHandler(address, function(msg, replyTo) {
console.log(msg);
			var json = msg;
			if (is('String', msg)) {
				json = JSON.parse(msg);
			}
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
//			subscribe(ADDR_VOTE);

			if (eb) {
				eb.registerHandler(ADDR_VOTE, function(msg, replyTo) {
					var json = msg;
					if (is('String', msg)) {
						json = JSON.parse(msg);
					}
					bg.addText(json["userName"], json["price"]);
				});
				eb.registerHandler(ADDR_STAR, function(msg, replyTo) {
					bg.addStar();
				});
			}
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

var eb = null;

function send() {
    if (eb) {
		var json = {q: $('#qId').val(), userName: $('#userName').val(), area: $("input:radio[name='area']:checked").val(), price: $('#price').val()};
		eb.send(ADDR_VOTE, json);

		$('#sent').append($("<code>").text($("#current").text() + " | 回答:" + $('#price').val()));
		$('#sent').append($("</code><br>"));

		$('#price').val("");
    }
}

function star() {
    if (eb) {
		eb.send(ADDR_STAR, '');
    }
}

function subscribe(address) {
    if (eb) {
		eb.registerHandler(address, function(msg, replyTo) {
			$('#qTitle').append($('<option>').html(msg.text).val(msg.id));
		});
	}
}

function openConn() {
    if (!eb) {
		eb = new vertx.EventBus(APP_EB_URL);

		eb.onopen = function() {
			$("#status_info").text("Connected");
			$("#sendBtn").removeClass("disabled");
			$("#starBtn").css("visibility","visible");
			subscribe(ADDR_Q);
		};

		eb.onclose = function() {
			$("#status_info").text("Not connected");
			$("#sendBtn").addClass("disabled");
			$("#starBtn").css("visibility","hidden");
			eb = null;
		};
    }
}

$(document).ready(function() {
    openConn();

    for (i=0; i<data.questions.length; i++) {
		var q = data.questions[i];
		$('#qSelect').append($('<option>').html(q.txt).val(q.id));
    }

    $("#qSelect").change(function() {
		var pk = $("#qSelect option:selected").val()
		$("#current").text($("#qSelect option:selected").text());
		$("#qId").val(pk);

		$('#answer').empty();
		for (var key in data["answer"+ pk]) {
			$('#answer').append($('<li>').html(data["answer"+ pk][key]));
		}


    });
    $('#qSelect').trigger('change');
});


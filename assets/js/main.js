var help_btn = document.getElementById("help_btn");

var r_tags;
var curr_tags = [];

var conversation = [];

window.addEventListener("load", (event) => {
	var initial_text = `<p style="text-align: left;">The purpose of this interactive tool is to help you understand what a conversation with Socrates might have looked like. <br><br>Remember you are roleplaying as Dante so try to keep your responses as close to his as possible. <br><br>If you unsure about how to interact with the ML Model you can click the help button to get some help.<br><br> Enjoy!</p>`;
	check_browser();
	Swal.fire({
		icon: "info",
		title: "Welcome to AISocrates",
		html: initial_text,
		footer: '<a href="https://github.com/hernandezcu">Created by Carlos Hernandez</a>',
	});

	axios
		.get("https://aisocrates.xyz/tags")
		.then((response) => {
			// access parsed JSON response data using response.data field
			data = response.data;
			r_tags = data.tags;
		})
		.catch((error) => {
			if (error.response) {
				//get HTTP error code
				console.log(error.reponse.status);
			} else {
				console.log(error.message);
			}
		});
});

help_btn.onclick = function () {
	create_alert("help");
};

function formatAMPM() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	var strTime = hours + ":" + minutes + " " + ampm;
	return strTime;
}

function display_message(message, type) {
	var messages_div = document.getElementById("messages");
	var c = document.createElement("div");

	if (type === "send") {
		c.className = "d-flex justify-content-end mb-4";
		c.innerHTML =
			'<div class="msg_cotainer_send">' +
			message +
			'<span class="msg_time_send">' +
			formatAMPM() +
			", Today</span></div><div class='img_cont_msg'><img src='/assets/img/DAN.jpeg' class='rounded-circle user_img_msg'></div";
		messages_div.appendChild(c);
		scrollToBottom(document.getElementById("messages"));
	} else {
		c.className = "d-flex justify-content-start mb-4";
		c.innerHTML =
			'<div class="img_cont_msg"><img src="/assets/img/SOC.jpeg" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' +
			message +
			'<span class="msg_time">' +
			formatAMPM() +
			", Today</span></div>";
		messages_div.appendChild(c);
		scrollToBottom(document.getElementById("messages"));
	}
}

const scrollToBottom = (node) => {
	const theElement = document.getElementById("messages");
	node.scrollTop = node.scrollHeight;
};

function home() {
	f = document.getElementById("footer");
	f.innerHTML = "";
	f.innerHTML = `<button style="width: 45%;" onclick="show('text');" class="swal2-confirm swal2-styled">Ask a question</button>
    <button style="width: 45%;" onclick="show('topics')" class="swal2-confirm swal2-styled">Ask about a Topic</button>`;
}

function show(mode) {
	f = document.getElementById("footer");
	f.innerHTML = "";
	if (mode === "text") {
		f.innerHTML = `<div class="input-group">
        <div class="input-group-append" onclick="download()">
            <span class="input-group-text attach_btn"><i class="fas fa-file-download"></i></span>
        </div>
        <textarea id="message" name="" class="form-control type_msg" placeholder="Type your message..."></textarea>
        <div class="input-group-append">
            <span onclick="send_message()" class="input-group-text send_btn"><i class="fas fa-location-arrow"></i></span>
        </div>
    </div>`;
	} else if (mode === "topics") {
		var tgs = cap();
		f.style = "align: center;";
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		) {

			f.innerHTML =
				`<div style="width: 50%; align: center;">
                <button onclick="send_topic('` +
				curr_tags[0] +
				`')" class='swal2-confirm swal2-styled box' style="width: 90%;">` +
				tgs[0] +
				`</button>
                <button onclick="send_topic('` +
				curr_tags[1] +
				`')" class='swal2-confirm swal2-styled box' style="width: 90%;">` +
				tgs[1] +
				`</button>
                </div>
                <br><br>
                <div style="width: 50%; align: center;">
                <button onclick="send_topic('` +
				curr_tags[2] +
				`')" class='swal2-confirm swal2-styled box' style="width: 90%;">` +
				tgs[2] +
				`</button>
                <button onclick="send_topic('` +
				curr_tags[3] +
				`')" class='swal2-confirm swal2-styled box' style="width: 90%;">` +
				tgs[3] +
				`</button></div>`;
			console.log("mobile device");
		} else {
			f.innerHTML =
				`
            <button onclick="send_topic('` +
				curr_tags[0] +
				`')" class='swal2-confirm swal2-styled box' style="width: 90%;">` +
				tgs[0] +
				`</button>
            <button onclick="send_topic('` +
				curr_tags[1] +
				`')" class='swal2-confirm swal2-styled box' style="width: 90%;">` +
				tgs[1] +
				`</button>
            <button onclick="send_topic('` +
				curr_tags[2] +
				`')" class='swal2-confirm swal2-styled box' style="width: 90%;">` +
				tgs[2] +
				`</button>
            <button onclick="send_topic('` +
				curr_tags[3] +
				`')" class='swal2-confirm swal2-styled box' style="width: 90%;">` +
				tgs[3] +
				`</button>`;

			console.log("not mobile device");
		}
	}
}

function cap() {
	var i = 0;
	var btn_tags = [];
	curr_tags = [];
	while (i < 4) {
		var s = r_tags[Math.floor(Math.random() * r_tags.length)];
		curr_tags.push(s);
		btn_tags.push(s.charAt(0).toUpperCase() + s.slice(1));
		i++;
	}

	return btn_tags;
}

function send_message() {
	var message = document.getElementById("message").value;
	conversation.push(message);
	conversation.push("\n");
	display_message(message, "send");
	send_query(message);
	document.getElementById("message").value = "";
}

function send_topic(tpc) {
	const sq =
		"https://aisocrates.xyz/tags/patterns?tag=" + encodeURIComponent(tpc);

	show("topics");
	var d;
	axios
		.get(sq)
		.then((response) => {
			data = response.data;
			var c_q =
				data.patterns[0][
					Math.floor(Math.random() * data.patterns[0].length)
				];
			conversation.push(c_q);
			conversation.push("\n");
			display_message(c_q, "send");
			send_query(c_q);
		})
		.catch((error) => {
			if (error.response) {
				console.log(error.reponse.status);
			} else {
				console.log(error.message);
			}
		});
}

function create_alert(mode) {
	if (mode === "not_supported") {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "This action is not currently supported!",
			footer: "",
		});
	}

	if (mode === "help") {
		var initial_text = `
        <p>To Interact with the AI Chatbot you can either:
        <li>Type a question (Click Ask a Question)</li> 
        <li>Select a topic (Click Ask about a Topic)</li>
        <br><br>Enjoy!
        </p>`;

		Swal.fire({
			icon: "question",
			title: "Need help?",
			html: initial_text,
		});
	}
}

function send_query(query) {
	const sq = "https://aisocrates.xyz/query?q=" + encodeURIComponent(query);
	axios
		.get(sq)
		.then((response) => {
			data = response.data;
			display_message("Intent Detected: " + data.tag, "receive");
			display_message(data.response, "receive");
			conversation.push(data.response);
			conversation.push("\n");
		})
		.catch((error) => {
			if (error.response) {
				console.log(error.reponse.status);
			} else {
				console.log(error.message);
			}
		});
}

function check_browser() {
	if (
		navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i)
	) {
		console.log("mobile device");
		document.getElementById("contacts").style = "display: none;";
	}
}

function download() {
	var filename = "conversation.txt";
	var text = conversation.join(",");
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
  
	element.style.display = 'none';
	document.body.appendChild(element);
  
	element.click();
  
	document.body.removeChild(element);
  }
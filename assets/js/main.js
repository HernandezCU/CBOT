var initial_modal = document.getElementById("Modal1");
var help_modal = document.getElementById("Modal2");

var close1 = document.getElementById("close1");
var close2 = document.getElementById("close2");
var help_btn = document.getElementById("help_btn");

window.addEventListener("load", (event) => {
    initial_modal.style.display = "block";
});

help_btn.onclick = function() {
    help_modal.style.display = "block";
}

close1.onclick = function() {
    initial_modal.style.display = "none";
}

close2.onclick = function() {
    help_modal.style.display = "none";
}

window.onclick = function(event) {
    if ((event.target == initial_modal) || (event.target == help_modal)) {
        initial_modal.style.display = "none";
        help_modal.style.display = "none";
    }
}


function formatAMPM() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


function display_message(message, type){
    var messages_div = document.getElementById("messages");
    var c = document.createElement("div");
    var today = new Date();

    if (type === "send") {
        c.className = "d-flex justify-content-end mb-4";
        c.innerHTML = '<div class="msg_cotainer_send">' + message + '<span class="msg_time_send">' + formatAMPM() + ", Today</span></div><div class='img_cont_msg'><img src='/assets/img/DAN.jpeg' class='rounded-circle user_img_msg'></div";
        messages_div.appendChild(c);
        scrollToBottom(document.getElementById('messages'));

    } else {
        c.className = "d-flex justify-content-start mb-4";
        c.innerHTML = '<div class="img_cont_msg"><img src="/assets/img/SOC.jpeg" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + message + '<span class="msg_time">' + formatAMPM() + ", Today</span></div>";
        messages_div.appendChild(c);
        scrollToBottom(document.getElementById('messages'));

    }	
}


const scrollToBottom = (node) => {
    const theElement = document.getElementById('messages');
	node.scrollTop = node.scrollHeight;
}


function show(mode)
{
    f = document.getElementById("footer");
    f.innerHTML = "";
    if (mode === "text"){
        f.innerHTML = `<div class="input-group">
        <div class="input-group-append">
            <span class="input-group-text attach_btn"><i class="fas fa-paperclip"></i></span>
        </div>
        <textarea id="message" name="" class="form-control type_msg" placeholder="Type your message..."></textarea>
        <div class="input-group-append">
            <span onclick="send_message()" class="input-group-text send_btn"><i class="fas fa-location-arrow"></i></span>
        </div>
    </div>`;
        
    }else if (mode === "topics"){
        f.innerHTML = `<table id='topics' style='width: 100%;'><tr><td><button onclick="send_topic('send')" id='send' class='b choices'>Send</button></td><td><button id='clear' class='b choices'>Clear</button></td></tr> <tr><td><button id='start' class='b choices'>Start</button></td><td><button id='stop' class='b choices'>Stop</button></td></tr></table>`;
    }
}

function send_message()
{
    var message = document.getElementById("message").value;
    display_message(message, "send");
    send_query(message);
    document.getElementById("message").value = "";
}

function send_topic(id)
{
    var message = document.getElementById(id).value;
    display_message(message, "send");
}

function send_query(query)
{
    const sq = "http://aisocrates.xyz/query?q=" + encodeURIComponent(query)

    axios.get(sq)
    .then(response => {
        // access parsed JSON response data using response.data field
        data = response.data
        display_message("Intent Detected: " + data.tag, "receive")
        display_message(data.response, "receive")
    })
    .catch(error => {
        if (error.response) {
            //get HTTP error code
            console.log(error.reponse.status)
        } else {
            console.log(error.message)
        }
    })


}
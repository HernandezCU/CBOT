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


function add_to_screen(message, type){
    var messages_div = document.getElementById("messages");
    var c = document.createElement("div");
    var today = new Date();

    if (type === "send") {
        c.className = "d-flex justify-content-end mb-4";
        c.innerHTML = '<div class="msg_cotainer_send">' + message + '<span class="msg_time_send">' + formatAMPM() + ", Today</span></div><div class='img_cont_msg'><img src='/assets/img/DAN.jpeg' class='rounded-circle user_img_msg'></div";
        messages_div.appendChild(c);
    } else {
        c.className = "d-flex justify-content-start mb-4";
        c.innerHTML = '<div class="img_cont_msg"><img src="/assets/img/SOC.jpeg" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + message + '<span class="msg_time">' + formatAMPM() + ", Today</span></div>";
        messages_div.appendChild(c);
    }	
}
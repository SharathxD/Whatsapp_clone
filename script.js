const cont_lists_ele = document.getElementById('lp_contact_lists');
const rp_header_img = document.getElementById('rp_header_img');
const rp_text_input = document.getElementById('rp_text_input');
const rp_hero = document.getElementById('rp_hero');
const rp_header_cont_name = document.getElementById('rp_header_cont_name');
const rp_msg_form = document.getElementById('rp_msg_form');
const display_cont_data = document.getElementById('show_cd_data');
const display_cont_img = document.getElementById('show_cd_img');
let isAscend = false;
let cont_lists = "";
let selt_cont = "";
let filtered_list = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
let n = 14; //No. of contact; n = list_dp.length, also works
let pre_ele;

function darken_color(e)  {
    e.style.backgroundColor = 'rgb(255, 255, 255)';
    if (pre_ele && pre_ele!==e) {
        pre_ele.style.backgroundColor = '';
    }
    pre_ele = e;
}

function change_rp_content(name, img_src) {
    /* rp_header_img.attributes[2].nodeValue = "./Images/contact_dp_images/cont_dp_biden.jpg"; */
    rp_header_img.setAttribute('src',`./Images/contact_dp_images/${img_src}.jpg`);
    rp_header_cont_name.innerHTML = name;
    chg_rp_hero(selt_cont);
}

function msg_ele(msg_text, msg_sr) {
    //msg_sr stands for msg_sender_receiver
    return `
    <div class="rp_msg_design ${msg_sr}">
        ${msg_text}
    </div>
    `;
}

function chg_rp_hero(ele_msgs) {
    display_msgs = cont_msg[ele_msgs];

    if (display_msgs === undefined) {
        display_msgs = cont_msg['Group'];
        rp_text_input.disabled = true;
        rp_text_input.style.backgroundColor = 'lightgray';
    }
    else {
        rp_text_input.disabled = false;
        rp_text_input.style.backgroundColor = '';
    }

    let render_msg = "";
    for (let i = 0; i < display_msgs.length; i++) {
        if (display_msgs[i][0] === '$') {
            render_msg += msg_ele(display_msgs[i].slice(1), 'rp_msg_cont');
        }
        else {
            render_msg += msg_ele(display_msgs[i], 'rp_msg_you')
        }
    }

    rp_hero.innerHTML = render_msg;
    rp_hero.scrollTo(0, rp_hero.scrollHeight);
}

function send_msg(e) {
    e.preventDefault();
    let msg = rp_text_input.value;
    let index = list_names.indexOf(selt_cont);

    if (msg === "" || msg === "$") {
        alert("Null String/Text not allowed");
        return;
    }
    
    cont_msg[selt_cont].push(msg);
    if (msg[0] === '$') {
        rp_hero.innerHTML += msg_ele(msg.slice(1), 'rp_msg_cont');
        recent_msg[index] = selt_cont.split(" ")[0] + ": " + msg.slice(1);
    }
    else {
        rp_hero.innerHTML += msg_ele(msg, 'rp_msg_you');
        recent_msg[index] = msg;
    }

    cont_lists = select_cont_list(filtered_list);
    render_cont_list(cont_lists);
    selected_cont(document.getElementById(selt_cont));
    rp_hero.scrollTo(0, rp_hero.scrollHeight);
    rp_text_input.value = "";
}

function srh_by_query(e) {
    
    filtered_list = [];
    for (let i = 0; i < n; i++) {
        if (list_names[i].toLowerCase().includes(e.value)) {
            filtered_list.push(i);
        } 
    }
    cont_lists = select_cont_list(filtered_list);
    render_cont_list(cont_lists);
    selected_cont(document.getElementById(selt_cont));
    
}

function ascend_cont_list() {
    const ascend_list = [];
    for (let i = 0; i < filtered_list.length; i++) {
        let j = filtered_list[i];
        ascend_list.push(list_names[j]);
    }
    ascend_list.sort();
    if (isAscend) {
        ascend_list.reverse()
        
    }
    isAscend = !isAscend;
    const new_filter_list = [];
    for (let i = 0; i < ascend_list.length; i++) {
        let j = list_names.indexOf(ascend_list[i]);
        new_filter_list.push(j);
    }

    filtered_list = new_filter_list;
    cont_lists = select_cont_list(filtered_list);
    render_cont_list(cont_lists);
    selected_cont(document.getElementById(selt_cont));
}

function selected_cont(e) {
    if (e) {
    selt_cont = e.getAttribute('id');
    darken_color(e);
    change_rp_content(e.getAttribute('id'), e.getAttribute('data-img-src'));
    }
}

function crt_cont_ele(img_src, cont_name, rec_msg) {
    return `
    <div onclick="selected_cont(this)" class="lp_contact_list"
    data-img-src=${img_src} id="${cont_name}">
        <img class="lp_contact_dp" 
        src="./Images/contact_dp_images/${img_src}.jpg"  alt="" />
        <div class="lp_contact_details">
            <h3>${cont_name}</h3>
            <p>${rec_msg}</p>
        </div>
    </div>
    `;
}

function render_cont_list(content) {
    if (content) {
    cont_lists_ele.innerHTML = content;
    }
    else {
    cont_lists_ele.innerHTML = `
    <div class="lp_no_cont_found">
        <h3>😵No Contact Found</h3>
        <p>Please give a valid query</p>
    </div>`;
    }
}

function select_cont_list(filtered_list) {
    cont_lists = "";
    for (let i = 0; i < filtered_list.length; i++) {
        let j = filtered_list[i];
        cont_lists = cont_lists + 
        crt_cont_ele(list_dp[j], list_names[j], recent_msg[j]);
    }
    return cont_lists;
}

function close_display(e) {
    e.classList.add('fade_out');
    setTimeout(() => {
        e.classList.remove('fade_out');
        e.style.display = 'none';
    }, 100);
}

function display_cont(e, is_me) {
    display_cont_img.src = `${e.src}`;
    display_cont_data.children[0].src = `${e.src}`;
    if (is_me) {
        display_cont_data.children[1].innerHTML = 'Bokuto';
    }
    else {
    display_cont_data.children[1].innerHTML = rp_header_cont_name.innerHTML;
    }
    document.getElementById('show_cont_details').style.display = 'flex';
}

rp_msg_form.addEventListener('submit', send_msg);
cont_lists = select_cont_list(filtered_list);
render_cont_list(cont_lists);
selected_cont(document.getElementById(list_names[0]));

const boxSize = 64;
const fieldX = 100;
const fieldY = 100;
const fieldZ = 100;

const offsetTop = fieldZ * boxSize/2;
const offsetLeft = fieldX * boxSize/2;
const offsetZIdx = 1000;

const strokeStyle = "rgba(0,0,0, 1)";
const lineWidth = 1;

let yuka = 0;
let data;
function init() {

    let floor = document.getElementById('floor');
    for (let z = 0; z < fieldZ; z++) {
        let option = document.createElement("option");
        option.value = z;
        option.innerHTML = ("0" + z).slice( -2 );
        floor.appendChild(option);
    }

    let event = document.getElementById('event');
    for (let eid = 0; eid < 256; eid++) {
        let option = document.createElement("option");
        let eid16 = ("0" + eid.toString(16)).slice( -2 ).toUpperCase();
        option.value = eid16;
        option.innerHTML = eid16;
        event.appendChild(option);
    }

    let field = document.getElementById('field');
    for (let y = 0; y < fieldY; y++) {
        let tr = document.createElement("tr");
        for (let x = 0; x < fieldX; x++) {
            let td = document.createElement("td");
            let input = document.createElement("input");
            input.id = x + "_" + y;;
            input.type = "text";
            input.size = "2";
            input.className = "cell";
            input.addEventListener('mouseover', hover);
            input.addEventListener('focusout', valueChange);
            input.addEventListener('keydown', keydown);
            input.addEventListener('click', ipClick);
            td.appendChild(input);
            tr.appendChild(td);
        }
        field.appendChild(tr);
    }
    if (d) loadJson(d);
    floorLoad();
    eventLoad();
}
function eventLoad() {
    const event = document.getElementById('event').value;
    const eventList = document.getElementById('eventList');
    while(eventList.childNodes && eventList.childNodes.length > 0) {
        eventList.removeChild(eventList.lastChild);
    }
    for (let z = 0; z < fieldZ; z++) {
        for (let y = 0; y < fieldY; y++) {
            for (let x = 0; x < fieldX; x++) {
                if (data[z][y][x] == event) {
                    let option = document.createElement("option");
                    option.value = z;
                    option.innerHTML = ("0" + z).slice( -2 ) + "階 / 南" + ("0" + y).slice( -2 ) + ", 東" + ("0" + x).slice( -2 );
                    eventList.appendChild(option);
                }
            }
        }
    }
}

function hover(e) {
    const elm = e.target;
    position(elm);
}
function position(elm) {
    const east = elm.id.split("_")[0];
    const south = elm.id.split("_")[1];
    const floor = document.getElementById('floor').value*1;
    let evUp = "×";
    let evDn = "×";
    if (data[floor][south][east] != '') {
        for (let z = floor -1; z > 0; z--) {
            if (data[z][south][east] != '') {
                evUp = ("0" + z).slice( -2 ) + "階";
                break;
            }
        }
        for (let z = floor +1; z < fieldZ; z++) {
            if (data[z][south][east] != '') {
                evDn = ("0" + z).slice( -2 ) + "階";
                break;
            }
        }
    }
    const pos = "南" + ("0" + south).slice( -2 ) + ", 東" + ("0" + east).slice( -2 ) + " / ↑:" + evUp + ", ↓:" + evDn;
    document.getElementById('pos').value = pos;
}


function floorLoad() {
    yuka = 0;
    const floor = document.getElementById('floor').value*1;
    data[floor];
    for (let y = 0; y < fieldY; y++) {
        for (let x = 0; x < fieldX; x++) {
            const elm = document.getElementById(x + "_" + y);
            if (data[floor][y][x]) {
                elm.value = data[floor][y][x];
                yuka++;
            }else {
                data[floor][y][x] = "";
                elm.value = "";
            }
            waku(elm, floor);
        }
    }
    console.log(yuka + "床");
}

function ipClick(e) {
    position(e.target);
    valueChange(e);
}

function valueChange(e) {
    const floor = document.getElementById('floor').value*1;
    const elm = e.target;
    waku(elm, floor);
}

function waku(elm, floor) {
    const x = elm.id.split("_")[0];
    const y = elm.id.split("_")[1];
    data[floor][y][x] = elm.value;
    if (elm.value) {
        if(elm.value != " ") elm.value = elm.value.trim();
        elm.className = "cell";
        updown(elm, x, y, floor);
    } else {
        elm.className = "none";
    }
}
function updown(elm, x, y, floor) {
    if (data[floor-1] && data[floor-1][y][x]) {
        elm.className += " stairsUp";
    } else {
        elm.className += " noStairsUp";
    }
    if (data[floor+1] && data[floor+1][y][x]) {
        elm.className += " stairsDown";
    } else {
        elm.className += " noStairsDown";
    }

}

function keydown(e){
    const elm = e.target;
    const flr = document.getElementById('floor');
    let x = elm.id.split("_")[0];
    let y = elm.id.split("_")[1];
    switch(e.keyCode) {
        case 38: y--; break;
        case 40: y++; break;
        case 37: x--; break;
        case 39: x++; break;
        case 35:
            flr.selectedIndex++;
            if (flr.selectedIndex > fieldZ) flr.selectedIndex = fieldZ;
            floorLoad();
            return;
        case 36:
            flr.selectedIndex--;
            if (flr.selectedIndex < 0) flr.selectedIndex = 0;
            floorLoad();
            return;
        default: break;
    }
    if (x < 0) x = 0;
    if (fieldX <= x) x = fieldX -1;
    if (y < 0) y = 0;
    if (fieldX <= y) y = fieldY -1;
    const next = document.getElementById(x + "_" + y);
    next.focus();
    e.target = next;
    position(next);
}

function op() {
    let json = "{";
    json += '"v":2';
    let d = "[";
    for (let z = 0; z < fieldZ; z++) {
        if (z != 0) d+= ",";
        d += '{"d":[';
        let top = 0;
        let bottom = fieldY;
        for (let y = 0; y < fieldY; y++) {
            if (data[z][y].join('') == '') top++
            else break;
        }
        for (let y = fieldY-1; y >= 0 && y >= top; y--) {
            if (data[z][y].join('') == '') bottom--;
            else break;
        }
        for (let y = top; y < bottom; y++) {
            if (y != top) d+= ",";
            let left = 0;
            let right = 0;
            for (let x = 0; x < fieldX; x++) {
                if (data[z][y][x] == '') left++
                else break;
            }
            for (let x = fieldX-1; x >= 0 && x >= left; x--) {
                if (data[z][y][x] == '') right++;
                else break;
            }
            d += '{"l":'+left+ ',"r":'+right+ ',"d":' + JSON.stringify(data[z][y].slice(left, fieldX-right)) + '}';
        }
        d += '],"t":'+top+'}\n';
    }
    json += ',"data":' + d + ']}';
    document.getElementById('data').value = json;
}

function ip() {
    let d = JSON.parse(document.getElementById('data').value);
    loadJson(d);
}
function loadJson(d) {

    let xyzArr = new Array(fieldZ);
    for (let z = 0; z < fieldZ; z++) {
        xyzArr[z] = new Array(fieldY);
    }
    data = xyzArr;

    if (d["v"]) {
        let tmp = d["data"];
        for (let z = 0; z < fieldZ; z++) {
            let flr = tmp[z]["d"];
            let top = tmp[z]["t"];
            for (let y = 0; y < top; y++) {
                data[z][y] = new Array(fieldX).fill("");
            }
            for (let y = 0; y < flr.length; y++) {
                data[z][y+top] = (new Array(flr[y]["l"]).fill("")).concat(flr[y]["d"]).concat(new Array(flr[y]["r"]).fill(""));
            }
            for (let y = top+flr.length; y < fieldY; y++) {
                data[z][y] = new Array(fieldX).fill("");
            }
        }
    } else {
      data = d;
    }
    floorLoad();
}

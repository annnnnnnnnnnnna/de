const boxSize = 64;
const fieldX = 100;
const fieldY = 100;
const fieldZ = 100;

const offsetTop = fieldZ * boxSize/2;
const offsetLeft = fieldX * boxSize/2;
const offsetZIdx = 1000;

const strokeStyle = "rgba(0,0,0, 1)";
const lineWidth = 1;

data = [];

function init() {
    let xyzArr = new Array(fieldZ);
    for (let z = 0; z < fieldZ; z++) {
        let xyArr = new Array(fieldY);
        for (let y = 0; y < fieldY; y++) {
            let arr = new Array(fieldX).fill("");
            xyArr[y] = arr;
        }
        xyzArr[z] = xyArr;
    }
    data = xyzArr;
    data[0][50][50] = "00";

    let floor = document.getElementById('floor');
    for (let z = 0; z < fieldZ; z++) {
        let option = document.createElement("option");
        option.value = z;
        option.innerHTML = z;
        floor.appendChild(option);
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
            input.addEventListener('mouseover', position);
            input.addEventListener('focusout', valueChange);
            input.addEventListener('click', ipClick);
            td.appendChild(input);
            tr.appendChild(td);
        }
        field.appendChild(tr);
    }
    floorLoad();
}
function position(e) {
    const elm = e.target;
    const east = elm.id.split("_")[0];
    const south = elm.id.split("_")[1];
    const pos = "南" + south + " 東" + east;
    document.getElementById('pos').value = pos;
}

function floorLoad() {
    const floor = document.getElementById('floor').value*1;
    data[floor];
    for (let y = 0; y < fieldY; y++) {
        for (let x = 0; x < fieldX; x++) {
            const elm = document.getElementById(x + "_" + y);
            if (data[floor][y][x]) elm.value = data[floor][y][x];
            else {
                data[floor][y][x] = "";
                elm.value = "";
            }
            waku(elm, floor);
        }
    }
}

function ipClick(e) {
    if (!document.getElementById('mode0').checked) return;
    if (!e.target.value) {
        e.target.value = " ";
    } else if (e.target.value == " "){
        e.target.value = "";
    }
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

function op() {
    document.getElementById('data').value = JSON.stringify(data);
}

function ip() {
    data = JSON.parse(document.getElementById('data').value);
    floorLoad();
}

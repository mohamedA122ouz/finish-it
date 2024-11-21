"use strict";
let h1 = document.querySelector("h1");
document.body.style.backgroundSize = `${window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight}px`;
document.querySelector("#container").setAttribute("style", `max-width:${window.innerWidth}px`);
document.querySelector("header").setAttribute("style", `max-width:${window.innerWidth}px`);
// window.addEventListener("resize", () => {
//     document.body.style.backgroundSize = `${window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight}px`;
//     document.querySelector("#container").setAttribute("style", `width:${window.innerWidth}px`);
//     document.querySelector("header").setAttribute("style", `max-width:${window.innerWidth}px`);
// });
let list = null;
let direction = 'ltr';
let storage = {
    IndexSave: (index, value) => {
        let arr = storage.GGet("list");
        ////console.log(arr[index]);
        arr[index] = value;
        //console.log(arr);
        storage.GSave("list", arr);
    },
    GSave: (itemname, value) => {
        localStorage.setItem(itemname, value);
        return `the ${itemname} is stored successfully`;
    },
    GGet: (itemname) => {
        if (localStorage.getItem(itemname)) {
            let value = localStorage.getItem(itemname).split(',');
            return value;
        }
    },
    save: (arr) => {
        if (!list) { return 0; }
        localStorage.setItem("list", arr.filter(ele => ele));
        storage.savecheck(-1);
        return "saved";
    },
    saveForAdd: (arr) => {
        let data = localStorage.getItem("list").split(',').concat(arr);
        let data2 = localStorage.getItem("checkState").split(',').concat([0]);
        localStorage.setItem("list", data.filter(el => el));
        localStorage.setItem("checkState", data2.filter(el => el));
        control.additem("restore");
        return "addition saved";
    },
    del: (index) => {
        let data = localStorage.getItem("list").split(',');
        data[index] = null;
        let data2 = localStorage.getItem("checkState").split(',');
        data2[index] = null;
        data = data.filter(ele => ele);
        data2 = data2.filter(ele => ele);
        localStorage.setItem("list", data);
        localStorage.setItem("checkState", data2);
        control.additem("restore");
        return "item deleted";
    },
    //save whether checkbox checked or not in localstorage
    savecheck: (root) => {
        if (root === -1) {
            let listPro = storage.GGet("list");
            let checkState = [];
            for (let i = 0; i < listPro.length; i++) {
                if (!listPro[i]) { continue; }
                let check = control.select(`#c${i}`);
                checkState.push(check.checked);
            }
            localStorage.setItem("checkState", checkState);
        }
        else {
            let changer = localStorage.getItem("checkState").slice(0, localStorage.getItem("checkState").length).split(',');
            let check = control.select(`#c${root}`);
            changer[root] = check.checked;
            localStorage.setItem("checkState", changer);
        }
    },
    //restore checked item
    restoreChecks: () => {
        let items = [""];
        if (localStorage.getItem("checkState")) {
            items = localStorage.getItem("checkState").split(',');
        }
        for (let i = 0; i < items.length; i++) {
            let span = control.select(`#s${i}`);
            let check = control.select(`#c${i}`);
            if (items[i] === "true") {
                check.checked = true;
                span.classList.add("checked");
            }
        }
    }
};
let panel = {
    //show edit list panel
    hidden: false,
    container: {},
    saveType: "update",//value is either update or add
    container2: (query) => { return document.querySelector(`${query}`) },
    structure: `
    <button class="deactivate" onclick="panel.controls.literalClick(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg></button>
    <div contenteditable = "true" tabindex="-1" id="textc" oninput="panel.text = this.innerHTML,panel.dirct(this.innerHTML[0])"></div><br>
    <div id="panelbuttons">
        <button id="clear" onclick="panel.clear()"><p>clear</p></button>
        <button id="save" onclick="panel.save()"><p>save</p></button>
        <button id="hide" onclick="panel.hide()"><p>Hide</p></button>
    </div>
`,
    //determine the direction for list direction and the edit panel
    dirct: (test, root) => {
        if (test) {
            let a = "أ".charCodeAt(0);
            let z = "ي".charCodeAt(0);
            if (test.charCodeAt(0) >= a && test.charCodeAt(0) <= z)
                direction = "rtl";
            else
                direction = "ltr";
        }
        root === 0 ? 0 : panel.self.style.direction = direction;
    },
    controls: {
        litralList: false,
        literalClick: (obj) => {
            if (control.editedItem.index === -1) {
                if (panel.controls.litralList) {
                    obj.setAttribute("class", "deactivate");
                    panel.controls.litralList = false;
                } else {
                    panel.controls.litralList = true;
                    obj.setAttribute("class", "activate");
                }
            }
            else {
                control.showAlert("sorry can not use this property while editing an item!", null, "control.hideAlert()", "OK", " ")
            }
        },
    },
    getself: () => { return document.querySelector("#textc"); },
    self: {},
    text: null,
    show: function () {
        this.container = this.container2("#textReady");
        this.self = this.getself();
        this.container.style.display = "block";
        this.hidden = false;
        this.self.focus();
    },
    build: function () {
        this.text = null;
        if (!this.hidden) {
            this.text = null;
            this.controls.litralList = false;
            this.container = this.container2("#textReady");
            this.container.innerHTML = this.structure;
            this.self = this.getself();
            this.self.focus();
        }
        else
            this.show();
    },
    //hide edit list panel
    hide: () => {
        control.editedItem.index = -1;
        control.editedItem.text = null;
        control.isitadd = false;
        panel.hidden = true;
        panel.container.style.display = "none";
    },
    del: () => {
        panel.container.innerHTML = "";
    },
    //save and clear buttons functionalities
    saveOnAdd: () => {
        control.isitadd = false;
        panel.del();
        control.processForAdd(panel.text);
        return panel.text;
    },
    clear: () => {
        panel.self.innerHTML = null;
    },
    save: (i) => {
        if (panel.controls.litralList)
            panel.text = panel.text.replace(new RegExp('<div>', 'g'), '\\n');
        if (panel.text) {
            panel.text = panel.text.replace(new RegExp(',', 'g'), "&!comma;");
            if (control.editedItem.text) {
                panel.del();
                storage.IndexSave(control.editedItem.index, panel.text);
                control.editedItem.text = null;
                control.editedItem.index = -1;
                control.additem("restore");
            }
            else if (!control.isitadd) {
                list = panel.text;
                control.additem('new items');
                panel.del();
                return panel.text;
            }
            else {
                panel.saveOnAdd();
            }
        }
    }
};

let control = {
    listPro: "",
    isitadd: false,
    hideOl: () => {
        control.select("ol").innerHTML = null;
    },
    addbutton: () => {
        if (storage.GGet("list")) {
            control.editedItem = { text: null, index: -1 };
            control.isitadd = true;
            panel.build();
        }
        else {
            control.showAlert('There is no existed list to Add on it!', false, 'control.start()', 'Add New list', 'Cancel');
        }
    },
    savebutton: () => {
        control.isitadd = false;
        control.hideOl();
        panel.build();
        control.hideAlert();
    },
    select: (item) => document.querySelector(`${item}`)//select item form document
    ,
    selectAll: (items) => document.querySelector(`${items}`),
    //process input
    processData: (root) => {
        let listPro = [""];
        if (root === "new items")
            listPro = list.split('\\n') || list;
        else {
            if (localStorage.getItem("list"))
                listPro = localStorage.getItem("list").split(',');
            else {
                control.showAlert('Do you want to add new list?', false, 'control.start()', 'Add', 'Cancel');
            }
        }
        return listPro;
    },
    processForAdd: (value) => {
        value = value.split('\\n') || value;
        storage.saveForAdd(value);
    },
    unblurElseWhere: () => {
        let header = document.querySelector("header");
        let container = document.querySelector("#container");
        header.style.filter = "brightness(100%)";
        header.style.filter = "blur(0px)";
        container.style.filter = "brightness(100%)";
        container.style.filter = "blur(0px)";
    },
    //adding all items from edit list panel if root = -1 else it gets the element from localstorage
    additem: (root) => {
        control.listPro = control.processData(root);
        //console.log(listPro);
        let ol = control.select("#listIt");
        let item = "";
        let letgo = true;
        for (let i = 0; i < control.listPro.length; i++) {
            if (control.listPro[i]) {
                item +=
                    `<li class="vertical" onmousedown="control.swapHandler2(this,${i})" ontouchstart="control.swapHandler2(this,${i})" onmouseup ="control.clearHold()" ontouchcancel ="control.clearHold()" ontouchend ="control.clearHold()">${i + 1}-&nbsp;
                    <div class = "olLi ${control.enableSelect.select ? "select" : "noselect"}" id="s${i}" onmousedown ="control.swapHandler(this.parentElement,${i})" >
                    ${control.listPro[i].replace(new RegExp('&!comma;', 'g'), ",") || "item not specified"}
                    </div>
                    <div class="alignment"></div>
                    <button class="delete" onclick="control.showAlert('Are you sure you want to delete item number ${i + 1} ?',${i},'control.delItem()','Yes','No')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                        </svg>
                    </button>
                    <button class="edit" onclick="control.edit(${i})" title="Add new list and delete old one if exist"><svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill"
                    viewBox="0 0 16 16">
                    <path
                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg></button>
                <div class ="check">
                    <input type="checkbox" id="c${i}" class="checkbox" onclick="control.checkItem(${i})">
                    <div class ="checkshow"></div>
                </div>
                    </li>`;
                letgo = false;
            }
            else if (control.listPro.length - 1 === i && letgo) {
                //this just for try 
                item = `<span>${"Empty List"}</span>`;
                ol.innerHTML = item;
                setTimeout(() => {
                    panel.build();
                    ol.innerHTML = "";
                }, 1000);
            }
        }
        ol.innerHTML = item;
        root === "restore" ? panel.dirct(control.listPro[0][0], 0) : 0;
        ol.style.direction = direction;
        root === "restore" ? storage.restoreChecks() : 0;
        root === "new items" ? storage.save(control.listPro) : 0;
    },
    //check if the checkbox for an item is checked if checked it gives the item class checked and by css it shows the throw line 
    //else which means that the chcekbox became unchecked the else will remove the class and the item get back to it's default font style
    checkItem: (i) => {
        let span = document.querySelector(`#s${i}`);
        let check = document.getElementById(`c${i}`);
        if (check.checked)
            span.classList.add("checked");
        else
            span.classList.remove("checked");
        storage.savecheck(i);
    },
    hideAlert: () => {
        control.unblurElseWhere();
        document.querySelector("#addAlert").innerHTML = null;
        control.deleteItemIndex = null;
    },
    deleteItemIndex: null,
    editedItem: { text: null, index: -1 },
    edit: (i) => {
        control.editedItem.text = storage.GGet("list")[i];
        control.editedItem.index = i;
        //console.log(i);
        panel.controls.litralList = false;
        control.isitadd = true;
        panel.build();
        panel.getself().innerHTML = control.editedItem.text;
    },
    showAlert(alertContent, i = null /*index if exist*/, wantedFunction = 'control.hideAlert()', buttonTrueName, buttonFalseName) {
        let alert = ` <div id="alert">
        <div id="warning">
            <div id="alert-i"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor"
                    class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path
                        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg></div>
            <p>${alertContent}</p>
        </div>
        <hr>
        <div id="alertbuttons">
            <button onclick='${wantedFunction}'><p>${buttonTrueName || "yes"}</p></button>
            <button onclick='control.hideAlert()'><p>${buttonFalseName || "no"}</p></button>
        </div>
    </div>`;
        let alertprop = document.querySelector("#addAlert");
        alertprop.innerHTML = alert;
        control.blurElseWhere();
        control.deleteItemIndex = i;
    },
    delItem: () => {
        if (control.targetnum === null) {
            storage.del(control.deleteItemIndex);
            console.log(localStorage.getItem("list"));
            control.unblurElseWhere();
            control.hideAlert();
            control.deleteItemIndex = null;
            control.editedItem.index = -1
            control.editedItem.text = null;
        }
        else {
            control.showAlert("sorry cannot delete target as it is in swap process!", null, "control.hideAlert()", "OK", " ");
        }
    },
    blurElseWhere: () => {
        let header = document.querySelector("header");
        let container = document.querySelector("#container");
        header.style.filter = "brightness(0.5)";
        header.style.filter = "blur(4px)";
        container.style.filter = "brightness(25%)";
        container.style.filter = "blur(4px)";
    },
    swapCounter: 0,
    lastel: null,
    target: null,
    targetnum: null,
    swapHandler: (el, num) => {
        if (control.enableTriple) {
            if (control.lastel === null)
                control.lastel = el;
            else if (control.lastel !== el) {
                control.lastel.removeAttribute("style");
                if (control.target) {
                    control.swapitems(num);
                }
                control.swapCounter = 0;
                control.lastel = null;
            }
            else {
                control.selectSwapItem(el,num);
            }
        }
        else if (control.lastel) {
            if (control.lastel.getAttribute("style"))
                control.lastel.removeAttribute("style");
            control.targetnum = null;
        }
    },
    //select in memory and set styles for selected element
    selectSwapItem: function (el,num) {
        if (this.lastel === el)
            this.swapCounter++;
        if (this.swapCounter === 2) {
            //console.log("worked");
            el.style.backgroundColor = "#5ebd68";
            this.target = el;//target elemrnt is the element which became dark gray
            this.targetnum = num;
        }
        if (this.swapCounter === 3) {
            ////console.log("here");
            this.swapCounter = 0;
            this.lastel.removeAttribute("style");
            this.target = null;
            this.targetnum = null;
        }
    },
    IntervalID: 0,
    holdercount: 0,
    //hold function to get hold when user hold an li
    swapHandler2: function (el, num) {
        console.log("started");
        this.IntervalID = setInterval(() => {
            this.holdercount++;
            console.log(this.holdercount);
            if (this.holdercount == 1) {
                this.swapCounter = 1;
                this.lastel = el;
                this.selectSwapItem(el, num);
                console.log("Ready")
            }
            else if (this.holdercount > 2) {
                clearInterval(this.IntervalID);
                console.log("cleared");
            }
        }, 1000)
    },
    replace:function(num){
        let list = storage.GGet("list");
        let check = storage.GGet("checkState");
        let temp = list[this.targetnum];//taregtnum is selected item num,num is the new place;
        list.splice(num,0,temp);
        list.splice(this.targetnum,1);
        ////console.log(list);
        storage.GSave("list", list);
        storage.GSave("checkState", check);
        control.additem("restore");
        let targetnum = this.targetnum;
        control.targetnum = null;
        control.target = null;
        let color = "skyblue";
        document.querySelectorAll("li")[targetnum].style.backgroundColor = color;
        document.querySelectorAll("li")[num-1].style.backgroundColor = color;
        setTimeout(()=>{
            document.querySelectorAll("li")[num-1].removeAttribute("style");
            document.querySelectorAll("li")[targetnum].removeAttribute("style");
        },800);
    },
    clearHold: function () {
        clearInterval(this.IntervalID);
        this.holdercount = 0;
        console.log("cleared");
    },
    enableTriple: false,
    enableSelect: {
        select: false,
        set: (el) => {
            control.enableSelect.select = el.checked;
            document.querySelectorAll(".olLi").forEach(
                (ve) => {
                    let check = el.checked ? "select" : "noselect";
                    let check2 = el.checked ? "noselect" : "select";
                    ve.classList.replace(check2, check);
                }
            );
            storage.GSave("textSelect", `${el.checked}`);
        }
    },
    swapitems: function (num) {
        let list = storage.GGet("list");
        let check = storage.GGet("checkState");
        let temp = list[num];
        list[num] = list[control.targetnum];
        list[control.targetnum] = temp;
        temp = check[num];
        check[num] = check[control.targetnum];
        check[control.targetnum] = temp;
        ////console.log(list);
        storage.GSave("list", list);
        storage.GSave("checkState", check);
        control.additem("restore");
        let targetnum = this.targetnum;
        control.targetnum = null;
        control.target = null;
        let color = "skyblue";
        document.querySelectorAll("li")[targetnum].style.backgroundColor = color;
        document.querySelectorAll("li")[num].style.backgroundColor = color;
        setTimeout(()=>{
            document.querySelectorAll("li")[targetnum].removeAttribute("style");
            document.querySelectorAll("li")[num].removeAttribute("style");
        },800);
    },
    start: (alert) => {
        if (storage.GGet("list")) {
            control.isitadd = false;
            control.showAlert('You are about replacing all items in the list !', false, 'control.savebutton()', 'Ok', 'Cancel');
        }
        else
            control.savebutton();
    },
    copyToClipboard: function (el) {
        let github = window.location.href;
        let copyMSG = document.querySelector(".copy");
        navigator.clipboard.writeText(github).then(function () {
            copyMSG.classList.add("makeblock");
            setTimeout(() => {
                copyMSG.classList.remove("makeblock");
                copyMSG.classList.add("makenone");
            }, 3000)
        },function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
};
let settings = {
    focus: () => {
        settings.settingsOpened = false;
    },
    settingsOpened: true,
    show: () => {
        settings.settingsOpened = true;
        let setting = document.querySelector("#settings");
        setting.style.display = "flex";
        setting.style.flexDirection = "column";
        setTimeout(() => {
            setting.setAttribute("class", "show-settings");
        }, 1);
        control.blurElseWhere();
        setTimeout(() => {
            setting.focus();
        }, 350)
    },
    hide: () => {
        ////console.log("hide in process!");
        if (settings.settingsOpened) {
            let setting = document.querySelector("#settings");
            setting.removeAttribute("class");
            setTimeout(() => {
                setting.style.display = "none";
                settings.settingsOpened = false;
            }, 350);
            control.unblurElseWhere();
        }
    },
    getFont: () => {
        let font = document.querySelector("#font");
        return font.value === "browser default" ? false : font.value;
    },
    fontSize: () => {
        let size = document.querySelector("#fontsize").value;
        return `${size}pt`;
    },
    apply: () => {
        let font = settings.getFont();
        let size = settings.fontSize()
        let html = document.querySelector("html").style;
        if (font) {
            html.fontFamily = font;
        }
        html.fontSize = size;
        settings.hide();
        storage.GSave("swap", control.enableTriple);
        storage.GSave("font", font);
        storage.GSave("fontSize", size);
    },
    restoreAndApply: () => {
        let sizeEl = document.querySelector("#fontsize");
        let fontEl = document.querySelector("#font");
        let swap = document.querySelector("#enableSwap");
        let selectText = document.querySelector("#selectText");
        let html = document.querySelector("html").style;
        if (!storage.GGet("font")) {
            settings.apply();
        }
        else {
            let font = storage.GGet("font")[0];
            if (font) {
                html.fontFamily = font;
            }
            let size = storage.GGet("fontSize")[0];
            html.fontSize = size;
            sizeEl.value = size.replace("pt", "");
            fontEl.value = font;
            control.enableTriple = storage.GGet("swap").join('') == "true" ? true : false;
            swap.checked = control.enableTriple;
            if(storage.GGet("textSelect"))
            selectText.checked = storage.GGet("textSelect").join('') == "true" ? true : false;;
            control.enableSelect.set(selectText);
        }
    }
};
function showinfo() {
    let info = document.querySelector(".info");
    info.click();
}
let notFirstOpen = localStorage.getItem("firstOpen");
if (notFirstOpen)
    control.additem("restore");
else {
    control.showAlert("Welcon to finish it website!", null, "showinfo()", "Show Info", "don't show info");
    localStorage.setItem("firstOpen", "true");
}
//you can restore you old work
// (function notifyme() {
//     if (Notification.permission == "granted" && localStorage.getItem("notification") != "false") {
//         setTimeout(() => {
//             localStorage.setItem("notification", "false");
//             let noti = new Notification("TO-List",
//                 {
//                     body: "site uses cookies to restore old session!",
//                     icon: "icon/todo.png"
//                 }
//             )
//         }, 1000)
//     }
//     else if (Notification.permission == "denied") {
//         return 0;
//     }
//     else {
//         Notification.requestPermission().then(() => {
//             ////console.log(Notification.permission);
//         })
//     }
// })();
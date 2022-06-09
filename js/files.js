let filesContainer = document.getElementById("files-container");
let filesOptions = document.getElementById("files-options");

let fileTypeDropDown = new DropDown("file-types");
fileTypeDropDown.setTitle("Type de fichier");
fileTypeDropDown.addItem("Sans erreur", "0");
fileTypeDropDown.addItem("Avec erreur", "1");
fileTypeDropDown.onChanged((value) => {
    isFilesPaginationAdded = false;
    getFiles();
});

filesOptions.insertAdjacentElement("afterbegin", fileTypeDropDown.getElement());


let fileDatesDropDown = new DropDown("file-dates");
fileDatesDropDown.setTitle("Dates");
fileDatesDropDown.addItem("Janvier", "1");
fileDatesDropDown.addItem("Février", "2");
fileDatesDropDown.addItem("Mars", "3");
fileDatesDropDown.addItem("Avril", "4");
fileDatesDropDown.addItem("Mai", "5");
fileDatesDropDown.addItem("Juin", "6");
fileDatesDropDown.addItem("Juillet", "7");
fileDatesDropDown.addItem("Aout", "8");
fileDatesDropDown.addItem("Septembre", "9");
fileDatesDropDown.addItem("Octobre", "10");
fileDatesDropDown.addItem("Novembre", "11");
fileDatesDropDown.addItem("Décembre", "12");
fileDatesDropDown.onChanged((value) => {
    isFilesPaginationAdded = false;
    getFiles();
});
filesOptions.insertAdjacentElement("beforeend", fileDatesDropDown.getElement());


let fileTab = document.getElementById("file-tab");
fileTab.addEventListener("click", () => {
    isFilesPaginationAdded = false;
    getFiles();
});
window.onload = function () {
}

let filesLimit = 9;
let isFilesPaginationAdded = false;

function getFiles(offset = 0) {
    filesContainer.innerHTML = "<div class='peeek-loading'>" +
        "  <ul>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "  </ul>" +
        "</div>";


    let formData = new FormData();
    if (fileTypeDropDown.value() != null && fileTypeDropDown.value() !== "none") {
        formData.append("fileType", fileTypeDropDown.value());
    }
    if (fileDatesDropDown.value() != null && fileDatesDropDown.value() !== "none") {
        formData.append("month", fileDatesDropDown.value());
    }
    formData.append("offset", String(offset));
    formData.append("limit", String(filesLimit));
    formData.append("type", "getFiles");
    let http = new Http("../Views/files.php", "POST", formData);
    http.onSuccessCallback((data) => {
        filesContainer.innerHTML = "";
        let json = JSON.parse(data);
        console.log(json);
        for (let i = 0; i < json.data.length; i++) {
            addFile(json.data[i]);
        }
        addDownloadListener();
        addDeleteListener();
        if (!isFilesPaginationAdded) {
            isFilesPaginationAdded = true;
            let totalPage = Math.ceil(json.count / filesLimit);
            if (totalPage > 1) {
                addPagination(filesPagination, pagination, getFiles, totalPage, filesLimit);
            }else {
                pagination.remove();
            }
        }
    });
    http.start();
}

let filesPagination = document.getElementById("files-pagination");
let pagination = document.createElement("div");
pagination.classList.add("pagination");


function addPagination(main, container, callback, total, limit) {
    container.innerHTML = "";
    let prev = document.createElement("a");
    let itemLimit = 3;

    function onPaginationClick(elm) {
        let selected = container.querySelector(".selected");
        if (selected != null) {
            selected.classList.remove("selected");
        }
        let id = Number.parseInt(elm.getAttribute("data-id"));
        if (id === 0) {
            selected.nextSibling.click();
            return;
        } else if (id === -1) {
            selected.previousSibling.click();
            return;
        }

        let nextSibling = elm.nextSibling;
        let n = 1;
        if (id < total - 2) {
            while (nextSibling != null) {
                let nextId = Number(nextSibling.getAttribute("data-id"));
                if (n <= itemLimit) {
                    if (n === itemLimit) {
                        if (nextId !== total) {
                            nextSibling.classList.remove("hidden");
                            nextSibling.innerText = "";
                            nextSibling.classList.add("dot");
                        } else {
                            nextSibling.innerText = nextSibling.getAttribute("data-id");
                            nextSibling.classList.remove("hidden", "dot");
                        }
                    } else {
                        nextSibling.classList.remove("hidden", "dot");
                        nextSibling.innerText = nextSibling.getAttribute("data-id");
                    }
                } else {
                    if (nextId === total) {
                        nextSibling.classList.remove("hidden", "dot");
                        nextSibling.innerText = nextSibling.getAttribute("data-id");
                    } else {
                        nextSibling.classList.remove("hidden", "dot");
                        nextSibling.classList.add("hidden");
                    }
                }
                nextSibling = nextSibling.nextSibling;
                n++;
            }
        } else if (nextSibling != null) {
            nextSibling.classList.remove("hidden", "dot");
            nextSibling.innerText = nextSibling.getAttribute("data-id");
        }

        let prevSibling = elm.previousSibling;
        let p = 1;
        if (id > 2) {
            while (prevSibling != null) {
                let prevId = Number(prevSibling.getAttribute("data-id"));
                if (prevId === -1) {
                    break;
                }
                if (p <= itemLimit) {
                    if (p === itemLimit) {
                        if (prevId !== 1) {
                            prevSibling.classList.remove("hidden");
                            prevSibling.innerText = "";
                            prevSibling.classList.add("dot");
                        } else {
                            prevSibling.innerText = prevSibling.getAttribute("data-id");
                            prevSibling.classList.remove("hidden", "dot");
                        }
                    } else {
                        prevSibling.classList.remove("hidden", "dot");
                        prevSibling.innerText = prevSibling.getAttribute("data-id");
                    }
                } else {
                    if (prevId === 1) {
                        prevSibling.classList.remove("hidden", "dot");
                        prevSibling.innerText = prevSibling.getAttribute("data-id");
                    } else {
                        prevSibling.classList.remove("hidden", "dot");
                        prevSibling.classList.add("hidden");
                    }
                }
                prevSibling = prevSibling.previousSibling;
                p++;
            }
        }

        elm.classList.add("selected");

        if (id === 1) {
            prev.classList.add("hidden")
        } else if (id === total) {
            next.classList.add("hidden")
        }
        if (id > 1) {
            prev.classList.remove("hidden");
            prev.innerText = "Prev";
        }
        if (id < total) {
            next.classList.remove("hidden");
            next.innerText = "Next";
        }
        callback(id === 1 ? 0 : ((id - 1) * limit));
    }

    prev.classList.add("pagination-btn", "prev", "hidden");
    prev.setAttribute("data-id", "-1");
    prev.innerText = "Prev";
    prev.onclick = () => onPaginationClick(prev);
    container.appendChild(prev);

    for (let i = 1; i <= total; i++) {
        let item = document.createElement("a");
        if (i === 1) {
            item.classList.add("pagination-btn", "selected");
        } else {
            item.classList.add("pagination-btn");
        }
        item.setAttribute("data-id", String(i));
        item.innerText = String(i);
        item.onclick = () => onPaginationClick(item);
        if (i === 4 && total > 4) {
            item.classList.add("dot");
            item.innerText = "";
        } else if (i > 4 && i < total) {
            item.classList.add("hidden");
        }
        container.appendChild(item);
    }
    let next = document.createElement("a");
    next.classList.add("pagination-btn", "next");
    next.setAttribute("data-id", "0");
    next.innerText = "Next";
    next.onclick = () => onPaginationClick(next);
    if (total > 1) {
        container.appendChild(next);
    }

    main.insertAdjacentElement("beforeend", container);

}


function addDownloadListener() {
    let downloadItems = filesContainer.getElementsByClassName("c-download-item-download");
    for (let i = 0; i < downloadItems.length; i++) {
        downloadItems[i].addEventListener("click", function () {
            let formData = new FormData();
            formData.append("type", "download");
            formData.append("id", this.parentElement.getAttribute("data-id"));
            let http = new Http("../Views/files.php", "POST", formData);
            http.onSuccessCallback((data) => {
                try {
                    let json = JSON.parse(data);
                    if (json.status === "ok") {
                        const url = window.URL.createObjectURL(new Blob([json.content]));
                        let link = document.createElement("a");
                        link.setAttribute('download', this.parentElement.getAttribute("data-name") + ".csv");
                        link.href = url;
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                    }
                } catch (e) {
                    console.error(e);
                }

            })
            http.start();
        });
    }

}

function addDeleteListener() {
    let deleteItems = filesContainer.getElementsByClassName("c-download-item-delete");
    for (let i = 0; i < deleteItems.length; i++) {
        deleteItems[i].addEventListener("click", function () {
            let dialog = document.createElement("div");
            dialog.classList.add("dialog");
            dialog.innerHTML = "<p>Are you sure you want to delete this file?</p>";
            let dialogFooter = document.createElement("div");
            dialogFooter.classList.add("dialog-footer");
            let yes = document.createElement("button");
            yes.addEventListener("click", () => {
                let formData = new FormData();
                formData.append("type", "remove");
                formData.append("id", this.parentElement.getAttribute("data-id"));
                let http = new Http("../Views/files.php", "POST", formData);
                http.onSuccessCallback((data) => {
                    let json = JSON.parse(data);
                    if (json.deleted) {
                        this.parentElement.remove();
                    }
                    getError();
                });
                http.start();
                dialog.remove();
            });
            yes.classList.add("yes");
            yes.innerText = "YES";
            let no = document.createElement("button");
            no.innerText = "NO";
            no.classList.add("no");
            no.addEventListener("click", () => {
                dialog.remove();
            });
            dialogFooter.insertAdjacentElement("afterbegin", yes);
            dialogFooter.insertAdjacentElement("beforeend", no);
            dialog.insertAdjacentElement("beforeend", dialogFooter);
            filesContainer.insertAdjacentElement("beforeend", dialog);
        });
    }
}

function addFile(file) {
    let icon = file.error ? "../medias/csv-file-format.png" : "https://cdn-icons-png.flaticon.com/512/1263/1263920.png";
    let html = "<div class=\"grid-item c-download-item\" data-name='" + file.name + "' data-id='" + file.id + "'>\n" +
        "      <div class=\"c-download-item__img\">\n" +
        "          <img src=\"" + icon + "\" alt=\"\"\n" +
        "               width=\"38\">\n" +
        "      </div>\n" +
        "      <div class=\"c-download-item__body\">\n" +
        "          <div class=\"c-download-item__text\"><strong>" + file.name + "</strong></div>\n" +
        "          <div class=\"c-download-item__text\">" + file.size + "</div>\n" +
        "          <div class=\"c-download-item__text\">" + file.date + "</div>\n" +
        "      </div>\n" +
        "      <div class=\"c-download-item__actions c-download-item-download\">\n" +
        "          <svg class=\"c-download-item__icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\"\n" +
        "               height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\n" +
        "               stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"" +
        "               data-reactid=\"466\">" +
        "              <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path>\n" +
        "              <polyline points=\"7 10 12 15 17 10\"></polyline>\n" +
        "              <line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line>\n" +
        "          </svg>" +
        "      </div>" +
        "     <div class=\"c-download-item__actions c-download-item-delete\">" +
        "       <div class=\"circle\">" +
        "           <svg class=\"c-download-item__icon\" width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z\"/></svg>" +
        "           <div class=\"circle_loader\">" +
        "           </div>" +
        "     </div>" +
        "    </div>" +
        "  </div>";
    filesContainer.insertAdjacentHTML("beforeend", html);

}

let notificationOptions = document.getElementById("notification-options");


let notificationNamesDropDown = new DropDown("notification-names W-100");
notificationNamesDropDown.setTitle("Établissement");
notificationNamesDropDown.onChanged((value) => {
    isNotificationPaginationAdded = false;
    getErrorNotification();
});
notificationOptions.insertAdjacentElement("afterbegin", notificationNamesDropDown.getElement());

let notifyFileDatesDropDown = new DropDown("notification-dates");
notifyFileDatesDropDown.setTitle("Dates");
notifyFileDatesDropDown.addItem("Janvier", "1");
notifyFileDatesDropDown.addItem("Février", "2");
notifyFileDatesDropDown.addItem("Mars", "3");
notifyFileDatesDropDown.addItem("Avril", "4");
notifyFileDatesDropDown.addItem("Mai", "5");
notifyFileDatesDropDown.addItem("Juin", "6");
notifyFileDatesDropDown.addItem("Juillet", "7");
notifyFileDatesDropDown.addItem("Aout", "8");
notifyFileDatesDropDown.addItem("Septembre", "9");
notifyFileDatesDropDown.addItem("Octobre", "10");
notifyFileDatesDropDown.addItem("Novembre", "11");
notifyFileDatesDropDown.addItem("Décembre", "12");
notifyFileDatesDropDown.onChanged((value) => {
    isNotificationPaginationAdded = false;
    getErrorNotification();
});

notificationOptions.insertAdjacentElement("beforeend", notifyFileDatesDropDown.getElement());

let notifyCount = document.getElementById("notify-count");

let notificationDropdown = document.getElementById("notification-dropdown");
let btnNotification = document.getElementById("btn-notification");
btnNotification.addEventListener("click", () => {
    if (notificationDropdown.style.display === "none") {
        notificationDropdown.style.display = "block";
        let formData = new FormData();
        formData.append("type", "readAll");
        let http = new Http("../Views/files.php", "POST", formData);
        http.onSuccessCallback((data) => {
            let json = JSON.parse(data);
            if (json.status === "ok") {
                notifyCount.remove();
            }
        });
        http.start();
    } else {
        notificationDropdown.style.display = "none";
    }
});

getEtabNames();

function getEtabNames() {
    let formData = new FormData();
    formData.append("type", "getEtabNames");
    let http = new Http("../Views/files.php", "POST", formData);
    http.onSuccessCallback((data) => {
        let json = JSON.parse(data);
        if (json.status === "ok") {
            for (let name of json.names) {
                notificationNamesDropDown.addItem(name, name);
            }
        }
    });
    http.start();
}

let notificationContainer = document.getElementById("notification-container");
let notificationItemsContainer = document.getElementById("notification-items");

getError();

function getError() {
    notificationItemsContainer.innerHTML = "";
    let formData = new FormData();
    formData.append("type", "getError");
    let http = new Http("../Views/files.php", "POST", formData);
    http.onSuccessCallback((data) => {
        let json = JSON.parse(data);
        let unseenCount = 0;
        for (let i = 0; i < json.data.length; i++) {
            if (json.data[i].is_seen === 0) {
                unseenCount++;
            }
            addNotification(json.data[i]);
        }
        notifyCount.innerText = unseenCount;

        if (unseenCount === 0) {
            notifyCount.remove();
        } else {
            btnNotification.insertAdjacentElement("afterbegin", notifyCount);
        }
    });
    http.start();
}

function addNotification(file) {
    let errors = JSON.parse(file.error);
    for (let key in errors) {
        notificationItemsContainer.insertAdjacentHTML("beforeend",
            "<p class=\"dropdown-item\">" + key + " (" + errors[key].length + ")" + "</p>");
    }
}

let notificationLimit = 9;
let isNotificationPaginationAdded = false;

function getErrorNotification(offset = 0) {
    notificationContainer.innerHTML = "<div class='peeek-loading'>" +
        "  <ul>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "    <li></li>" +
        "  </ul>" +
        "</div>";

    let formData = new FormData();
    formData.append("type", "getError");
    if (notificationNamesDropDown.value() != null && notificationNamesDropDown.value() !== "none") {
        formData.append("name", notificationNamesDropDown.value());
    }
    if (notifyFileDatesDropDown.value() != null && notifyFileDatesDropDown.value() !== "none") {
        formData.append("month", notifyFileDatesDropDown.value());
    }
    formData.append("offset", String(offset));
    formData.append("limit", String(notificationLimit));
    let http = new Http("../Views/files.php", "POST", formData);
    http.onSuccessCallback((data) => {
        notificationContainer.innerHTML = "";
        let json = JSON.parse(data);
        console.log(json);
        if (json.status === "ok") {
            for (let i = 0; i < json.data.length; i++) {
                addCardNotification(json.data[i]);
            }
            addCardListener();
            if (!isNotificationPaginationAdded) {
                isNotificationPaginationAdded = true;
                let totalPage = Math.ceil(json.count / notificationLimit);
                if (totalPage > 1) {
                    addPagination(notificationPagination, nPagination,
                        getErrorNotification, totalPage, notificationLimit);
                }else {
                    nPagination.remove();
                }

            }
        }
    });
    http.start();
}

function addCardNotification(file) {
    let ids = new Set();
    let errors = JSON.parse(file.error);
    for (let key in errors) {
        errors[key].filter((id) => {
            ids.add("<li>" + id + "</li>");
        });

        let card = document.createElement("div");
        card.classList.add("card", "col-md-4");
        card.addEventListener("click", (e) => {
            e.preventDefault();
            if (card.parentElement.classList.contains("showing")) {
                let activeCards = card.parentElement.getElementsByClassName("d-card-show");
                if (activeCards.length === 1) {
                    if (activeCards[0] === card) {
                        card.parentElement.classList.remove("showing");
                        card.classList.remove("d-card-show");
                    } else {
                        activeCards[0].classList.remove("d-card-show");
                    }
                } else {
                    card.parentElement.classList.add("showing");
                    card.classList.add("d-card-show");
                }
            } else {
                card.parentElement.classList.add("showing");
                card.classList.add("d-card-show");
            }
        });
        card.insertAdjacentHTML("beforeend",
            "<div class='card-title'>" +
            "      <h2>" +
            "        <strong>" + key + "</strong>" +
            "        <small>" + file.date + "</small>" +
            "      </h2>" +
            "      <div class='task-actions'>" +
            "       <div class='task-count'>" + ids.size +
            "       </div>" +
            "       <button class=\"task-delete\" data-id='" + file.id + "'>" +
            "           <svg class=\"c-download-item__icon\" width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z\"/></svg>" +
            "       </button>" +
            "      </div>" +
            "    </div>\n" +
            "    <div class='card-flap flap1'>\n" +
            "      <div class='card-description'>\n" +
            "        <ul class='task-list'>" + Array.from(ids).join("") +
            "        </ul>" +
            "      </div>" +
            "      <div class='card-flap flap2'>\n" +
            "        <div class='card-actions'>\n" +
            "          <a class='btn' href='#'>Fermer</a>\n" +
            "        </div>\n" +
            "      </div>\n" +
            "    </div>");
        notificationContainer.insertAdjacentElement("beforeend", card);
    }

}

let notificationPagination = document.getElementById("notification-pagination");
let nPagination = document.createElement("div");
nPagination.classList.add("pagination");

function addCardListener() {
    let taskDelete = document.getElementsByClassName("task-delete");
    for (let i = 0; i < taskDelete.length; i++) {
        taskDelete[i].addEventListener("click", function (e) {
            e.stopPropagation();
            let dialog = document.createElement("div");
            dialog.classList.add("dialog");
            dialog.innerHTML = "<p>Are you sure you want to delete this file?</p>";
            let dialogFooter = document.createElement("div");
            dialogFooter.classList.add("dialog-footer");
            let yes = document.createElement("button");
            yes.addEventListener("click", () => {
                let formData = new FormData();
                formData.append("type", "delete");
                formData.append("id", this.getAttribute("data-id"));
                let http = new Http("../Views/files.php", "POST", formData);
                http.onSuccessCallback((data) => {
                    let json = JSON.parse(data);
                    if (json.deleted) {
                        this.parentElement.parentElement.parentElement.remove();
                    }
                    getError();
                });
                http.start();
                dialog.remove();
            });
            yes.classList.add("yes");
            yes.innerText = "YES";
            let no = document.createElement("button");
            no.innerText = "NO";
            no.classList.add("no");
            no.addEventListener("click", () => {
                dialog.remove();
            });
            dialogFooter.insertAdjacentElement("afterbegin", yes);
            dialogFooter.insertAdjacentElement("beforeend", no);
            dialog.insertAdjacentElement("beforeend", dialogFooter);
            let messagesTab = document.getElementById("messages");
            messagesTab.insertAdjacentElement("beforeend", dialog);
        });
    }
}

let messagesTab = document.getElementById("messages-tab");
messagesTab.addEventListener("click", () => {
    isNotificationPaginationAdded = false;
    getErrorNotification();
});


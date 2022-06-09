class DropDown {
    dropDown;
    titleText;
    dropDownContainer;
    preview;
    containerWrapper;
    backdrop;

    constructor(id = null) {
        this.dropDown = document.createElement("div");
        this.dropDown.classList.add("DropDown");
        if (id != null) {
            this.dropDown.id = id;
        }

        this.backdrop = document.createElement("div");
        this.backdrop.classList.add("backdrop");
        this.backdrop.onclick = () => {
            this.close();
        };

        this.preview = document.createElement("div");
        this.preview.classList.add("preview");
        this.preview.onclick = () => {
            if (this.dropDown.classList.contains("open")) {
                this.close();
            } else {
                this.open();
            }
        };
        this.titleText = document.createElement("p");
        this.titleText.innerText = "None";
        this.preview.insertAdjacentElement("afterbegin", this.titleText);
        this.preview.insertAdjacentHTML("beforeend", "<div class='arrow'></div>");
        this.dropDown.insertAdjacentElement("afterbegin", this.preview);

        this.dropDownContainer = document.createElement("div");
        this.dropDownContainer.classList.add("dropdown-container", "CustomScroll");
        this.containerWrapper = document.createElement("div");
        this.containerWrapper.classList.add("container-wrapper")
        this.containerWrapper.insertAdjacentElement("afterbegin", this.dropDownContainer);
        this.dropDown.insertAdjacentElement("beforeend", this.containerWrapper);
    }

    setTitle(title) {
        this.titleText.innerText = title;
        this.addItem(title, "none");
    }

    addItem(title, value) {
        let item = document.createElement("div");
        item.classList.add("item-dropdown");
        item.innerHTML = "<p>" + title + "</p>";
        item.value = value;
        item.onclick = () => {
            let selected = this.dropDownContainer.querySelector(".item-dropdown.selected");
            if (selected != null) {
                selected.classList.remove("selected");
            }
            item.classList.add("selected");
            this.titleText.innerText = title;
            this.close();
            this.changedCallback(value);
        };
        this.dropDownContainer.insertAdjacentElement("beforeend", item);
    }

    changedCallback;

    onChanged(callback) {
        this.changedCallback = callback;
    }

    open() {
        this.containerWrapper.insertAdjacentElement("afterbegin", this.backdrop);
        this.containerWrapper.style.top = String(this.preview.clientHeight + 4) + "px";
        this.dropDown.classList.add("open");
    }

    close() {
        this.backdrop.remove();
        this.dropDown.classList.remove("open");
    }

    value() {
        let selected = this.dropDownContainer.querySelector(".item-dropdown.selected");
        if (selected != null) {
            return selected.value;
        }
        return null;
    }


    getElement() {
        return this.dropDown;
    }
}
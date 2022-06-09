class Http {
    #url = null;
    #method = "GET";
    #formData = null;
    #onsuccess = null;
    #onerror = null;
    #ontimeout = null;

    #isDownloader = false;

    constructor(url, method, formData) {
        this.#url = url;
        this.#method = method;
        this.#formData = formData;
    }

    setDownloader(value) {
        this.#isDownloader = value;
    }

    setFormData(formData) {
        this.#formData = formData;
    }

    onSuccessCallback(callback) {
        this.#onsuccess = callback;
    }

    onErrorCallback(callback) {
        this.#onerror = callback;
    }

    onTimeoutCallback(callback) {
        this.#ontimeout = callback;
    }

    start() {
        let xhttp = new XMLHttpRequest();
        xhttp.open(this.#method, this.#url, true);
        xhttp.send(this.#formData);
        let thisClass = this;

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (thisClass.#onsuccess != null) {
                    if (thisClass.#isDownloader) {
                        thisClass.#onsuccess(xhttp.response);
                    } else {
                        thisClass.#onsuccess(xhttp.responseText);
                    }
                }
            }
        }

        xhttp.onerror = function () {
            if (thisClass.#onerror != null) {
                thisClass.#onerror();
            }
        }

        xhttp.ontimeout = function () {
            if (thisClass.#ontimeout != null) {
                thisClass.#ontimeout();
            }
        }

    }

}
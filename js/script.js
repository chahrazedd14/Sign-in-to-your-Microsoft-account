$('.btn-expand-collapse').click(function (e) {
    $('.navbar-primary').toggleClass('collapsed');
});


const subOptionFilter = (master, slave) => {

    const ref = [].slice.call(slave.children).slice(1);

    const background = document.createDocumentFragment();
    return () => {
        const value = master.value;

        console.log('subOptionFilter');
        const foreground = document.createDocumentFragment();
        ref.map(option => {
            if (option.classList.contains(value) || !value || value === "all") {
                foreground.appendChild(option);
                return;
            }
            option.parent === background || background.appendChild(option);
            option.selected = false;
        });
        slave.appendChild(foreground)
    }
}

let dropdownMenuButton = document.getElementById("dropdownMenuButton");
dropdownMenuButton.onclick = () => {
    let userOption = document.getElementById("user-option");
    if (userOption.style.display === "none"){
        userOption.style.display = "block";
    }else {
        userOption.style.display = "none";
    }
};



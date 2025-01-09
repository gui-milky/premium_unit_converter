//htmx onload to readd the listener when hx-get or post is called
htmx.onLoad(() => {
    //store previous value of unit in dataset
    //so that when user selects same unit in both dropdowns
    //swap the values using the dataset
    const firstUnitBox = document.getElementById('first-unit');
    const secUnitBox = document.getElementById('sec-unit');
    
    function updatePrevUnit() {
        this.dataset.prevUnit = this.value;
    }
    
    firstUnitBox.addEventListener('click', updatePrevUnit);
    secUnitBox.addEventListener('click', updatePrevUnit);
    
    firstUnitBox.addEventListener('change', () => {
        if (firstUnitBox.value === secUnitBox.value) {
            secUnitBox.value = firstUnitBox.dataset.prevUnit;
        };
    });
    
    secUnitBox.addEventListener('change', () => {
        if (secUnitBox.value === firstUnitBox.value) {
            firstUnitBox.value = secUnitBox.dataset.prevUnit;
        }
    });
})

//nav-links active
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach((link) => {
    link.addEventListener('click', function() {
        //turn off all the nav link
        for (let child of this.parentNode.children){
            child.classList.add('border-transparent');
        }
        //turn on the one user has clicked
        this.classList.toggle('border-transparent');
    });
});

//redirect to home
function redirectTimer(target, miliseconds) {setTimeout(() => {
    window.location = target;
}, miliseconds)}

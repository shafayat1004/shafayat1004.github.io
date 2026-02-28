function navbarMod() {
    if(isMobile){
        navbar.classList.add("fixed-bottom");
        navbar.classList.remove("sticky-top");
    }
    else{
        navbar.classList.remove("fixed-bottom");
        navbar.classList.add("sticky-top");
    }
}

let navbar = document.querySelector(".navbar");
let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
// console.log(navbar);
navbarMod();

let navbarBrand = document.querySelector(".navbar-brand");
let navPills = document.querySelectorAll(".nav-link");

navPills.forEach(navPill => {
    navPill.addEventListener("click", changeNavbarBrand);
    navPill.addEventListener("click", collapseNavbar);
});

function collapseNavbar() {
    // Collapse the navbar on mobile when a link is clicked
    let navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
    }
}

function changeNavbarBrand() {
    let activePill = document.querySelector(".nav-link.active");
    let activePillID = activePill.id
    switch (activePillID) {
        case "personal-tab":
            navbarBrand.innerHTML = ("Mir Shafayat Ahmed")
            break;
        case "education-tab":
            navbarBrand.innerHTML = ("Education")
            break;
        case "work-experience-tab":
            navbarBrand.innerHTML = ("Work Experience")
            break;
        case "projects-tab":
            navbarBrand.innerHTML = ("Projects")
            break;
        default:
            navbarBrand.innerHTML = ("Mir Shafayat Ahmed")
            break;
    }
}
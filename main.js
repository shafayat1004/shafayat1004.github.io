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
        case "cv-tab":
            navbarBrand.innerHTML = ("Resume")
            break;
        default:
            navbarBrand.innerHTML = ("Mir Shafayat Ahmed")
            break;
    }
}

function printResumeFromIframe() {
    const frame = document.getElementById("cv-iframe");
    if (frame && frame.contentWindow && frame.contentDocument) {
        const doPrint = () => {
            frame.contentWindow.focus();
            frame.contentWindow.print();
        };

        if (frame.contentDocument.readyState === "complete") {
            doPrint();
        } else {
            frame.addEventListener("load", doPrint, { once: true });
        }
        return;
    }
    window.alert("Resume is still loading. Please try again.");
}

function downloadResumePdf() {
    const link = document.createElement("a");
    link.href = "static/resume.pdf";
    link.download = "Mir_Shafayat_Ahmed_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
}

const cvPrintBtn = document.getElementById("cv-print-btn");
const cvDownloadBtn = document.getElementById("cv-download-btn");

if (cvPrintBtn) {
    cvPrintBtn.addEventListener("click", printResumeFromIframe);
}

if (cvDownloadBtn) {
    cvDownloadBtn.addEventListener("click", downloadResumePdf);
}
const slideStates = {};

function showSlide(modal, index) {
    const slides = modal.querySelectorAll(".slide");
    slides.forEach((s, i) => {
        s.classList.toggle("active", i === index);
    });
}

document.querySelectorAll(".nextSlide").forEach(btn => {
    btn.onclick = () => {
        const modal = btn.closest(".modal");
        const slides = modal.querySelectorAll(".slide");
        const id = modal.id;

        if (!(id in slideStates)) slideStates[id] = 0;

        slideStates[id] = (slideStates[id] + 1) % slides.length;
        showSlide(modal, slideStates[id]);
    };
});

document.querySelectorAll(".prevSlide").forEach(btn => {
    btn.onclick = () => {
        const modal = btn.closest(".modal");
        const slides = modal.querySelectorAll(".slide");
        const id = modal.id;

        if (!(id in slideStates)) slideStates[id] = 0;

        slideStates[id] = (slideStates[id] - 1 + slides.length) % slides.length;
        showSlide(modal, slideStates[id]);
    };
});

document.getElementById("btnGuide")?.addEventListener("click", () => {
    slideStates["modalGuide"] = 0;
    const modal = document.getElementById("modalGuide");
    showSlide(modal, 0);
    modal.style.visibility = "visible";
});

document.getElementById("btnAbout")?.addEventListener("click", () => {
    slideStates["modalAbout"] = 0;
    const modal = document.getElementById("modalAbout");
    showSlide(modal, 0);
    modal.style.visibility = "visible";
});

document.querySelectorAll(".close-btn").forEach(btn => {
    btn.onclick = () => {
        const targetId = btn.getAttribute("data-close");
        document.getElementById(targetId).style.visibility = "hidden";
    };
});

document.getElementById("btnPractice")?.addEventListener("click", () => {
    window.location.href = "pages/practice.html";
});

document.getElementById("btnQuiz")?.addEventListener("click", () => {
    window.location.href = "pages/quiz.html";
});

window.onclick = (event) => {
    if (event.target.classList.contains("modal")) {
        event.target.style.visibility = "hidden";
    }
};

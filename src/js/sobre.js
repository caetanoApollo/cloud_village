document.addEventListener("DOMContentLoaded", function () {
    const redirectElements = document.querySelectorAll(".redirect");

    redirectElements.forEach((element) => {
        element.addEventListener("click", function () {
            const page = element.textContent.trim().toLowerCase();

            switch (page) {
                case "home":
                    window.location.href = "/";
                    break;
                case "sobre nós":
                    window.location.href = "/sobre";
                    break;
                case "admin":
                    window.location.href = "/admin";
                    break;
                default:
                    console.log("Página não encontrada.");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const redirectElements = document.querySelectorAll(".redirect");

    redirectElements.forEach((element) => {
        element.addEventListener("mouseenter", function () {
            element.style.transform = "scale(1.08)";
            element.style.transition = "transform 0.3s";
        });

        element.addEventListener("mouseleave", function () {
            element.style.transform = "scale(1)";
        });
    });
});
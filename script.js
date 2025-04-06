document.addEventListener("DOMContentLoaded", function() {
    // Инициализация частиц
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#6e8efb" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": true },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#6e8efb", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" }
            }
        }
    });

    // Анимация печатающего текста
    const typewriterElement = document.querySelector(".typewriter");
    const words = ["запомнят", "вдохновят", "выделят", "продвинут"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 200;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 100;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 200;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);

    // Многостраничная форма
    const formSteps = document.querySelectorAll(".form-step");
    let currentStep = 0;

    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.toggle("active", index === stepIndex);
        });
    }

    document.querySelectorAll(".btn-next").forEach(btn => {
        btn.addEventListener("click", () => {
            if (validateStep(currentStep)) {
                if (currentStep < formSteps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    });

    document.querySelectorAll(".btn-prev").forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    function validateStep(stepIndex) {
        let isValid = true;
        const currentStep = formSteps[stepIndex];
        const inputs = currentStep.querySelectorAll("input[required], textarea[required]");

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = "#ff6b6b";
                isValid = false;
            } else {
                input.style.borderColor = "";
            }
        });

        return isValid;
    }

    // Выбор темы
    document.querySelectorAll(".theme-option").forEach(option => {
        option.addEventListener("click", function() {
            document.querySelectorAll(".theme-option").forEach(opt => {
                opt.classList.remove("active");
            });
            this.classList.add("active");
            document.getElementById("theme").value = this.dataset.theme;
        });
    });

    // Обработка формы
    const form = document.getElementById("portfolio-form");
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        // Сбор данных
        const portfolioData = {
            name: document.getElementById("name").value,
            job: document.getElementById("job").value,
            about: document.getElementById("about").value,
            projects: document.getElementById("projects").value.split(",").map(p => p.trim()),
            skills: document.getElementById("skills").value.split(",").map(s => s.trim()),
            certificates: document.getElementById("certificates").value.split(",").map(c => c.trim()),
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            social: document.getElementById("social").value.split(",").map(s => s.trim()),
            theme: document.getElementById("theme").value
        };

        // Сохранение и переход
        localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
        window.location.href = "portfolio.html";
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });
});
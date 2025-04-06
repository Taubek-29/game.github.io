document.addEventListener("DOMContentLoaded", function() {
    // Загружаем данные из LocalStorage
    const portfolioData = JSON.parse(localStorage.getItem("portfolioData"));
    if (!portfolioData) {
        window.location.href = "index.html";
        return;
    }

    // Инициализация переменных
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Элементы управления
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    
    // Настройки редактора
    const themeOptions = document.querySelectorAll(".theme-option");
    const fontSizeSelect = document.getElementById("font-size");
    const headingColor = document.getElementById("heading-color");
    const exportPdfBtn = document.getElementById("export-pdf");
    const exportImageBtn = document.getElementById("export-image");
    
    // Заполняем презентацию данными
    function loadPortfolioData() {
        // Слайд приветствия
        document.getElementById("welcome-text").textContent = 
            `Привет, меня зовут ${portfolioData.name} и я ${portfolioData.job}`;
        
        // Слайд "О себе"
        document.getElementById("about-content").innerHTML = 
            `<p>${portfolioData.about}</p>`;
        
        // Слайд навыков
        const skillsContainer = document.getElementById("skills-container");
        skillsContainer.innerHTML = "";
        portfolioData.skills.forEach(skill => {
            if (skill.trim()) {
                const skillElement = document.createElement("div");
                skillElement.className = "skill-tag";
                skillElement.textContent = skill;
                skillsContainer.appendChild(skillElement);
            }
        });
        
        // Слайд проектов
        const projectsContainer = document.getElementById("projects-container");
        projectsContainer.innerHTML = "";
        portfolioData.projects.forEach(project => {
            if (project.trim()) {
                const projectElement = document.createElement("div");
                projectElement.className = "project-card";
                projectElement.innerHTML = `
                    <h3 class="project-title">${project}</h3>
                    <p class="project-description">Здесь может быть описание проекта</p>
                `;
                projectsContainer.appendChild(projectElement);
            }
        });
        
        // Слайд сертификатов
        const certificatesContainer = document.getElementById("certificates-container");
        certificatesContainer.innerHTML = "";
        if (portfolioData.certificates && portfolioData.certificates.length > 0) {
            portfolioData.certificates.forEach(cert => {
                if (cert.trim()) {
                    const certElement = document.createElement("div");
                    certElement.className = "project-card";
                    certElement.innerHTML = `
                        <h3 class="project-title">${cert}</h3>
                        <p class="project-description">Получен в 2023 году</p>
                    `;
                    certificatesContainer.appendChild(certElement);
                }
            });
        } else {
            certificatesContainer.innerHTML = "<p>Сертификаты не указаны</p>";
        }
        
        // Слайд контактов
        const contactsContainer = document.getElementById("contacts-container");
        contactsContainer.innerHTML = "";
        
        if (portfolioData.email) {
            const emailItem = document.createElement("div");
            emailItem.className = "contact-item";
            emailItem.innerHTML = `
                <div class="contact-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="contact-text">${portfolioData.email}</div>
            `;
            contactsContainer.appendChild(emailItem);
        }
        
        if (portfolioData.phone) {
            const phoneItem = document.createElement("div");
            phoneItem.className = "contact-item";
            phoneItem.innerHTML = `
                <div class="contact-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <div class="contact-text">${portfolioData.phone}</div>
            `;
            contactsContainer.appendChild(phoneItem);
        }
        
        if (portfolioData.social && portfolioData.social.length > 0) {
            portfolioData.social.forEach(socialLink => {
                if (socialLink.trim()) {
                    const socialItem = document.createElement("div");
                    socialItem.className = "contact-item";
                    socialItem.innerHTML = `
                        <div class="contact-icon">
                            <i class="fab fa-telegram"></i>
                        </div>
                        <div class="contact-text">
                            <a href="${socialLink}" target="_blank">${socialLink}</a>
                        </div>
                    `;
                    contactsContainer.appendChild(socialItem);
                }
            });
        }
        
        // Применяем выбранную тему
        applyTheme(portfolioData.theme);
    }
    
    // Показываем текущий слайд
    function showSlide(index, direction = "next") {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove("active", "slide-next", "slide-prev");
        });
        
        // Показываем текущий слайд с анимацией
        slides[index].classList.add("active");
        slides[index].classList.add(direction === "next" ? "slide-next" : "slide-prev");
        
        // Обновляем состояние кнопок
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalSlides - 1;
    }
    
    // Применяем выбранную тему
    function applyTheme(theme) {
        const portfolioTheme = document.getElementById("portfolio-theme");
        
        // Удаляем все классы тем
        portfolioTheme.classList.remove(
            "theme-minimal",
            "theme-creative",
            "theme-tech"
        );
        
        // Добавляем выбранную тему
        portfolioTheme.classList.add(`theme-${theme}`);
        
        // Обновляем активную тему в редакторе
        themeOptions.forEach(option => {
            option.classList.remove("active");
            if (option.dataset.theme === theme) {
                option.classList.add("active");
            }
        });
    }
    
    // Переключение между слайдами
    function goToNextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            showSlide(currentSlide, "next");
        }
    }
    
    function goToPrevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide, "prev");
        }
    }
    
    // Полноэкранный режим
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Ошибка при переходе в полноэкранный режим: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    // Экспорт в PDF
    function exportToPdf() {
        const element = document.getElementById("portfolio-theme");
        const opt = {
            margin: 10,
            filename: `${portfolioData.name}_portfolio.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        
        // Временно скрываем элементы управления
        const controls = document.querySelector(".controls");
        const editorPanel = document.querySelector(".editor-panel");
        controls.style.display = "none";
        editorPanel.style.display = "none";
        
        // Генерируем PDF
        html2pdf().from(element).set(opt).save().then(() => {
            // Восстанавливаем элементы управления
            controls.style.display = "";
            editorPanel.style.display = "";
        });
    }
    
    // Инициализация событий
    function initEvents() {
        // Навигация по слайдам
        nextBtn.addEventListener("click", goToNextSlide);
        prevBtn.addEventListener("click", goToPrevSlide);
        
        // Горячие клавиши
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                goToNextSlide();
            } else if (e.key === "ArrowLeft") {
                goToPrevSlide();
            } else if (e.key === "Escape" && document.fullscreenElement) {
                document.exitFullscreen();
            }
        });
        
        // Полноэкранный режим
        fullscreenBtn.addEventListener("click", toggleFullscreen);
        
        // Выбор темы
        themeOptions.forEach(option => {
            option.addEventListener("click", function() {
                const theme = this.dataset.theme;
                applyTheme(theme);
            });
        });
        
        // Настройки текста
        fontSizeSelect.addEventListener("change", function() {
            document.documentElement.style.fontSize = this.value;
        });
        
        headingColor.addEventListener("input", function() {
            document.documentElement.style.setProperty("--primary", this.value);
        });
        
        // Экспорт
        exportPdfBtn.addEventListener("click", exportToPdf);
        exportImageBtn.addEventListener("click", () => {
            alert("Функция экспорта в изображение будет реализована в следующей версии");
        });
    }
    
    // Запускаем презентацию
    loadPortfolioData();
    showSlide(currentSlide);
    initEvents();
});
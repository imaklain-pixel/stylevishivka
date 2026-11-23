/* ============================================================
   main.js — общая логика для всех страниц
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var WORKER_URL = 'https://solitary-star-55d0.imaklain.workers.dev';
    window.WORKER_URL = WORKER_URL;

    /* ===== CSRF-ТОКЕН ===== */
    function generateCSRFToken() {
        var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('csrfToken', token);
        return token;
    }

    function addCSRFTokenToForms() {
        var token = generateCSRFToken();
        document.querySelectorAll('input[name="_csrf"]').forEach(function(input) {
            input.value = token;
        });
    }
    window.addCSRFTokenToForms = addCSRFTokenToForms;

    /* ===== САНИТАЙЗ (защита от XSS) ===== */
    function sanitizeInput(text) {
        if (!text) return '';
        var s = String(text).trim();
        if (s.length > 1000) s = s.substring(0, 1000);
        return s;
    }
    window.sanitizeInput = sanitizeInput;

    function escapeMarkdown(text) {
        if (!text) return '';
        var specialChars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
        var escaped = text;
        specialChars.forEach(function(char) {
            escaped = escaped.replace(new RegExp('\\' + char, 'g'), '\\' + char);
        });
        return escaped;
    }
    window.escapeMarkdown = escapeMarkdown;

    /* ===== АНТИ-СПАМ ===== */
    var lastSubmitTime = 0;
    var MIN_SUBMIT_INTERVAL = 5000;

    function canSubmit() {
        var now = Date.now();
        if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
            alert('Пожалуйста, подождите 5 секунд перед отправкой.');
            return false;
        }
        lastSubmitTime = now;
        return true;
    }
    window.canSubmit = canSubmit;

    function validatePhone(phone) {
        var digits = phone.replace(/\D/g, '');
        return digits.length === 11 && digits[0] === '7';
    }
    window.validatePhone = validatePhone;

    /* ===== COOKIE-БАННЕР И СОГЛАСИЕ НА АНАЛИТИКУ ===== */
    var cookieBanner = document.getElementById('cookieBanner');
    var cookieChoice = localStorage.getItem('cookieConsent') ||
        (localStorage.getItem('cookiesAccepted') === 'true' ? 'accepted' :
        (localStorage.getItem('cookiesRejected') === 'true' ? 'rejected' : null));
    var yandexMetrikaLoaded = false;

    function loadYandexMetrika() {
        if (yandexMetrikaLoaded || cookieChoice !== 'accepted') return;
        yandexMetrikaLoaded = true;
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j=0; j<document.scripts.length; j++) {
                if (document.scripts[j].src.indexOf('mc.yandex.ru/metrika/tag.js') !== -1) return;
            }
            k=e.createElement(t); a=e.getElementsByTagName(t)[0];
            k.async=1; k.src=r; a.parentNode.insertBefore(k,a);
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=112953359', 'ym');
        window.ym(112953359, 'init', {
            ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer",
            referrer:document.referrer, url:location.href,
            accurateTrackBounce:true, trackLinks:true
        });
    }

    if (cookieBanner && !cookieChoice) cookieBanner.classList.add('active');
    if (cookieChoice === 'accepted') loadYandexMetrika();

    window.acceptCookies = function() {
        cookieChoice = 'accepted';
        localStorage.setItem('cookieConsent', cookieChoice);
        localStorage.removeItem('cookiesAccepted');
        localStorage.removeItem('cookiesRejected');
        loadYandexMetrika();
        if (cookieBanner) cookieBanner.classList.remove('active');
    };

    window.rejectCookies = function() {
        cookieChoice = 'rejected';
        localStorage.setItem('cookieConsent', cookieChoice);
        localStorage.removeItem('cookiesAccepted');
        localStorage.removeItem('cookiesRejected');
        if (cookieBanner) cookieBanner.classList.remove('active');
    };

    /* ===== ШАПКА: скролл ===== */
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* ===== КНОПКА «НАВЕРХ» ===== */
    var scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            scrollBtn.classList.toggle('visible', window.scrollY > 400);
        });
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ===== МОБИЛЬНОЕ МЕНЮ ===== */
    var mobileToggle = document.getElementById('mobileToggle');
    var navList = document.getElementById('navList');
    if (mobileToggle && navList) {
        mobileToggle.addEventListener('click', function() {
            navList.classList.toggle('open');
        });
    }

    /* ===== АНИМАЦИИ ПРИ СКРОЛЛЕ ===== */
    var animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.08 });
        animateElements.forEach(function(el) { observer.observe(el); });
    } else {
        animateElements.forEach(function(el) { el.classList.add('visible'); });
    }

    /* ===== СЧЁТЧИКИ СТАТИСТИКИ ===== */
    var counters = document.querySelectorAll('.stat-number');
    if (counters.length && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var target = parseInt(entry.target.dataset.count);
                    var current = 0;
                    var increment = Math.ceil(target / 50);
                    var timer = setInterval(function() {
                        current += increment;
                        if (current >= target) { current = target; clearInterval(timer); }
                        entry.target.textContent = current;
                    }, 18);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function(el) { counterObserver.observe(el); });
    }

    /* ===== МОДАЛКА ЗАЯВКИ ===== */
    var orderModal = document.getElementById('orderModal');

    window.openModal = function() {
        if (orderModal) {
            orderModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(id) {
        var el = document.getElementById(id);
        if (el) el.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal('orderModal');
        });
    }

    /* ===== ЛАЙТБОКС ===== */
    var lightbox = document.getElementById('lightbox');

    window.openLightbox = function(src) {
        var img = document.getElementById('lightboxImage');
        if (lightbox && img) {
            img.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeLightbox = function() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) closeLightbox();
        });
    }

    /* ===== ESC ЗАКРЫВАЕТ ВСЁ ===== */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (orderModal) orderModal.classList.remove('active');
            if (lightbox) lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    /* ===== ОТПРАВКА В TELEGRAM (через Worker) ===== */
    window.sendToTelegram = function(text) {
        if (!canSubmit()) return Promise.resolve(false);

        var btns = document.querySelectorAll('button[type="submit"]');
        btns.forEach(function(btn) {
            btn.disabled = true;
            btn.textContent = '⏳ Отправка...';
        });

        return fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        })
        .then(function(response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then(function(data) {
            if (data && data.success === true) {
                console.log('✅ Заявка доставлена');
                return true;
            }
            throw new Error('Сервер не подтвердил отправку');
        })
        .catch(function(err) {
            console.error('❌ Ошибка отправки:', err);
            alert('⚠️ Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь со мной через мессенджер.');
            return false;
        })
        .finally(function() {
            btns.forEach(function(btn) {
                btn.disabled = false;
                btn.textContent = btn.getAttribute('data-original-text') || '🚀 Отправить заявку';
            });
        });
    };

    /* ===== ФОРМА ЗАЯВКИ ===== */
    var orderForm = document.getElementById('orderForm');
    var orderPhone = document.getElementById('orderPhone');
    var orderSuccess = document.getElementById('orderSuccess');

    /* Маска российского номера: принимает ввод с 9, 8 или 7 */
    if (orderPhone) {
        orderPhone.addEventListener('input', function() {
            var digits = this.value.replace(/\D/g, '');
            if (!digits) {
                this.value = '';
                return;
            }

            if (digits.charAt(0) === '8') {
                digits = '7' + digits.slice(1);
            } else if (digits.charAt(0) === '9') {
                digits = '7' + digits;
            } else if (digits.charAt(0) !== '7') {
                digits = '';
            }

            digits = digits.slice(0, 11);
            var local = digits.slice(1);
            var formatted = digits ? '+7' : '';
            if (local.length > 0) formatted += ' (' + local.slice(0, 3);
            if (local.length >= 3) formatted += ')';
            if (local.length > 3) formatted += ' ' + local.slice(3, 6);
            if (local.length > 6) formatted += '-' + local.slice(6, 8);
            if (local.length > 8) formatted += '-' + local.slice(8, 10);
            this.value = formatted;
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            /* CSRF */
            var csrfToken = document.getElementById('orderCsrf').value;
            var storedToken = sessionStorage.getItem('csrfToken');
            if (!storedToken || csrfToken !== storedToken) {
                alert('⚠️ Ошибка безопасности. Обновите страницу.');
                return;
            }

            /* Согласие на ПД */
            if (!document.getElementById('orderConsent').checked) {
                alert('⚠️ Необходимо дать согласие на обработку персональных данных.');
                return;
            }

            /* Телефон */
            var phone = orderPhone.value.trim();
            if (!validatePhone(phone)) {
                alert('⚠️ Введите корректный номер телефона.');
                return;
            }

            /* Сообщение */
            var message = sanitizeInput(document.getElementById('orderMessage').value.trim());
            if (!message) {
                alert('⚠️ Опишите, что нужно сделать.');
                return;
            }

            var type = sanitizeInput(document.getElementById('orderType').value);

            /* Результат барабана (если крутили) */
            var wheelResultText = '❌ Не крутил барабан';
            if (window.lastWheelResult) {
                wheelResultText = window.lastWheelResult;
                if (window.lastWheelPrize && window.lastWheelPrize.value > 0) {
                    wheelResultText = '✅ ВЫИГРЫШ: ' + window.lastWheelPrize.value + '% скидка';
                }
            }

            var text =
                '📩 *НОВАЯ ЗАЯВКА НА УСЛУГУ!*\n\n' +
                '📱 *Телефон:* ' + escapeMarkdown(phone) + '\n' +
                '📂 *Тип услуги:* ' + escapeMarkdown(type) + '\n' +
                '💬 *Описание:* ' + escapeMarkdown(message) + '\n' +
                '🎰 *Результат барабана:* ' + escapeMarkdown(wheelResultText) + '\n' +
                '📋 *Согласие на ПД:* ✅ Да\n' +
                '🕐 *Время:* ' + new Date().toLocaleString('ru-RU');

            sendToTelegram(text).then(function(sent) {
                if (!sent) return;

                orderForm.style.display = 'none';
                orderSuccess.style.display = 'block';

                setTimeout(function() {
                    orderForm.style.display = 'block';
                    orderSuccess.style.display = 'none';
                    orderForm.reset();
                    addCSRFTokenToForms();
                    closeModal('orderModal');
                }, 3000);
            });
        });
    }

    /* ===== АКТИВНАЯ ССЫЛКА В МЕНЮ ===== */
    var currentPage = document.body.dataset.page;
    if (currentPage) {
        document.querySelectorAll('.nav-link').forEach(function(link) {
            if (link.dataset.page === currentPage) link.classList.add('active');
        });
    }

    /* ===== ИНИЦИАЛИЗАЦИЯ ===== */
    addCSRFTokenToForms();

    document.querySelectorAll('button[type="submit"]').forEach(function(btn) {
        btn.setAttribute('data-original-text', btn.textContent);
    });

    console.log('✅ main.js загружен. Страница:', currentPage || 'unknown');
});

/* ============================================================
   ЗАЩИТА ОТ БОТОВ (honeypot, тайминг, User-Agent)
   ============================================================ */
(function() {
    'use strict';

    /* Не блокируем посетителей и поисковых роботов по User-Agent.
       Поисковые системы используют строки Googlebot/YandexBot; блокировка
       по подстроке "bot" может скрыть содержимое сайта от индексации. */
    function blockBadBots() {
        return false;
    }

    /* Honeypot + тайминг заполнения */
    function protectForms() {
        var forms = document.querySelectorAll('form');
        forms.forEach(function(form) {

            /* Скрытое поле-ловушка */
            var honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'hp_' + Math.random().toString(36).substring(2, 8);
            honeypot.style.display = 'none';
            honeypot.autocomplete = 'off';
            honeypot.setAttribute('aria-hidden', 'true');
            honeypot.value = '';
            form.appendChild(honeypot);

            /* Время начала заполнения */
            var startTime = document.createElement('input');
            startTime.type = 'hidden';
            startTime.name = 'form_start_time';
            startTime.value = Date.now();
            form.appendChild(startTime);

            form.addEventListener('submit', function(e) {
                /* Проверка honeypot */
                var hpField = this.querySelector('input[name^="hp_"]');
                if (hpField && hpField.value !== '') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    console.warn('🛡️ Honeypot сработал — бот заблокирован');
                    alert('⚠️ Обнаружена подозрительная активность. Попробуйте позже.');
                    return false;
                }

                /* Проверка тайминга */
                var startField = this.querySelector('input[name="form_start_time"]');
                if (startField) {
                    var elapsed = Date.now() - parseInt(startField.value, 10);
                    if (elapsed < 5000) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        console.warn('🛡️ Слишком быстрая отправка — бот');
                        alert('⚠️ Заполните форму внимательнее. Пожалуйста, подождите 5 секунд.');
                        return false;
                    }
                }

                /* Анти-флуд */
                var now = Date.now();
                var lastSubmit = parseInt(sessionStorage.getItem('lastSubmitTime') || '0', 10);
                if (now - lastSubmit < 10000) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    alert('⚠️ Слишком много заявок. Подождите 10 секунд.');
                    return false;
                }
                sessionStorage.setItem('lastSubmitTime', String(now));
            });
        });
    }

    /* Санитайз всех input'ов на лету */
    function sanitizeAllInputs() {
        /* Не изменяем вводимый текст: проверка и экранирование выполняются
           при обработке данных, а не путём удаления символов у пользователя. */
    }

    /* Второй honeypot (невидимый div) */
    function addSecondHoneypot() {
        var forms = document.querySelectorAll('form');
        forms.forEach(function(form) {
            var hiddenDiv = document.createElement('div');
            hiddenDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
            var fakeInput = document.createElement('input');
            fakeInput.type = 'text';
            fakeInput.name = 'url';
            fakeInput.value = '';
            fakeInput.autocomplete = 'off';
            hiddenDiv.appendChild(fakeInput);
            form.appendChild(hiddenDiv);
        });
    }

    /* Защита от дубликатов */
    function preventDuplicateSubmissions() {
        var forms = document.querySelectorAll('form');
        forms.forEach(function(form) {
            form.addEventListener('submit', function() {
                var btn = this.querySelector('button[type="submit"]');
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = '⏳ Отправка...';
                    setTimeout(function() {
                        btn.disabled = false;
                        btn.textContent = btn.getAttribute('data-original-text') || 'Отправить';
                    }, 15000);
                }
            });
        });
    }

    /* Запуск всех защит */
    protectForms();
    sanitizeAllInputs();
    addSecondHoneypot();
    preventDuplicateSubmissions();

    console.log('🛡️ Защиты форм активированы: honeypot, тайминг, анти-флуд и защита от повторной отправки');
})();

/* ============================================================
   reviews.js — отзывы (загрузка из JSON + форма с фото)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    /* ===== URL ДЛЯ ЗАГРУЗКИ ОТЗЫВОВ ===== */
    var REVIEWS_URL = 'https://raw.githubusercontent.com/imaklain-pixel/Vishivka_Stile_/main/reviews.json';

    /* ========================================================
       ЗАГРУЗКА И ОТРИСОВКА ОТЗЫВОВ ИЗ JSON
       ======================================================== */
    function renderReviewsFromJSON() {
        var container = document.getElementById('reviewsContainer');
        if (!container) return;

        fetch(REVIEWS_URL)
            .then(function(r) { return r.json(); })
            .then(function(reviews) {
                if (!reviews || reviews.length === 0) {
                    container.innerHTML =
                        '<div class="review-empty">' +
                        '<span class="empty-icon">💬</span>' +
                        '<h3>Пока нет отзывов</h3>' +
                        '<p>Станьте первым — оставьте свой отзыв ниже</p>' +
                        '</div>';
                    return;
                }

                var html = '';
                reviews.forEach(function(r) {
                    var stars = '⭐'.repeat(parseInt(r.rating)) + '☆'.repeat(5 - parseInt(r.rating));

                    var photoHtml = '';
                    if (r.photo && r.photo !== '') {
                        photoHtml =
                            '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">' +
                            '<div style="cursor:pointer;border-radius:8px;overflow:hidden;' +
                            'border:1px solid rgba(0,0,0,0.06);width:80px;height:80px;" ' +
                            'onclick="openLightbox(\'' + r.photo + '\')">' +
                            '<img src="' + r.photo + '" alt="Фото отзыва" ' +
                            'style="width:100%;height:100%;object-fit:cover;">' +
                            '</div></div>';
                    }

                    html +=
                        '<div class="review-card" style="background:rgba(255,255,255,0.6);' +
                        'border-radius:var(--radius-md);padding:var(--space-lg);' +
                        'margin-bottom:var(--space-md);border:1px solid rgba(255,255,255,0.3);' +
                        'box-shadow:var(--shadow-sm);">' +
                        '<div style="display:flex;justify-content:space-between;' +
                        'align-items:center;flex-wrap:wrap;gap:var(--space-sm);">' +
                        '<strong style="font-size:1.1rem;">' + r.name + '</strong>' +
                        '<span style="font-size:0.85rem;color:var(--color-text-secondary);">' +
                        r.date + '</span></div>' +
                        '<div style="margin:4px 0 8px;font-size:1.1rem;">' + stars + '</div>' +
                        '<p style="color:var(--color-text-secondary);margin:0 0 12px 0;' +
                        'line-height:1.6;">' + r.text + '</p>' +
                        photoHtml +
                        '</div>';
                });
                container.innerHTML = html;
            })
            .catch(function(error) {
                console.error('❌ Не удалось загрузить отзывы:', error);
                container.innerHTML =
                    '<div class="review-empty">' +
                    '<span class="empty-icon">⚠️</span>' +
                    '<h3>Не удалось загрузить отзывы</h3>' +
                    '<p>Попробуйте обновить страницу позже</p>' +
                    '</div>';
            });
    }

    renderReviewsFromJSON();

    /* ========================================================
       ФОРМА ОТЗЫВА (с фото и модерацией через Telegram)
       ======================================================== */
    var reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;

    var reviewSuccess = document.getElementById('reviewSuccess');
    var fileInput = document.getElementById('reviewPhoto');
    var filePreview = document.getElementById('filePreview');
    var reviewText = document.getElementById('reviewText');
    var reviewCounter = document.getElementById('reviewCounter');
    var selectedFiles = [];

    /* Счётчик символов */
    if (reviewText && reviewCounter) {
        reviewText.addEventListener('input', function() {
            var len = this.value.length;
            reviewCounter.textContent = len + ' / 1000';
            reviewCounter.style.color = len > 900 ? '#EC4899' : 'var(--color-text-secondary)';
        });
    }

    /* Загрузка фото */
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            var files = Array.from(this.files);

            if (selectedFiles.length + files.length > 5) {
                alert('Можно загрузить не более 5 фото');
                this.value = '';
                return;
            }

            files.forEach(function(file) {
                if (!file.type.startsWith('image/')) {
                    alert('Можно загружать только изображения');
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    alert('Файл "' + file.name + '" превышает 5 МБ');
                    return;
                }
                selectedFiles.push(file);
            });

            renderFilePreviews();
            this.value = '';
        });
    }

    /* Превью загруженных фото */
    function renderFilePreviews() {
        filePreview.innerHTML = '';
        selectedFiles.forEach(function(file, index) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var wrapper = document.createElement('div');
                wrapper.className = 'preview-wrapper';

                var img = document.createElement('img');
                img.src = e.target.result;

                var removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.type = 'button';
                removeBtn.textContent = '✕';
                removeBtn.onclick = function(ev) {
                    ev.stopPropagation();
                    selectedFiles.splice(index, 1);
                    renderFilePreviews();
                };

                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                filePreview.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        });
    }

    /* Отправка формы */
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        /* CSRF */
        var csrfToken = document.getElementById('reviewCsrf').value;
        var storedToken = sessionStorage.getItem('csrfToken');
        if (!storedToken || csrfToken !== storedToken) {
            alert('⚠️ Ошибка безопасности. Обновите страницу.');
            return;
        }

        /* Согласие на ПД */
        if (!document.getElementById('reviewConsent').checked) {
            alert('⚠️ Необходимо дать согласие на обработку персональных данных.');
            return;
        }

        /* Валидация */
        var name = window.sanitizeInput(document.getElementById('reviewName').value.trim());
        var rating = document.getElementById('reviewRating').value;
        var text = window.sanitizeInput(document.getElementById('reviewText').value.trim());

        if (!name || !text) {
            alert('Заполните имя и текст отзыва');
            return;
        }

        var reviewId = Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        var pendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '{}');
        var photoData = [];

        /* Читаем фото (если есть) → потом сохраняем */
        if (selectedFiles.length > 0) {
            var loadCount = 0;
            selectedFiles.forEach(function(file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    photoData.push(e.target.result);
                    loadCount++;
                    if (loadCount === selectedFiles.length) saveReview();
                };
                reader.readAsDataURL(file);
            });
        } else {
            saveReview();
        }

        function saveReview() {
            /* Сохраняем в localStorage (для модерации) */
            pendingReviews[reviewId] = {
                name: name,
                rating: rating,
                text: text,
                photos: photoData,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            localStorage.setItem('pendingReviews', JSON.stringify(pendingReviews));

            /* Формируем сообщение в Telegram */
            var stars = '⭐'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));
            var msg =
                '⭐ *НОВЫЙ ОТЗЫВ (МОДЕРАЦИЯ)!*\n\n' +
                '🆔 *ID:* `' + reviewId + '`\n' +
                '👤 *Имя:* ' + window.escapeMarkdown(name) + '\n' +
                '📊 *Оценка:* ' + window.escapeMarkdown(stars) + '\n' +
                '💬 *Отзыв:* ' + window.escapeMarkdown(text) + '\n' +
                '📸 *Фото:* ' + (photoData.length > 0 ? photoData.length + ' шт' : 'нет') + '\n' +
                '📋 *Согласие на ПД:* ✅ Да\n' +
                '🕐 *Время:* ' + new Date().toLocaleString('ru-RU');

            /* Отправляем через Worker (с фото, если есть) */
            var formData = new FormData();
            formData.append('message', msg);
            formData.append('reviewId', reviewId);
            formData.append('action', 'moderate');
            selectedFiles.forEach(function(file, i) {
                formData.append('photo_' + i, file);
            });

            fetch(window.WORKER_URL, {
                method: 'POST',
                body: formData
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    console.log('✅ Отзыв отправлен на модерацию с ' +
                        (selectedFiles.length || 0) + ' фото');
                } else {
                    console.error('❌ Ошибка:', data);
                    alert('⚠️ Ошибка отправки. Попробуйте позже.');
                }
            })
            .catch(function(error) {
                console.error('❌ Ошибка соединения:', error);
                alert('⚠️ Ошибка соединения. Проверьте интернет.');
            });

            /* Показываем «спасибо» */
            reviewForm.style.display = 'none';
            reviewSuccess.style.display = 'block';
            setTimeout(function() {
                reviewForm.style.display = 'block';
                reviewSuccess.style.display = 'none';
                reviewForm.reset();
                selectedFiles = [];
                filePreview.innerHTML = '';
                if (reviewCounter) reviewCounter.textContent = '0 / 1000';
                window.addCSRFTokenToForms();
            }, 5000);
        }
    });

    /* ========================================================
       ФУНКЦИИ МОДЕРАЦИИ (для админа — вызов из консоли)
       ======================================================== */

    /* Одобрить отзыв: approveReview('ID') */
    window.approveReview = function(reviewId) {
        var pending = JSON.parse(localStorage.getItem('pendingReviews') || '{}');
        var review = pending[reviewId];
        if (!review) {
            alert('❌ Отзыв не найден');
            return;
        }

        var published = JSON.parse(localStorage.getItem('publishedReviews') || '[]');
        published.push({
            id: reviewId,
            name: review.name,
            rating: review.rating,
            text: review.text,
            photos: review.photos || [],
            date: review.timestamp || new Date().toISOString(),
            publishedAt: new Date().toISOString()
        });

        localStorage.setItem('publishedReviews', JSON.stringify(published));
        delete pending[reviewId];
        localStorage.setItem('pendingReviews', JSON.stringify(pending));

        alert('✅ Отзыв опубликован!');
    };

    /* Отклонить отзыв: rejectReview('ID') */
    window.rejectReview = function(reviewId) {
        if (!confirm('❌ Отклонить отзыв?')) return;
        var pending = JSON.parse(localStorage.getItem('pendingReviews') || '{}');
        if (pending[reviewId]) {
            delete pending[reviewId];
            localStorage.setItem('pendingReviews', JSON.stringify(pending));
            alert('❌ Отзыв отклонён');
        }
    };

    console.log('✅ reviews.js загружен');
});

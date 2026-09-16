/* ============================================================
   wheel.js — барабан со скидками
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var wheelOverlay = document.getElementById('wheelOverlay');
    if (!wheelOverlay) return; // если барабана нет на странице — выходим

    var wheelSpin = document.getElementById('wheelSpin');
    var wheelResult = document.getElementById('wheelResult');
    var wheelBtn = document.getElementById('wheelBtn');
    var isSpinning = false;
    var wheelAttempts = 0;
    var MAX_ATTEMPTS = 1;
    var wheelHistory = [];

    /* Призы на барабане */
    var segments = [
        { label: '22%', color: '#F59E0B', value: 22 },
        { label: '15%', color: '#8B5CF6', value: 15 },
        { label: '10%', color: '#F59E0B', value: 10 },
        { label: '5%',  color: '#6D28D9', value: 5 },
        { label: '7%',  color: '#F59E0B', value: 7 },
        { label: 'Увы', color: '#9CA3AF', value: -1 },
        { label: '13%', color: '#F59E0B', value: 13 },
        { label: '12%', color: '#8B5CF6', value: 12 }
    ];

    /* ===== ПОСТРОЕНИЕ БАРАБАНА ===== */
    function buildWheel() {
        var total = segments.length;
        var angle = 360 / total;
        wheelSpin.innerHTML = '<div class="center"></div>';

        segments.forEach(function(seg, i) {
            var rotation = i * angle;
            var label = document.createElement('div');
            label.className = 'segment-label';
            label.textContent = seg.label;
            label.style.transform = 'rotate(' + (rotation + angle / 2) + 'deg) translateY(-75px)';
            label.style.left = '50%';
            label.style.top = '50%';
            label.style.transformOrigin = '0 0';
            label.style.position = 'absolute';
            label.style.fontSize = window.innerWidth < 480 ? '0.6rem' : '0.75rem';
            label.style.fontWeight = '700';
            label.style.color = '#fff';
            label.style.textShadow = '0 1px 6px rgba(0,0,0,0.4)';
            wheelSpin.appendChild(label);
        });

        var gradientParts = segments.map(function(s, i) {
            var start = i * angle;
            var end = start + angle;
            return s.color + ' ' + start + 'deg ' + end + 'deg';
        });
        wheelSpin.style.background = 'conic-gradient(' + gradientParts.join(', ') + ')';
    }
    buildWheel();

    /* ===== ОБНОВЛЕНИЕ UI (попытки) ===== */
    function updateWheelUI() {
        var remaining = MAX_ATTEMPTS - wheelAttempts;
        var attemptsEl = document.getElementById('wheelAttempts');
        if (attemptsEl) {
            attemptsEl.innerHTML = '🎯 У вас <span class="remaining">' + remaining + '</span> попытка ' +
                (remaining === 0 ? ' 🔒 Попытка использована' : '');
        }
        if (remaining === 0) {
            wheelBtn.disabled = true;
            wheelBtn.textContent = '🔒 Попытка использована';
            wheelBtn.style.opacity = '0.5';
            wheelBtn.style.cursor = 'not-allowed';
        } else {
            wheelBtn.disabled = false;
            wheelBtn.textContent = '🌀 Крутить!';
            wheelBtn.style.opacity = '1';
            wheelBtn.style.cursor = 'pointer';
        }
    }

    /* ===== ИСТОРИЯ ===== */
    function addHistory(prize) {
        wheelHistory.push({
            date: new Date().toLocaleString('ru-RU'),
            prize: prize
        });
        renderHistory();
    }

    function renderHistory() {
        var historyEl = document.getElementById('wheelHistory');
        if (!historyEl) return;

        if (wheelHistory.length === 0) {
            historyEl.innerHTML = '<div style="color:var(--color-text-secondary);font-size:0.8rem;text-align:center;">История розыгрышей пуста</div>';
            return;
        }

        var html = '';
        wheelHistory.forEach(function(item) {
            var isWin = item.prize.value > 0;
            var label = item.prize.label;
            if (item.prize.value > 0) label = item.prize.value + '% скидка';
            html += '<div class="history-item">' +
                '<span>' + item.date + '</span>' +
                '<span class="' + (isWin ? 'win' : 'lose') + '">' +
                (isWin ? '🎉 ' + label : '😊 ' + label) +
                '</span></div>';
        });
        historyEl.innerHTML = html;
    }

    /* ===== ОТКРЫТИЕ / ЗАКРЫТИЕ ===== */
    window.openWheel = function() {
        if (wheelAttempts >= MAX_ATTEMPTS) {
            alert('🔒 Вы уже использовали свою попытку!');
            return;
        }
        wheelOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        wheelResult.textContent = 'Нажми кнопку, чтобы крутить';
        wheelBtn.textContent = '🌀 Крутить!';
        isSpinning = false;
        updateWheelUI();
    };

    window.closeWheel = function() {
        wheelOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    /* Кнопка закрытия в модалке */
    var closeBtn = wheelOverlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeWheel);

    /* Клик по фону — закрыть */
    wheelOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeWheel();
    });

    /* ===== ВРАЩЕНИЕ ===== */
    wheelBtn.addEventListener('click', function() {
        if (isSpinning) return;
        if (wheelAttempts >= MAX_ATTEMPTS) {
            alert('🔒 Вы уже использовали свою попытку!');
            return;
        }

        isSpinning = true;
        wheelBtn.textContent = '🔄 Крутится...';
        wheelResult.textContent = '🌀 ...';

        var randomIndex = Math.floor(Math.random() * segments.length);
        var totalRotation = 360 * 5 + randomIndex * (360 / segments.length) + Math.random() * 30;

        wheelSpin.style.transform = 'rotate(' + totalRotation + 'deg)';

        setTimeout(function() {
            var prize = segments[randomIndex];
            var resultText = '';
            var winType = '';

            wheelAttempts++;
            addHistory(prize);

            if (prize.value > 0) {
                resultText = '🎉 Вы выиграли ' + prize.value + '% скидку!';
                winType = '✅ ВЫИГРЫШ: ' + prize.value + '% скидка';
                launchConfetti();
            } else {
                resultText = '🥵 Увы!';
                winType = '❌ НЕ ВЫИГРАЛ: Повезёт в другой раз';
            }

            wheelResult.textContent = resultText;
            wheelBtn.textContent = '🌀 Крутить ещё';
            isSpinning = false;

            /* Сохраняем результат для формы заявки */
            window.lastWheelResult = winType;
            window.lastWheelPrize = prize;

            updateWheelUI();

            if (wheelAttempts >= MAX_ATTEMPTS) {
                setTimeout(function() {
                    wheelResult.textContent = '🔒 Спасибо за игру!';
                    wheelBtn.textContent = '🔒 Попытка использована';
                    wheelBtn.disabled = true;
                    wheelBtn.style.opacity = '0.5';
                    wheelBtn.style.cursor = 'not-allowed';
                }, 1000);
            }
        }, 4200);
    });

    /* ===== КОНФЕТТИ ===== */
    function launchConfetti() {
        var container = document.getElementById('confettiContainer');
        if (!container) return;

        var colors = ['#F59E0B', '#8B5CF6', '#EC4899', '#6D28D9', '#34C759', '#FF6B6B', '#FECA57', '#6A0DAD'];

        for (var i = 0; i < 80; i++) {
            var c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + '%';
            c.style.background = colors[Math.floor(Math.random() * colors.length)];
            c.style.width = (Math.random() * 8 + 4) + 'px';
            c.style.height = (Math.random() * 8 + 4) + 'px';
            c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            c.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            c.style.animationDelay = (Math.random() * 0.5) + 's';
            container.appendChild(c);

            (function(el) {
                setTimeout(function() {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, 4000);
            })(c);
        }
    }

    /* ===== ESC ЗАКРЫВАЕТ ===== */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeWheel();
    });

    /* Инициализация UI */
    updateWheelUI();

    console.log('✅ wheel.js загружен');
});

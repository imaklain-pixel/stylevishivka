/* ============================================================
   roi.js — калькулятор окупаемости (ROI)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var roiEmbroideryCost = document.getElementById('roiEmbroideryCost');
    if (!roiEmbroideryCost) return; // если ROI-калькулятора нет — выходим

    /* ===== РАСЧЁТ ROI ===== */
    function calculateROI() {
        var embroideryCost = parseFloat(document.getElementById('roiEmbroideryCost').value) || 0;
        var sellPrice      = parseFloat(document.getElementById('roiSellPrice').value) || 0;
        var baseCost       = parseFloat(document.getElementById('roiBaseCost').value) || 0;
        var qty            = parseInt(document.getElementById('roiQty').value) || 1;

        /* Общая себестоимость партии */
        var totalCost = embroideryCost + (baseCost * qty);

        /* Выручка с партии */
        var totalRevenue = sellPrice * qty;

        /* Прибыль с партии */
        var profit = totalRevenue - totalCost;

        /* Маржинальность */
        var margin = totalRevenue > 0 ? (profit / totalRevenue * 100) : 0;

        /* Прибыль с одного изделия */
        var profitPerItem = qty > 0 ? profit / qty : 0;

        /* Срок окупаемости */
        var payback;
        if (profit > 0)      payback = '1 партия';
        else if (profit === 0) payback = '—';
        else                 payback = 'Не окупается';

        /* ===== ВЫВОД ===== */
        var profitEl = document.getElementById('roiResultProfit');
        profitEl.textContent = profit.toLocaleString('ru-RU') + ' ₽';

        /* Цвет: зелёный при прибыли, красный при убытке */
        profitEl.style.background = profit >= 0
            ? 'linear-gradient(135deg, #34C759, #28A745)'
            : 'linear-gradient(135deg, #EF4444, #DC2626)';
        profitEl.style.webkitBackgroundClip = 'text';
        profitEl.style.backgroundClip = 'text';
        profitEl.style.webkitTextFillColor = 'transparent';

        document.getElementById('roiResultMargin').textContent = margin.toFixed(0) + '%';
        document.getElementById('roiResultPayback').textContent = payback;
        document.getElementById('roiResultText').textContent =
            'Прибыль с одного изделия: ' + Math.round(profitPerItem).toLocaleString('ru-RU') + ' ₽';
    }

    /* ===== СЛУШАТЕЛИ ===== */
    ['roiEmbroideryCost', 'roiSellPrice', 'roiBaseCost', 'roiQty'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateROI);
    });

    /* Первый расчёт при загрузке */
    calculateROI();

    /* ===== СВЯЗЬ С ОСНОВНЫМ КАЛЬКУЛЯТОРОМ =====
       Когда основной калькулятор пересчитывает цену —
       автоматически подставляем её в поле "Стоимость вышивки" */
    var calcPriceEl = document.getElementById('calcResultPrice');
    if (calcPriceEl) {
        var observer = new MutationObserver(function() {
            var text = calcPriceEl.textContent.replace(/[^\d]/g, '');
            var price = parseInt(text, 10);
            if (price > 0) {
                document.getElementById('roiEmbroideryCost').value = price;
                calculateROI();
            }
        });
        observer.observe(calcPriceEl, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }

    console.log('✅ roi.js загружен');
});

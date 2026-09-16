/* ============================================================
   calculator.js — калькулятор стоимости
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var calcProduct = document.getElementById('calcProduct');
    if (!calcProduct) return; // если калькулятора нет на странице — выходим

    /* ===== РАСЧЁТ ЦЕНЫ ===== */
    function calculatePrice() {
        var product = document.getElementById('calcProduct').value;
        var qty = parseInt(document.getElementById('calcQuantity').value);
        var compl = document.getElementById('calcComplexity').value;

        /* Базовая цена по типу изделия */
        var basePrice = 500;
        switch (product) {
            case 'Футболка':        basePrice = 300; break;
            case 'Худи / Свитшот':  basePrice = 700; break;
            case 'Кепка':           basePrice = 400; break;
            case 'Куртка':          basePrice = 1200; break;
            case 'Сумка / Рюкзак':  basePrice = 900; break;
            default:                basePrice = 600;
        }

        /* Множитель сложности */
        var complexityMultiplier = 1;
        var complexityLabel = 'Средняя';
        switch (compl) {
            case 'simple':  complexityMultiplier = 0.7; complexityLabel = 'Простая';  break;
            case 'medium':  complexityMultiplier = 1;   complexityLabel = 'Средняя';  break;
            case 'complex': complexityMultiplier = 1.6; complexityLabel = 'Сложная';  break;
        }

        /* Скидка за объём */
        var discount = 1;
        if (qty >= 5)   discount = 0.9;
        if (qty >= 10)  discount = 0.8;
        if (qty >= 20)  discount = 0.7;
        if (qty >= 50)  discount = 0.6;
        if (qty >= 100) discount = 0.5;

        /* Оцифровка макета — разовый платёж */
        var programCost = 1000;

        var pricePerItem = basePrice * complexityMultiplier * discount;
        var total = qty === 1
            ? pricePerItem + programCost
            : pricePerItem * qty + programCost;

        /* Округляем до сотен */
        total = Math.round(total / 100) * 100;

        /* Вывод результата */
        document.getElementById('calcResultPrice').textContent = total.toLocaleString('ru-RU') + ' ₽';
        document.getElementById('calcResultProduct').textContent = product;
        document.getElementById('calcResultQty').textContent = qty;
        document.getElementById('calcResultComplex').textContent = complexityLabel;

        /* Показываем результат, скрываем placeholder */
        document.getElementById('calcPlaceholder').style.display = 'none';
        document.getElementById('calcResultContent').classList.add('active');
    }

    /* ===== СЛУШАТЕЛИ ===== */
    document.getElementById('calcProduct').addEventListener('change', calculatePrice);
    document.getElementById('calcQuantity').addEventListener('change', calculatePrice);
    document.getElementById('calcComplexity').addEventListener('change', calculatePrice);

    /* Первый расчёт при загрузке */
    setTimeout(calculatePrice, 100);

    console.log('✅ calculator.js загружен');
});

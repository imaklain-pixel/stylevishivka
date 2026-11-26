/* ============================================================
   calculator.js — калькулятор стоимости
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var calcProduct = document.getElementById('calcProduct');
    if (!calcProduct) return;

    function calculatePrice() {
        var product = document.getElementById('calcProduct').value;
        var qty = parseInt(document.getElementById('calcQuantity').value, 10);
        var compl = document.getElementById('calcComplexity').value;

        /* Базовая ориентировочная цена вышивки за изделие */
        var basePrice = 500;
        switch (product) {
            case 'Футболка':        basePrice = 300; break;
            case 'Худи / Свитшот':  basePrice = 700; break;
            case 'Кепка':           basePrice = 400; break;
            case 'Куртка':          basePrice = 1200; break;
            case 'Сумка / Рюкзак':  basePrice = 900; break;
            default:                basePrice = 600;
        }

        /* Отрисовка дизайна — разовая стоимость на заказ */
        var designCost = 800;
        var complexityLabel = 'Средняя';
        switch (compl) {
            case 'simple':
                designCost = 600;
                complexityLabel = 'Простая';
                break;
            case 'medium':
                designCost = 800;
                complexityLabel = 'Средняя';
                break;
            case 'complex':
                designCost = 1000;
                complexityLabel = 'Сложная (от 1 000 ₽)';
                break;
        }

        /* Скидка за объём вышивки */
        var discount = 1;
        if (qty >= 5)   discount = 0.9;
        if (qty >= 10)  discount = 0.8;
        if (qty >= 20)  discount = 0.7;
        if (qty >= 50)  discount = 0.6;
        if (qty >= 100) discount = 0.5;

        /* Вышивка по тиражу + отрисовка дизайна (один раз) */
        var embroideryTotal = basePrice * qty * discount;
        var total = embroideryTotal + designCost;

        total = Math.round(total / 100) * 100;

        document.getElementById('calcResultPrice').textContent = total.toLocaleString('ru-RU') + ' ₽';
        document.getElementById('calcResultProduct').textContent = product;
        document.getElementById('calcResultQty').textContent = qty;
        document.getElementById('calcResultComplex').textContent = complexityLabel;
        document.getElementById('calcResultDesign').textContent = designCost.toLocaleString('ru-RU');

        document.getElementById('calcPlaceholder').style.display = 'none';
        document.getElementById('calcResultContent').classList.add('active');
    }

    document.getElementById('calcProduct').addEventListener('change', calculatePrice);
    document.getElementById('calcQuantity').addEventListener('change', calculatePrice);
    document.getElementById('calcComplexity').addEventListener('change', calculatePrice);

    calculatePrice();

    console.log('calculator.js loaded');
});

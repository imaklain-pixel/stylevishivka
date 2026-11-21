/* ============================================================
   portfolio.js — галереи для страницы портфолио
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var hg = document.getElementById('gallery-hats');
    if (!hg) return; // если портфолио нет на странице — выходим

    /* ===== УНИВЕРСАЛЬНАЯ ОТРИСОВКА ГАЛЕРЕИ ===== */
    function renderGallery(containerId, images, alt, caption) {
        var container = document.getElementById(containerId);
        if (!container) return;

        images.forEach(function(src, index) {
            if (!src) return;
            var el = document.createElement('div');
            var img = document.createElement('img');
            var label = document.createElement('div');

            el.className = 'gallery-item';
            img.src = src;
            img.alt = alt + ' — пример работы ' + (index + 1);
            img.loading = 'lazy';
            img.decoding = 'async';
            img.addEventListener('click', function() {
                openLightbox(src);
            });

            label.className = 'caption';
            label.textContent = caption;
            el.appendChild(img);
            el.appendChild(label);
            container.appendChild(el);
        });
    }

    /* ===== КЕПКИ ===== */
    var hatImages = [
        'assets/images/WhatsApp Image 2024-11-12 at 12.10.11 (1).webp',
        'assets/images/WhatsApp Image 2024-11-12 at 12.10.11.webp',
        'assets/images/fancywork008-07082026-0001.webp',
        'assets/images/fancywork008-07082026-0002.jpeg',
        'assets/images/fancywork008-07082026-0004.jpeg',
        'assets/images/fancywork008-07082026-0005.jpeg',
        'assets/images/fancywork008-07082026-0006.webp',
        'assets/images/fancywork008-07082026-0010.webp',
        'assets/images/fancywork008-07082026-0014.webp',
        'assets/images/fancywork008-07082026-0015.webp',
        'assets/images/fancywork008-07082026-0016.webp',
        'assets/images/fancywork008-07082026-0018.webp',
        'assets/images/fancywork008-07082026-0019.webp',
        'assets/images/fancywork008-07082026-0020.webp',
        'assets/images/fancywork008-07082026-0024.webp',
        'assets/images/fancywork008-07082026-0067.webp',
        'assets/images/fancywork008-07082026-0068.webp',
        'assets/images/fancywork008-07082026-0096.webp',
        'assets/images/fancywork008-07082026-0097.webp',
        'assets/images/fancywork008-07082026-0102.webp',
        'assets/images/fancywork008-07082026-0106.webp',
        'assets/images/fancywork008-07082026-0107.webp',
        'assets/images/fancywork008-07082026-0108.webp',
        'assets/images/fancywork008-07082026-0109.webp',
        'assets/images/fancywork008-07082026-0110.webp',
        'assets/images/fancywork008-07082026-0113.webp',
        'assets/images/fancywork008-07082026-0115.webp',
        'assets/images/fancywork008-07082026-0116.webp',
        'assets/images/fancywork008-07082026-0118.webp',
        'assets/images/fancywork008-07082026-0120.webp',
        'assets/images/fancywork008-07082026-0121.webp',
        'assets/images/fancywork008-07082026-0128.jpeg',
        'assets/images/fancywork008-07082026-0130.webp'
    ];

    /* ===== НАШИВКИ ===== */
    var patchImages = [
        'assets/images/fancywork008-07082026-0131.webp',
        'assets/images/fancywork008-07082026-0127.jpeg',
        'assets/images/fancywork008-07082026-0111.webp',
        'assets/images/fancywork008-07082026-0093.webp',
        'assets/images/fancywork008-07082026-0079.webp',
        'assets/images/fancywork008-07082026-0069.webp',
        'assets/images/fancywork008-07082026-0064.webp',
        'assets/images/fancywork008-07082026-0049.webp',
        'assets/images/fancywork008-07082026-0030.jpeg',
        'assets/images/fancywork008-07082026-0023.webp',
        'assets/images/fancywork008-07082026-0022.webp',
        '',
        'assets/images/fancywork008-07082026-0013.webp',
        'assets/images/fancywork008-07082026-0012.webp',
        'assets/images/fancywork008-07082026-0011.webp',
        'assets/images/fancywork008-07082026-0009.jpeg',
        'assets/images/fancywork008-07082026-0008.jpeg',
        'assets/images/fancywork008-07082026-0007.jpeg',
        'assets/images/e94fa25f-8004-45fb-aaab-092526e9bf08.webp',
        'assets/images/df8dbaca-ba7d-4ca5-b14d-58136bd3d6d8.webp',
        'assets/images/cd394e9f-5cb3-4296-bed4-d14f420e1970 (2).webp',
        'assets/images/c202f2f6-b360-41c6-8f21-75d89e03e36f.webp',
        'assets/images/b202d3bc-53b2-4482-8f7a-e9e4774f16b3.webp',
        'assets/images/WhatsApp Image 2024-11-14 at 15.59.35.webp',
        'assets/images/IMG_4328.webp',
        'assets/images/IMG_2059 (1).webp',
        'assets/images/IMG_20250928_174737677_HDR.webp',
        'assets/images/IMG_1018 (2).webp',
        'assets/images/9df882d5-a68a-42b2-8f47-57604a454539.jpg',
        'assets/images/8d68ce95-16ce-4c82-a154-06acebea1836.webp',
        'assets/images/70da5507-fc93-4a47-9572-5a95024f5576.webp',
        ''
    ];

    /* ===== БРЕНДИРОВАНИЕ ОДЕЖДЫ ===== */
    var clothImages = [
        'assets/images/fancywork008-07082026-0134.jpeg',
        'assets/images/fancywork008-07082026-0133.webp',
        'assets/images/fancywork008-07082026-0132.webp',
        'assets/images/fancywork008-07082026-0131.webp',
        'assets/images/fancywork008-07082026-0123.webp',
        'assets/images/fancywork008-07082026-0122.webp',
        'assets/images/fancywork008-07082026-0114.webp',
        'assets/images/fancywork008-07082026-0105.webp',
        'assets/images/fancywork008-07082026-0104.webp',
        'assets/images/fancywork008-07082026-0103.webp',
        'assets/images/fancywork008-07082026-0100.webp',
        'assets/images/fancywork008-07082026-0099.webp',
        'assets/images/fancywork008-07082026-0098.webp',
        'assets/images/fancywork008-07082026-0092.webp',
        'assets/images/fancywork008-07082026-0091.webp',
        'assets/images/fancywork008-07082026-0089.webp',
        'assets/images/fancywork008-07082026-0088.webp',
        'assets/images/fancywork008-07082026-0087.webp',
        'assets/images/fancywork008-07082026-0086.webp',
        'assets/images/fancywork008-07082026-0085.webp',
        'assets/images/fancywork008-07082026-0082.webp',
        'assets/images/fancywork008-07082026-0080.webp',
        'assets/images/fancywork008-07082026-0077.webp',
        'assets/images/fancywork008-07082026-0076.webp',
        'assets/images/fancywork008-07082026-0075.webp',
        'assets/images/fancywork008-07082026-0074.webp',
        'assets/images/fancywork008-07082026-0073.webp',
        'assets/images/fancywork008-07082026-0072.webp',
        'assets/images/fancywork008-07082026-0071.webp',
        'assets/images/fancywork008-07082026-0070.webp',
        'assets/images/fancywork008-07082026-0065.webp',
        'assets/images/fancywork008-07082026-0063.webp',
        'assets/images/fancywork008-07082026-0062.webp',
        'assets/images/fancywork008-07082026-0061.webp',
        'assets/images/fancywork008-07082026-0060.webp',
        'assets/images/fancywork008-07082026-0059.webp',
        'assets/images/fancywork008-07082026-0058.webp',
        'assets/images/fancywork008-07082026-0057.webp',
        '',
        'assets/images/fancywork008-07082026-0055.webp',
        'assets/images/fancywork008-07082026-0052.webp',
        'assets/images/fancywork008-07082026-0051.webp',
        'assets/images/fancywork008-07082026-0050.webp',
        'assets/images/fancywork008-07082026-0048.webp',
        'assets/images/fancywork008-07082026-0046.webp',
        'assets/images/fancywork008-07082026-0045.webp',
        'assets/images/fancywork008-07082026-0044.webp',
        'assets/images/fancywork008-07082026-0042.webp',
        'assets/images/fancywork008-07082026-0041.webp',
        'assets/images/fancywork008-07082026-0040.webp',
        'assets/images/fancywork008-07082026-0039.webp',
        'assets/images/fancywork008-07082026-0037.jpeg',
        'assets/images/fancywork008-07082026-0036.jpeg',
        'assets/images/fancywork008-07082026-0035.jpeg',
        'assets/images/fancywork008-07082026-0034.jpeg',
        'assets/images/fancywork008-07082026-0032.jpeg',
        'assets/images/fancywork008-07082026-0029.jpeg',
        'assets/images/fancywork008-07082026-0028.webp',
        'assets/images/fancywork008-07082026-0026.webp',
        'assets/images/WhatsApp Image 2024-11-15 at 16.58.31.webp',
        'assets/images/WhatsApp Image 2024-11-15 at 16.58.31 (2).jpeg',
        'assets/images/WhatsApp Image 2024-11-15 at 16.58.31 (1).webp',
        'assets/images/WhatsApp Image 2024-11-14 at 15.59.34.jpeg',
        'assets/images/IMG_20250928_125525389.webp',
        'assets/images/IMG_20250908_181348753.webp'
    ];

    /* ===== ОТРИСОВКА ===== */
    renderGallery('gallery-hats',     hatImages,   'Кепка с логотипом',   'Кепка с логотипом');
    renderGallery('gallery-patches',  patchImages, 'Нашивка на заказ',    'Нашивка / шеврон');
    renderGallery('gallery-clothing', clothImages, 'Логотип на одежде',   'Брендирование одежды');

    /* ===== ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИЙ ===== */
    window.openCategory = function(category) {
        document.querySelectorAll('.gallery-grid').forEach(function(el) {
            el.classList.remove('active');
        });
        var target = document.getElementById('gallery-' + category);
        if (target) {
            target.classList.add('active');
            setTimeout(function() {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    };

    console.log('✅ portfolio.js загружен. Кепки:', hatImages.length,
                '| Нашивки:', patchImages.length,
                '| Одежда:', clothImages.length);
});

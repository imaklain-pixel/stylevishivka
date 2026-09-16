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

        images.forEach(function(src) {
            var el = document.createElement('div');
            el.className = 'gallery-item';
            el.innerHTML =
                '<img src="' + src + '" alt="' + alt + '" onclick="openLightbox(\'' + src + '\')">' +
                '<div class="caption">' + caption + '</div>';
            container.appendChild(el);
        });
    }

    /* ===== КЕПКИ ===== */
    var hatImages = [
        'https://imaklain-pixel.github.io/my-vishivka-sit/WhatsApp%20Image%202024-11-12%20at%2012.10.11%20(1).jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/WhatsApp%20Image%202024-11-12%20at%2012.10.11.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0001.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0002.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0004.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0005.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0006.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0010.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0014.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0015.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0016.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0018.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0019.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0020.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0024.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0067.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0068.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0096.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0097.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0102.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0106.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0107.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0108.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0109.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0110.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0113.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0115.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0116.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0118.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0120.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0121.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0128.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0130.jpeg'
    ];

    /* ===== НАШИВКИ ===== */
    var patchImages = [
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0131.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0127.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0111.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0093.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0079.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0069.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0064.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0049.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0030.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0023.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0022.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0017.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0013.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0012.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0011.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0009.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0008.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0007.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/e94fa25f-8004-45fb-aaab-092526e9bf08.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/df8dbaca-ba7d-4ca5-b14d-58136bd3d6d8.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/cd394e9f-5cb3-4296-bed4-d14f420e1970%20(2).jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/c202f2f6-b360-41c6-8f21-75d89e03e36f.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/b202d3bc-53b2-4482-8f7a-e9e4774f16b3.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/WhatsApp%20Image%202024-11-14%20at%2015.59.35.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/IMG_4328.JPG',
        'https://imaklain-pixel.github.io/my-vishivka-sit/IMG_2059%20(1).JPG',
        'https://imaklain-pixel.github.io/my-vishivka-sit/IMG_20250928_174737677_HDR.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/IMG_1018%20(2).JPG',
        'https://imaklain-pixel.github.io/my-vishivka-sit/9df882d5-a68a-42b2-8f47-57604a454539.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/8d68ce95-16ce-4c82-a154-06acebea1836.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/70da5507-fc93-4a47-9572-5a95024f5576.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/00882fc1-9a8e-42fd-a657-48974bfbf71c%20(1).jpg'
    ];

    /* ===== БРЕНДИРОВАНИЕ ОДЕЖДЫ ===== */
    var clothImages = [
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0134.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0133.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0132.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0131.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0123.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0122.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0114.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0105.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0104.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0103.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0100.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0099.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0098.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0092.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0091.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0089.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0088.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0087.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0086.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0085.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0082.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0080.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0077.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0076.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0075.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0074.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0073.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0072.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0071.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0070.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0065.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0063.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0062.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0061.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0060.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0059.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0058.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0057.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0056.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0055.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0052.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0051.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0050.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0048.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0046.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0045.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0044.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0042.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0041.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0040.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0039.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0037.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0036.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0035.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0034.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0032.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0029.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0028.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/fancywork008-07082026-0026.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/WhatsApp%20Image%202024-11-15%20at%2016.58.31.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/WhatsApp%20Image%202024-11-15%20at%2016.58.31%20(2).jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/WhatsApp%20Image%202024-11-15%20at%2016.58.31%20(1).jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/WhatsApp%20Image%202024-11-14%20at%2015.59.34.jpeg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/IMG_20250928_125525389.jpg',
        'https://imaklain-pixel.github.io/my-vishivka-sit/IMG_20250908_181348753.jpg'
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

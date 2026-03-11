/**
 * AniLiberty — плагін для Lampa
 * Додає пункт "AniLiberty" у ліве меню Lampa
 * і відкриває https://aniliberty.netlify.app/ у повноекранному режимі
 *
 * Встановлення:
 *   Налаштування → Розширення → Додати плагін → [URL цього файлу]
 */

(function () {
    'use strict';

    var PLUGIN_NAME = 'AniLiberty';
    var PLUGIN_URL  = 'https://aniliberty.netlify.app/';

    // ─── HTML-шаблон ────────────────────────────────────────────────────────
    Lampa.Template.add('aniliberty_view', `
        <div class="aniliberty-wrap">
            <div class="aniliberty-loader" id="aniliberty-loader">
                <div class="aniliberty-loader__spinner"></div>
                <div class="aniliberty-loader__text">AniLiberty</div>
            </div>
            <iframe
                id="aniliberty-frame"
                class="aniliberty-frame"
                src=""
                allowfullscreen
                allow="autoplay; fullscreen"
                scrolling="yes"
            ></iframe>
        </div>
    `);

    // ─── CSS ─────────────────────────────────────────────────────────────────
    var style = document.createElement('style');
    style.textContent = `
        /* Враппер займає весь экран поверх Lampa */
        .aniliberty-wrap {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: #0d0d0d;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* iframe на весь екран */
        .aniliberty-frame {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border: none;
            opacity: 0;
            transition: opacity .4s ease;
        }
        .aniliberty-frame.loaded {
            opacity: 1;
        }

        /* Лоадер */
        .aniliberty-loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            z-index: 1;
            pointer-events: none;
            transition: opacity .4s ease;
        }
        .aniliberty-loader.hidden {
            opacity: 0;
        }
        .aniliberty-loader__spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(255,255,255,.15);
            border-top-color: #e55a5a;
            border-radius: 50%;
            animation: aniliberty-spin .8s linear infinite;
        }
        .aniliberty-loader__text {
            color: rgba(255,255,255,.55);
            font-size: 14px;
            letter-spacing: .12em;
            text-transform: uppercase;
        }
        @keyframes aniliberty-spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ─── Компонент ───────────────────────────────────────────────────────────
    function AniLibertyComponent(object) {
        var html;

        this.create = function () {
            html = Lampa.Template.get('aniliberty_view', {});

            var frame  = html.find('#aniliberty-frame')[0];
            var loader = html.find('#aniliberty-loader')[0];

            // Показуємо сайт після завантаження
            frame.addEventListener('load', function () {
                frame.classList.add('loaded');
                loader.classList.add('hidden');
            });

            // Встановлюємо src тільки тепер (щоб не грузило раніше часу)
            frame.src = PLUGIN_URL;

            // Повідомляємо Lampa що лоадер більше не потрібен
            this.activity.loader(false);
            this.activity.toggle();
        };

        this.start   = function () {};
        this.pause   = function () {};
        this.stop    = function () {};
        this.destroy = function () {
            // Зупиняємо iframe перед видаленням (зупиняє відео)
            var frame = html && html.find('#aniliberty-frame')[0];
            if (frame) frame.src = 'about:blank';
            if (html)  html.remove();
        };

        // Рендеримо безпосередньо враппер (без Lampa.Scroll — не потрібен)
        this.render = function () {
            return html;
        };
    }

    // ─── Реєстрація ──────────────────────────────────────────────────────────
    Lampa.Component.add('aniliberty', AniLibertyComponent);

    // ─── Додавання пункту в меню після старту ────────────────────────────────
    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            Lampa.Menu.add({
                title:     PLUGIN_NAME,
                subtitle:  'Аніме від AniLibria',
                icon:      'channel',
                component: 'aniliberty',
                order:     4          // відразу після стандартних пунктів
            });

            Lampa.Menu.render();     // перемалювати меню
        }
    });

    console.log('[AniLiberty] Плагін завантажено ✓');

})();

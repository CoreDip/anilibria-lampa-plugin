(function () {
    'use strict';

    // Захист від подвійного завантаження
    if (window.plugin_aniliberty_ready) return;
    window.plugin_aniliberty_ready = true;

    var PLUGIN_NAME = 'AniLiberty';
    var SITE_URL    = 'https://aniliberty.netlify.app/';

    // ─── Іконка (SVG play-кнопка) ─────────────────────────────────────────────
    function getIcon() {
        var svg = document.createElement('div');
        svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">'
            + '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 '
            + '10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>'
            + '</svg>';
        return $(svg);
    }

    // ─── CSS ──────────────────────────────────────────────────────────────────
    var style = document.createElement('style');
    style.textContent = [
        '.alib-wrap{position:fixed;inset:0;z-index:9999;background:#0d0d0d;display:flex;align-items:center;justify-content:center;}',
        '.alib-frame{position:absolute;inset:0;width:100%;height:100%;border:none;opacity:0;transition:opacity .4s;}',
        '.alib-frame.loaded{opacity:1;}',
        '.alib-loader{display:flex;flex-direction:column;align-items:center;gap:16px;z-index:1;transition:opacity .4s;}',
        '.alib-loader.hidden{opacity:0;pointer-events:none;}',
        '.alib-spinner{width:44px;height:44px;border:3px solid rgba(255,255,255,.12);border-top-color:#e55a5a;border-radius:50%;animation:alib-spin .8s linear infinite;}',
        '.alib-label{color:rgba(255,255,255,.5);font-size:13px;letter-spacing:.1em;text-transform:uppercase;}',
        '@keyframes alib-spin{to{transform:rotate(360deg);}}'
    ].join('');
    document.head.appendChild(style);

    // ─── Шаблон ───────────────────────────────────────────────────────────────
    Lampa.Template.add('aniliberty_view',
        '<div class="alib-wrap">' +
            '<div class="alib-loader" id="alib-loader">' +
                '<div class="alib-spinner"></div>' +
                '<div class="alib-label">AniLiberty</div>' +
            '</div>' +
            '<iframe id="alib-frame" class="alib-frame" src="" allowfullscreen allow="autoplay; fullscreen"></iframe>' +
        '</div>'
    );

    // ─── Компонент ────────────────────────────────────────────────────────────
    function AniLibertyComponent(object) {
        var html;

        this.create = function () {
            html = Lampa.Template.get('aniliberty_view', {});

            var frame  = html.find('#alib-frame')[0];
            var loader = html.find('#alib-loader')[0];

            frame.addEventListener('load', function () {
                frame.classList.add('loaded');
                loader.classList.add('hidden');
            });

            frame.src = SITE_URL;

            this.activity.loader(false);
            this.activity.toggle();
        };

        this.start   = function () {};
        this.pause   = function () {};
        this.stop    = function () {};
        this.destroy = function () {
            var frame = html && html.find('#alib-frame')[0];
            if (frame) frame.src = 'about:blank';
            if (html)  html.remove();
        };

        this.render = function () { return html; };
    }

    Lampa.Component.add('aniliberty', AniLibertyComponent);

    // ─── Ініціалізація ─────────────────────────────────────────────────────────
    function init() {
        // Саме так як у hikka.js — Lampa.Menu.addButton(icon, title, callback)
        Lampa.Menu.addButton(getIcon(), PLUGIN_NAME, function () {
            Lampa.Activity.push({
                url:       '',
                title:     PLUGIN_NAME,
                component: 'aniliberty',
                page:      1
            });
        });
    }

    // ─── Запуск ───────────────────────────────────────────────────────────────
    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

})();

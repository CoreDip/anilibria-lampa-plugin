/**
 * AniLiberty — плагін для Lampa
 * Додає пункт "AniLiberty" у ліве меню Lampa
 */

(function () {
    'use strict';

    var PLUGIN_NAME = 'AniLiberty';
    var SITE_URL    = 'https://aniliberty.netlify.app/';

    // ─── CSS ─────────────────────────────────────────────────────────────────
    var style = document.createElement('style');
    style.textContent = [
        '.aniliberty-wrap{position:fixed;inset:0;z-index:9999;background:#0d0d0d;display:flex;align-items:center;justify-content:center;}',
        '.aniliberty-frame{position:absolute;inset:0;width:100%;height:100%;border:none;opacity:0;transition:opacity .4s;}',
        '.aniliberty-frame.loaded{opacity:1;}',
        '.aniliberty-loader{display:flex;flex-direction:column;align-items:center;gap:20px;z-index:1;transition:opacity .4s;}',
        '.aniliberty-loader.hidden{opacity:0;pointer-events:none;}',
        '.aniliberty-spinner{width:48px;height:48px;border:3px solid rgba(255,255,255,.15);border-top-color:#e55a5a;border-radius:50%;animation:alib-spin .8s linear infinite;}',
        '.aniliberty-label{color:rgba(255,255,255,.55);font-size:14px;letter-spacing:.1em;text-transform:uppercase;}',
        '@keyframes alib-spin{to{transform:rotate(360deg);}}'
    ].join('');
    document.head.appendChild(style);

    // ─── HTML-шаблон ─────────────────────────────────────────────────────────
    Lampa.Template.add('aniliberty_view', '<div class="aniliberty-wrap">'
        + '<div class="aniliberty-loader" id="alib-loader">'
        +   '<div class="aniliberty-spinner"></div>'
        +   '<div class="aniliberty-label">AniLiberty</div>'
        + '</div>'
        + '<iframe id="alib-frame" class="aniliberty-frame" src="" allowfullscreen allow="autoplay;fullscreen"></iframe>'
        + '</div>');

    // ─── Компонент ───────────────────────────────────────────────────────────
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

    // ─── Додавання пункту в меню ─────────────────────────────────────────────
    function addMenuItem() {
        if ($('.menu__item[data-action="aniliberty"]').length) return;

        var item = $([
            '<li class="menu__item selector" data-action="aniliberty">',
            '  <div class="menu__ico">',
            '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">',
            '      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>',
            '    </svg>',
            '  </div>',
            '  <div class="menu__text">' + PLUGIN_NAME + '</div>',
            '</li>'
        ].join(''));

        var menu = $('.menu .menu__list').first();
        if (menu.length) {
            menu.append(item);
        }

        item.on('hover:enter', function () {
            Lampa.Activity.push({
                url:       SITE_URL,
                title:     PLUGIN_NAME,
                component: 'aniliberty',
                page:      1
            });
        });
    }

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            setTimeout(addMenuItem, 500);
        }
    });

    // Запасний варіант
    setTimeout(addMenuItem, 2000);

    console.log('[AniLiberty] Плагін завантажено ✓');

})();

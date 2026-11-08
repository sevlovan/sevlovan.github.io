(function () {
    var KEY = 'itsims-theme';

    function current() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function readStored() {
        try {
            var fromStore = localStorage.getItem(KEY);
            if (fromStore === 'dark' || fromStore === 'light') return fromStore;
        } catch (e) {}
        try {
            var match = document.cookie.match(/(?:^|;\s*)itsims-theme=(dark|light)(?:;|$)/);
            if (match) return match[1];
        } catch (e) {}
        return null;
    }

    function writeStored(theme) {
        try { localStorage.setItem(KEY, theme); } catch (e) {}
        try {
            document.cookie = KEY + '=' + theme + '; path=/; max-age=31536000; SameSite=Lax';
        } catch (e) {}
    }

    function syncButton(btn) {
        var dark = current() === 'dark';
        btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
        btn.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
        btn.title = dark ? 'Светлая тема' : 'Тёмная тема';
        var icon = btn.querySelector('i');
        if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }

    function syncRequestLinks(theme) {
        document.querySelectorAll('a[href*="request.html"]').forEach(function (link) {
            try {
                var url = new URL(link.getAttribute('href'), window.location.href);
                url.searchParams.set('theme', theme);
                var next = url.pathname.split('/').pop() + url.search + url.hash;
                link.setAttribute('href', next);
            } catch (e) {}
        });
    }

    function apply(theme) {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
        writeStored(theme);
        document.querySelectorAll('.theme-toggle').forEach(syncButton);
        syncRequestLinks(theme);
    }

    function toggle() {
        apply(current() === 'dark' ? 'light' : 'dark');
    }

    // если в head скрипт не сработал — дотягиваем тему из storage/cookie
    var stored = readStored();
    if (stored === 'dark' && current() !== 'dark') apply('dark');
    else if (stored === 'light' && current() === 'dark') apply('light');
    else syncRequestLinks(current());

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            syncButton(btn);
            btn.addEventListener('click', toggle);
        });
        syncRequestLinks(current());
    });
})();

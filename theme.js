(function () {
    var KEY = 'itsims-theme';

    function current() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function syncButton(btn) {
        var dark = current() === 'dark';
        btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
        btn.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
        btn.title = dark ? 'Светлая тема' : 'Тёмная тема';
        var icon = btn.querySelector('i');
        if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }

    function apply(theme) {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem(KEY, theme); } catch (e) {}
        document.querySelectorAll('.theme-toggle').forEach(syncButton);
    }

    function toggle() {
        apply(current() === 'dark' ? 'light' : 'dark');
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            syncButton(btn);
            btn.addEventListener('click', toggle);
        });
    });
})();

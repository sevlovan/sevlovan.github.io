(function () {
    var KEY = 'itsims-theme';
    var theme = null;

    try {
        var fromQuery = new URLSearchParams(window.location.search).get('theme');
        if (fromQuery === 'dark' || fromQuery === 'light') theme = fromQuery;
    } catch (e) {}

    if (!theme) {
        try {
            var fromStore = localStorage.getItem(KEY);
            if (fromStore === 'dark' || fromStore === 'light') theme = fromStore;
        } catch (e) {}
    }

    if (!theme) {
        try {
            var match = document.cookie.match(/(?:^|;\s*)itsims-theme=(dark|light)(?:;|$)/);
            if (match) theme = match[1];
        } catch (e) {}
    }

    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');

    if (theme) {
        try { localStorage.setItem(KEY, theme); } catch (e) {}
        try {
            document.cookie = KEY + '=' + theme + '; path=/; max-age=31536000; SameSite=Lax';
        } catch (e) {}
    }
})();

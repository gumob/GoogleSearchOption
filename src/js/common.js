/****************************************
* Model
****************************************/

/* Localization data */
var locales = ["en", "ja"];
var localeData = {};

/* Data source */
var dataSourceMap = {}
var dataSource = [
    /* Hour */
    {type: "qdr", enabled: true, storageKey: "past_hour_1", query: "qdr:h", nodeClass: "qdr_hour", nodeId: "qdr_h", baseId: "qdr_d"},
    {type: "qdr", enabled: false, storageKey: "past_hour_12", query: "qdr:h12", nodeClass: "qdr_hour", nodeId: "qdr_h12", baseId: "qdr_d"},
    {type: "qdr", enabled: true, storageKey: "past_hour_24", query: "qdr:d", nodeClass: "qdr_hour", nodeId: "qdr_d", baseId: "qdr_d"},

    {type: "bdr", nodeClass: "qdr_hour", nodeId: "cdr_sep_h"},

    /* Day */
    {type: "qdr", enabled: false, storageKey: "past_day_2", query: "qdr:d2", nodeClass: "qdr_day", nodeId: "qdr_d2", baseId: "qdr_w"},
    {type: "qdr", enabled: false, storageKey: "past_day_3", query: "qdr:d3", nodeClass: "qdr_day", nodeId: "qdr_d3", baseId: "qdr_w"},

    {type: "bdr", nodeClass: "qdr_day", nodeId: "cdr_sep_d"},

    /* Week */
    {type: "qdr", enabled: true, storageKey: "past_week_1", query: "qdr:w", nodeClass: "qdr_week", nodeId: "qdr_w", baseId: "qdr_m"},
    {type: "qdr", enabled: false, storageKey: "past_week_2", query: "qdr:w2", nodeClass: "qdr_week", nodeId: "qdr_w2", baseId: "qdr_m"},
    {type: "qdr", enabled: false, storageKey: "past_week_3", query: "qdr:w3", nodeClass: "qdr_week", nodeId: "qdr_w3", baseId: "qdr_m"},

    {type: "bdr", nodeClass: "qdr_week", nodeId: "cdr_sep_w"},

    /* Month */
    {type: "qdr", enabled: true, storageKey: "past_month_1", query: "qdr:m", nodeClass: "qdr_month", nodeId: "qdr_m", baseId: "qdr_y"},
    {type: "qdr", enabled: false, storageKey: "past_month_3", query: "qdr:m3", nodeClass: "qdr_month", nodeId: "qdr_m3", baseId: "qdr_y"},
    {type: "qdr", enabled: false, storageKey: "past_month_6", query: "qdr:m6", nodeClass: "qdr_month", nodeId: "qdr_m6", baseId: "qdr_y"},
    {type: "qdr", enabled: false, storageKey: "past_month_9", query: "qdr:m9", nodeClass: "qdr_month", nodeId: "qdr_m9", baseId: "qdr_y"},

    {type: "bdr", nodeClass: "qdr_month", nodeId: "cdr_sep_m"},

    /* Year */
    {type: "qdr", enabled: true, storageKey: "past_year_1", query: "qdr:y", nodeClass: "qdr_year", nodeId: "qdr_y", baseId: "cdr_opt"},
    {type: "qdr", enabled: false, storageKey: "past_year_2", query: "qdr:y2", nodeClass: "qdr_year", nodeId: "qdr_y2", baseId: "cdr_opt"},
    {type: "qdr", enabled: false, storageKey: "past_year_3", query: "qdr:y3", nodeClass: "qdr_year", nodeId: "qdr_y3", baseId: "cdr_opt"},

    {type: "bdr", nodeClass: "qdr_year", nodeId: "cdr_sep_y"},

    /* Year */
    {type: "qdr", enabled: false, storageKey: "over_year_1", query: getOptionForOverYear(1), nodeClass: "qdr_eyear", nodeId: "qdr_ey1", baseId: "cdr_opt"},
    {type: "qdr", enabled: false, storageKey: "over_year_2", query: getOptionForOverYear(2), nodeClass: "qdr_eyear", nodeId: "qdr_ey2", baseId: "cdr_opt"},
    {type: "qdr", enabled: false, storageKey: "over_year_3", query: getOptionForOverYear(3), nodeClass: "qdr_eyear", nodeId: "qdr_ey3", baseId: "cdr_opt"},

    {type: "bdr", nodeClass: "qdr_eyear", nodeId: "cdr_sep_ey"},

    /* Appearance */
    {type: "app", enabled: true, storageKey: "show_border"},
    {type: "app", enabled: false, storageKey: "monochrome_icon"},
    {type: "app", enabled: false, storageKey: "dark_theme"}
];

function getOptionForOverYear(yearDiff) {
    var d = new Date();
    d.setFullYear(d.getFullYear() - parseInt(yearDiff));
    return "cdr:1,cd_min:,cd_max:" + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
}

/****************************************
* Initialization
****************************************/

function loadConfiguration(callback) {
    loadLocalization(0, function() {
        console.dir(localeData);
        initDataSource(callback);
    });
}

function loadLocalization(localeIndex, localeCallback) {
    var loc = locales[localeIndex];
    var jsonUrl = chrome.extension.getURL("_locales/" + loc + "/messages.json");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", jsonUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var data = JSON.parse(xhr.responseText);
            loadLocalizationComplete(localeIndex, loc, data, localeCallback);
        };
    };
    xhr.send();
}

function loadLocalizationComplete(localeIndex, locale, data, localeCallback) {
    localeData[locale] = {};
    for (var key in data) {
        localeData[locale][key] = data[key]["message"];
    }
    if (localeIndex < locales.length - 1) {
        loadLocalization(++localeIndex, localeCallback);
    } else {
        localeCallback();
    }
}

function initDataSource(callback) {
    var storageKeys = [];
    for (var i in dataSource) {
        var model = dataSource[i];
        if ("storageKey" in model) {
            storageKeys.push(model.storageKey);
        }
    }
    getConfiguration(storageKeys, function(storageData) {
        console.dir(storageData);

        for (var i in dataSource) {
            var model = dataSource[i];
            if ("storageKey" in model) {
                var storageKey = model.storageKey;
                /* Enabled */
                if (storageData[storageKey] === undefined) {
                    setConfiguration(storageKey, model.enabled);
                } else {
                    dataSource[i].enabled = storageData[storageKey];
                }
                /* Locales */
                dataSource[i].locales = {};
                for (var key in localeData) {
                    dataSource[i].locales[key] = localeData[key][storageKey];
                }
                /* Map */
                dataSourceMap[storageKey] = i;
            }
        }

        callback(dataSource, dataSourceMap);
    });
}

/****************************************
* Configuration
****************************************/

function setConfiguration(key, value, configCallback) {
    var keyValuePair = {};
    keyValuePair[key] = value;
    chrome.storage.local.set(keyValuePair, function () {
        if (configCallback) {
            configCallback(key, value);    
        }
    });
}

function getConfiguration(keys, configCallback) {
    chrome.storage.local.get(keys, configCallback);
}

/****************************************
* Icon
****************************************/

function setupIcon() {

    getConfiguration(["monochrome_icon", "dark_theme"], function (value) {
        var isMonoIcon = value.monochrome_icon;
        var isDarkTheme = value.dark_theme;
        var iconPath = "images/icon-color-128.png";
        if (isMonoIcon) {
            if (isDarkTheme) {
                var iconPath = "images/icon-dark-128.png";
            } else {
                var iconPath = "images/icon-light-128.png";
            }
        }
        var data = {
            "path": iconPath
        };
        try {
            chrome.browserAction.setIcon(data);
        } catch(e) {
            console.dir(e);
        }
    });
}

/****************************************
* Environment
****************************************/

function getPageLocale() {
    var regexp = new RegExp("^(?:.*[&\\?]" + encodeURIComponent("hl").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i");
    var locale = decodeURIComponent(window.location.search.replace(regexp, "$1")).toLowerCase();
    if (locale != "ja") {
        locale = "en";
    }
    return locale;
}

function getBrowser() {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('vivaldi') >= 0) {
        return "vivaldi";
    } else if (userAgent.indexOf('chrome') >= 0) {
        return "chrome";
    } else {
        return "unknown"
    }
}

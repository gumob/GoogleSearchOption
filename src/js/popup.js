$(document).ready(function() {

    $(".trans").fadeOut(0);

    function configurationDidChange(key, value, animated) {
        switch (key) {

            case "dark_theme":
            console.log("configurationDidChange", "key", key, "value", value);
            $(".container, header, artcile, .switch").toggleClass("animated", animated);
            $(".container, header, artcile, h1, h2").toggleClass("dark", value);
            $(".switch").toggleClass("switch-dark", value);

            case "monochrome_icon":
            console.log("configurationDidChange", "key", key, "value", value);
            setupIcon();
            break;

            default:
            break;
        }
    }

    loadConfiguration(function(dataSource, dataSourceMap) {
        console.log("loadConfiguration");
        console.dir(dataSource);
        console.dir(dataSourceMap);
        /* Apply css for chrome */
        var browser = getBrowser();
        if (browser === "chrome") {
            $(".container").addClass("chrome");
        }
        /* Apply stored value */
        for (var i in dataSource) {
            var model = dataSource[i];
            $("#" + model.storageKey).prop("checked", model.enabled);
            configurationDidChange(model.storageKey, model.enabled, false);
        }
        /* Bind event */
        $("input.switch").bind('change', function() {
            setConfiguration(this.id, this.checked, function(k, v) {
                configurationDidChange(k, v, true);
            })
        });
        /* Display container */
        $(".trans").each(function(index) {
            $(this).delay(15 * index).fadeIn(200);
        });
    });

});

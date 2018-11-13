$(document).ready(function() {

    $(".trans, #title").fadeOut(0);

    var isHeaderAnimationExecuted = false;
    var isUIAnimationExecuted = false;
    var isLoadComfigCompleted = false;
    var uiAnimationTimer;

    function startHeaderAnimation() {
        var animation = lottie.loadAnimation({
            container: $("#logo")[0],
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: 'images/logo-motion.json'
        });
        animation.setSpeed(2);
        animation.onEnterFrame = function(e) {
            var ratio = e.currentTime / e.totalTime;
            if (ratio > 0.6 && isHeaderAnimationExecuted == false) {
                isHeaderAnimationExecuted = true;
                startTitleAnimation();
            }
        }
        animation.play();
    }

    function startTitleAnimation() {
        var $title = $('#title');
        var letters = $title.text().split("");
        $title.text("");
        $title.fadeIn(0);
        $.each(letters, function(index, elem) {
            var $letter = $("<span/>").text(elem).css({
                opacity: 0
            });
            $letter.appendTo($title);
            $letter.delay(index * 12);
            if (index == letters.length - 10) {
                $letter.animate({
                    opacity: 1
                }, {
                    duration: 200,
                    complete: function() {
                        clearInterval(uiAnimationTimer);
                        uiAnimationTimer = setInterval(startUIAnimation, 1000 / 60);
                    }
                });
            } else {
                $letter.animate({
                    opacity: 1
                }, 200);
            }
        });
    }

    function startUIAnimation() {
        /* Wait until config is loaded */
        if (isLoadComfigCompleted == true && isHeaderAnimationExecuted == true && isUIAnimationExecuted == false) {
            isUIAnimationExecuted = true;
            clearInterval(uiAnimationTimer);
            $(".trans").each(function(index) {
                $(this).delay(12 * index).fadeIn(200);
            });
        }
    }

    function configurationDidChange(key, value, animated) {
        switch (key) {
            case "dark_theme":
            $(".container, header, artcile, .switch").toggleClass("animated", animated);
            $(".container, header, artcile, h1, h2").toggleClass("dark", value);
            $(".switch").toggleClass("switch-dark", value);

            case "monochrome_icon":
            setupIcon();
            break;

            default:
            break;
        }
    }

    /* Load config (declared in common.js) */
    loadConfiguration(function(dataSource, dataSourceMap) {
        /* Apply css for chrome */
        var browser = getBrowser();
        if (browser === "chrome") {
            $(".container, header").addClass("chrome");
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
        /* Set load flag to resume animation */
        isLoadComfigCompleted = true;
    });

    /* Start header animation */
    startHeaderAnimation();

});

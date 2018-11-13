
$(document).ready(function() {
    var dataSource;
    var dataSourceMap;

    function setupOption() {
        var showBorder = dataSource[dataSourceMap["show_border"]].enabled;
        var locale = getPageLocale();;
        for (var i in dataSource) {
            var model = dataSource[i];
            switch (model.type) {

                case "qdr":
                toggleOption(
                    model.enabled,
                    model.locales[locale],
                    model.query,
                    model.nodeClass,
                    model.nodeId,
                    model.baseId
                );
                break;

                case "bdr":
                toggleBorder(
                    model.nodeClass,
                    model.nodeId,
                    showBorder
                );

                break;

                default:
                break

            }
        }
    }

    function toggleOption(isEnabled, label, query, nodeClass, nodeId, baseId) {
        var $optionNode = $("#" + nodeId);
        if ($optionNode.length == 0) {
            var $optionNode = createOptionNode(query, nodeId, label);
            var $baseNode = $("#" + baseId);
            $optionNode.insertBefore($baseNode);
        }
        $optionNode.addClass(nodeClass);
        if (isEnabled) {
            $optionNode.show();
        } else {
            $optionNode.hide();
        }
    }

    function createOptionNode(query, nodeId, label) {
        /* Find and clone node */
        var $aNode;
        $aNode = $('#qdr_m > a').clone();
        if ($aNode.length > 0) {
            var href = $aNode.attr('href').replace(/qdr:m/, query);
            $aNode.attr("href", href);
        }
        if ($aNode.length == 0) {
            $aNode = $('#qdr_y > a').clone();
            if ($aNode.length > 0) {
                var href = $aNode.attr('href').replace(/qdr:y/, query);
                $aNode.attr("href", href);
            }
        }
        if ($aNode.lenbth == 0) {
            return null;
        }
        $aNode.text(label);
        /* Create li node */
        var $liNode = $("<li>", {
            class: "hdtbItm",
            id: nodeId
        })
        $liNode.append($aNode);
        return $liNode;
    }

    function toggleBorder(nodeClass, nodeId, showBorder) {
        var $borderNode = $("#" + nodeId);
        if ($borderNode.length == 0) {
            var $baseNode = $("li." + nodeClass).first();
            $borderNode = $("<div>", {
                id: nodeId,
                class: "cdr_sep cdr_sep_dotted"
            });
            $borderNode.insertBefore($baseNode);
        }
        if (showBorder) {
            var $visibleOptionNodes = $("li." + nodeClass).filter(function() { return $(this).css("display") != "none" });
            if ($visibleOptionNodes.length > 0) {
                $borderNode.show();
            } else {
                $borderNode.hide();
            }
        } else {
            $borderNode.hide();
        }

    }

    var isInitialized = false
    var observer = new MutationObserver(function(mutations) {
        if (isInitialized) {
            return;
        }
        $(document).on("click mousedown",　".hdtb-mn-hd", function() {
            loadConfiguration(function(ds, dsm) {
                dataSource = ds;
                dataSourceMap = dsm;
                setupOption();
            });
        });
        loadConfiguration(function(ds, dsm) {
            dataSource = ds;
            dataSourceMap = dsm;
            setupOption();
        });
        isInitialized = true;
    });
    var options = {
        subtree: true,
        childList: true,
        characterData: true
    }
    observer.observe(document.body, options);
});

/*!
 * tagcloud.js — Vanilla JS tag cloud (replaces jquery.tagcloud.js)
 */

(function() {
    // Converts hex color to RGB array
    function toRGB(code) {
        code = code.replace('#', '');
        if (code.length === 3) {
            code = code[0]+code[0] + code[1]+code[1] + code[2]+code[2];
        }
        return [
            parseInt(code.substring(0, 2), 16),
            parseInt(code.substring(2, 4), 16),
            parseInt(code.substring(4, 6), 16)
        ];
    }

    // Converts RGB array to hex
    function toHex(ary) {
        return '#' + ary.map(function(i) {
            var hex = i.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    // Apply tag cloud colors to elements matching selector
    function applyTagCloud(selector, options) {
        var defaults = {
            color: { start: '#bbbbee', end: '#0085a1' }
        };
        var opts = Object.assign({}, defaults, options);
        var elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        // Collect weights from rel attribute
        var weights = [];
        elements.forEach(function(el) {
            weights.push(parseInt(el.getAttribute('rel'), 10) || 0);
        });
        weights.sort(function(a, b) { return a - b; });

        var lowest = weights[0];
        var highest = weights[weights.length - 1];
        var range = highest - lowest || 1;

        // Color increment per step
        var startRGB = toRGB(opts.color.start);
        var endRGB = toRGB(opts.color.end);
        var colorIncr = endRGB.map(function(n, i) {
            return (n - startRGB[i]) / range;
        });

        elements.forEach(function(el) {
            var weighting = (parseInt(el.getAttribute('rel'), 10) || 0) - lowest;
            var rgb = startRGB.map(function(n, i) {
                return Math.min(255, Math.max(0, Math.round(n + colorIncr[i] * weighting)));
            });
            el.style.backgroundColor = toHex(rgb);
        });
    }

    // Expose globally
    window.applyTagCloud = applyTagCloud;
})();

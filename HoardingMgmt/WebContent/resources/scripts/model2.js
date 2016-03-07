var showThumb = false;
var autoload = false;
var modelId = '';
var skinShown = false;
var thumbnailurl = '';
//var modelshown = false;

function start(logoShowTime, al, mi, tu) {

    thumbnailurl = tu;
    autoload = al;
    modelId = mi;

    if (!inIframe()) {
        autoload = true;
    }

    if (!autoload) {
        loadThumbnail();
    }

    $('#logo').fadeIn(1000);

    //return; // debug

    window.setTimeout(showmodel, logoShowTime + 0);

    window.setTimeout(showskin, logoShowTime + 6000);
}

function showmodel() {

    //if (modelshown) return;

   // modelshown = true;

    //if (typeof window.orientation !== 'undefined') {
    //    $('#wm').css('right', '10px');
    //}
    

    if (!autoload) {

        autoload = true;

       $('.skinstart').click(showmodel);

        window.setTimeout(showskin, 1000);
        $('#mp-bg').fadeIn(2000);

        showThumbnail();
    }
    else {
        $('#mp-thumb1').fadeOut(2000);

        $('#modelframe').prop('src', "https://my.matterport.com/show/?m=" + modelId + "&play=1");
       
        $('#modelframe').fadeIn(1000);
    }

    $('.skinstart').click(function () {
        $('#skin1').fadeOut(1100);
        var iframe = $("#modelframe")[0];
        iframe.contentWindow.focus();
        $('#wm').fadeIn(5000);
    });
}
 
function showThumbnail() {
    if (showThumb) {
        $('#mp-thumb1').fadeIn(2000);
    }
    showThumb = true;
}

function showskin() {
    if (!skinShown) {
        $('#skin1').fadeIn(1000);
    }
    skinShown = true;
}

function loadThumbnail() {

                var image = new Image();
    image.onload = function () {
        var bgCss = 'url(' + thumbnailurl + ') no-repeat center center fixed';
                    $('.mp-thumb').css('background', bgCss);
                    $('.mp-thumb').css('background-size', 'cover');
                    $('#mp-thumb2').fadeIn(2000);
                    showThumbnail();
                }
    image.src = thumbnailurl;
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

if (window.location.href.indexOf('actualview.in') > -1 && window.location.href.indexOf('notrack') <0)
{
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {

            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),

         m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)

    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-58521814-1', 'auto');

    ga('send', 'pageview');
}
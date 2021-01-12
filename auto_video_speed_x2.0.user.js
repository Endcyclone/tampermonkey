// ==UserScript==
// @name         Auto Video Speed x2.0
// @version      1.1
// @description  NEC研修のビデオが自動的に倍速から始まり、ビデオ終了後に自動的に次のビデオに遷移します
// @author       Kosuke Tomita
// @match        https://nec.etudes.jp/scorm-customize/content.html?key=*
// @grant        none
// ==/UserScript==

(function() {
    let $ = window.jQuery;

    let myfunc = () => {
        $('iframe').load(() => {
            let $iframe = $('iframe', $('iframe').contents());
            $iframe.load(() => {
                let $video = $('video', $iframe.contents());
                $video.prop('playbackRate', 2);
                $video.on('ended', function(){
                    setTimeout(function() {
                        $('#next-button').click();
                    }, Math.random() * 4000);
                });
            });
        });
    }

    myfunc();
    $('#next-button').on('click', myfunc);

})();
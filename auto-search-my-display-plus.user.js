// ==UserScript==
// @name         Auto Search My Display Plus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  FastAPPホームで自動検索 + CRUD自動生成画面の絞り込み
// @author       Kosuke Tomita
// @match        http://fastapp.monokaku.scloud.scskinfo.jp/fastapp-web2020/xhtml/wm/WM20002S.xhtml
// @grant        none
// ==/UserScript==

// *****************************************************************************
// 社員番号（各自変更すること）
// *****************************************************************************
const employee_number = '99999';

(function() {

    //jQueryを$で使えるようにする
    var $ = window.jQuery;

    //検索ボックスの取得
    const $input = $('#f-detailData-globalFilter');

    //検索するための関数
    const search_employee_number_with_string = e => {
        $input.val(employee_number);
        if (e) {
            $input.val(employee_number + e.data.string);
        }
        $('#f-detailData-j_id_2s').click();
    }

    //button要素を生成する関数
    const create_button = (text, string) => $('<button>').html($('<span>').text(text).addClass('ui-button-text ui-c')).attr('type', 'button').addClass('ui-button ui-widget ui-corner-all ui-state-default ui-button-text-only').on('click', {string: string}, search_employee_number_with_string);

    //button要素の生成
    const $button_rd = create_button('一覧', 'RD');
    const $button_c = create_button('登録', 'C');
    const $button_u = create_button('変更', 'U');

    //button要素の追加
    $input.before($button_rd, $button_c, $button_u);

    //自動検索
    search_employee_number_with_string();

})();
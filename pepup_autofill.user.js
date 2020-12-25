// ==UserScript==
// @name         Pep Up わくわく自動入力
// @namespace    http://tampermonkey.net/
// @version      0.71
// @description  各項目カレンダーの未入力日付をクリックすると自動入力します。
// @author       Mai Kankawa/Takuma Okamoto
// @match        https://pepup.life/scsk_mileage_campaigns*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

// 2020/12/24 更新 by 梅﨑
// 37,41,45,52,58,61,64,67,70行目のクラスを修正

(function() {
    'use strict';

    // tampermonkeyで警告('$' is not defined)が出るのを回避する
    var $ = window.jQuery;

    // 睡眠時間
    var sleepTimeVal;

    // スクロール位置復元
    var pos = localStorage.getItem('key');
    $(window).scrollTop(pos);
    localStorage.clear();

    // スクロール位置保存
    var saveScroll = function saveScroll() {
        var scrollPos = $(window).scrollTop();
        localStorage.setItem('key',scrollPos);
    };

    // ターゲット取得
    var getTarget = function getTarget(targetStr) {
        return $("div.fsFtHt:contains("+targetStr+")");
    };

    var getCloseButton = function getCloseButton() {
        return $("button.eYNZaQ:contains('閉じる')");
    };

    // 未入力ボタンセレクタ
    var inputButton = 'button.jZAaAL';
    // 未入力日付ボタン取得
    var getTargetDays = function getTargetDays(target) {
        return $(target).next().find('button');
    };

    // 入力済みボタンクラスセレクタ
    var inputedDays = 'igPZr';

    // 入力済みボタンセレクタ
    var inputedButton = 'button.' + inputedDays;

    // 入力不可セレクタ
    var invalidDays = 'div.heyyra';

    // 歩数記録ボタンセレクタ
    var updateButton = "button.ePPkJD:contains('記録')";

    // 歩数閉じるボタンセレクタ
    var closeButton = "button.bAyugJ:contains('閉じる')";

    // インプット領域セレクタ
    var inputSelector = "input.iyYmrB";

    // チェックボックスラベルセレクタ
    var checkLabel = "label.kmktFr";

    var d = new $.Deferred();


    // ウォーキング
    var targetWalking = getTarget('ウォーキング').parent();
    targetWalking.append("<table id='table-walking'><tr><td>1日</td><td><input id='tamper-1' type='text'></td><td>2日</td><td><input id='tamper-2' type='text'></td></tr><tr><td>3日</td><td><input id='tamper-3' type='text'></td><td>4日</td><td><input id='tamper-4' type='text'></td></tr><tr><td>5日</td><td><input id='tamper-5' type='text'></td><td>6日</td><td><input id='tamper-6' type='text'></td></tr><tr><td>7日</td><td><input id='tamper-7' type='text'></td><td>8日</td><td><input id='tamper-8' type='text'></td></tr><tr><td>9日</td><td><input id='tamper-9' type='text'></td><td>10日</td><td><input id='tamper-10' type='text'></td></tr><tr><td>11日</td><td><input id='tamper-11' type='text'></td><td>12日</td><td><input id='tamper-12' type='text'></td></tr><tr><td>13日</td><td><input id='tamper-13' type='text'></td><td>14日</td><td><input id='tamper-14' type='text'></td></tr><tr><td>15日</td><td><input id='tamper-15' type='text'></td><td>16日</td><td><input id='tamper-16' type='text'></td></tr><tr><td>17日</td><td><input id='tamper-17' type='text'></td><td>18日</td><td><input id='tamper-18' type='text'></td></tr><tr><td>19日</td><td><input id='tamper-19' type='text'></td><td>20日</td><td><input id='tamper-20' type='text'></td></tr><tr><td>21日</td><td><input id='tamper-21' type='text'></td><td>22日</td><td><input id='tamper-22' type='text'></td></tr><tr><td>23日</td><td><input id='tamper-23' type='text'></td><td>24日</td><td><input id='tamper-24' type='text'></td></tr><tr><td>25日</td><td><input id='tamper-25' type='text'></td><td>26日</td><td><input id='tamper-26' type='text'></td></tr><tr><td>27日</td><td><input id='tamper-27' type='text'></td><td>28日</td><td><input id='tamper-28' type='text'></td></tr><tr><td>29日</td><td><input id='tamper-29' type='text'></td><td>30日</td><td><input id='tamper-30' type='text'></td></tr><tr><td>31日</td><td><input id='tamper-31' type='text'></td><td></td><td></td></tr></table>");
    $('#table-walking').css('margin', '5px');
    var td_props = {
    	'padding-right':'5px',
    	'padding-left':'5px',
    	'text-align': 'right'
    }
    $('#table-walking tr').each(function(index, element){
    	$(element).children('td:nth-child(2n+1)').css(td_props);
    })


    var walkingAuto = function walkingAuto() {
    var target = getTarget('ウォーキング');
    var targetDays = getTargetDays(target);

        targetDays.each(function(index, element){
            var warkingList = window.sessionStorage.getItem(['warkingList']);
            $(element).on('click', function() {
                // 入力済みであれば何もしない
             	if($(element).hasClass(inputedDays)) {
                    return;
                }

                // ボタン押下時のスクロール位置保存
                saveScroll();
                setTimeout(function(){
                    var targetDateSteps = window.sessionStorage.getItem(["walking-"+$(element).html()]) != ''
                    	? window.sessionStorage.getItem(["walking-"+$(element).html()])
                    	: $("#tamper-" + $(element).html()).val();
                    if(targetDateSteps){
                        $(inputSelector).val(targetDateSteps);
                        setTimeout(function(){
                            $(updateButton).click();
                        },1000);
                    } else {
                    	var walkingAutoFlg = window.sessionStorage.getItem(["walkingAutoFlg"]);
        				if(walkingAutoFlg == "1"){
	                        window.sessionStorage.setItem(["walkingAutoFlg"],["0"]);
	                        $(closeButton).click();
	                    }
                    }
                },1000);
                d.resolve();
            });
        })
    };

    // 睡眠時間
    var sleepTimeAuto = function () {
        var target = getTarget('睡眠').eq(0);
        var targetDays = getTargetDays(target);

        targetDays.each(function(index, element){
            $(element).on('click', function() {
            	if($(element).hasClass(inputedDays)) {
                    return;
                }

                // ボタン押下時のスクロール位置保存
                saveScroll();
                setTimeout(function(){
                    // テキストもしくはローカルストレージから睡眠時間を取得する
                    var sleepTime = $("#sleepTime").val();
                    localStorage.setItem('sleepTime', sleepTime);
                    sleepTimeVal = sleepTime;
                    if(sleepTime) {
                        localStorage.setItem('sleepTime', sleepTime);
                        sleepTimeVal = sleepTime;
                    } else {
                        sleepTimeVal = localStorage.getItem('sleepTime');
                    }
                    $(inputSelector).val(sleepTimeVal);
                    setTimeout(function(){
                        $(updateButton).click();
                    },1000);
                },1000);
                d.resolve();
            });
        })
    };


    // 睡眠習慣
    var sleepAuto = function () {
        var target = getTarget('睡眠').eq(1);
        var targetDays = getTargetDays(target);

        autoCheckInput(targetDays);
    };

    // アルコール
    var alAuto = function () {
        var target = getTarget('アルコール');
        var targetDays = getTargetDays(target);

        autoCheckInput(targetDays);
    };

    // 食生活
    var eatAuto = function () {
        var target = getTarget('食生活');
        var targetDays = getTargetDays(target);

        autoCheckInput(targetDays);
    };

    // 就寝２時間前の食事制限
    var plusAuto = function () {
        var target = getTarget('就寝２時間前の食事制限');
        var targetDays = getTargetDays(target);

        autoCheckInput(targetDays);
    };

    // 口腔ケア
    var koukuuAuto = function () {
        var target = getTarget('口腔ケア');
        var targetDays = getTargetDays(target);

        autoCheckInput(targetDays);
    };
    
    // プラス10
    var plus10Auto = function () {
        var target = getTarget('プラス10');
        var targetDays = getTargetDays(target);

        autoCheckInput(targetDays);
    };

    // チェックボックス自動入力
    var autoCheckInput = function(targetDays) {
        targetDays.each(function(index, element){
            $(element).on('click', function() {
                if($(element).hasClass(inputedDays)) {
                    return;
                }
                // ボタン押下時のスクロール位置保存
                saveScroll();
                setTimeout(function(){
                    $(checkLabel).each(function(index, element){
                        if(!$(element).children('input').prop('checked')) {
                            $(element).click();
                        }
                    })
                    getCloseButton().click();
                },1000);
                d.resolve();
            });
        })
    };

    // ボタン処理
    $(window).on('load',function(){
    	// 入力できないボタンの色変更
        $(invalidDays).css("background-color","gray");

        /**
        * ウォーキング
        */
        var targetWalkingStep = getTarget('ウォーキング');
        // onload時にセッションの値に応じてウォーキングをクリックしに行く
        var walkingAutoFlg = window.sessionStorage.getItem(["walkingAutoFlg"]);
        if(walkingAutoFlg == "1"){
            var targetList = targetWalkingStep.parent().find(inputButton);
            targetList.each(function(index, element){
                 if(index == 0){
                     window.sessionStorage.setItem(["walkingAutoFlg"],["1"]);
                     $(element).click();
                 } else {
                 }
             });
            if(targetList.size == 0){
                 window.sessionStorage.setItem(["walkingAutoFlg"],["0"]);
            }
        }

        // 入力済み歩数テキストをDisabledに変更する
        var inputedButtonList = targetWalkingStep.parent().find(inputedButton);
        inputedButtonList.each(function(index, element){
        	$("#tamper-" + $(element).html()).prop('disabled', true);
        });
        
        // 入力不可日の歩数テキストをDisabledに変更する
        var invalidDaysList = targetWalkingStep.parent().find(invalidDays);
        invalidDaysList.each(function(index, element){
            $("#tamper-" + $(element).html()).prop('disabled', true);
        });

        var btnWalkingStep = $("<input type='button' value='ウォーキング一括登録（下のテキストに入力された歩数を登録します）'>");
        btnWalkingStep.css("color","red");
        targetWalkingStep.append(btnWalkingStep);

        targetWalkingStep.click(function() {
            // 歩数入力がない場合は対象外
            var stepConter = 0;
            $("[id^=tamper-]").each(function(index, element){
                $("#tamper-" + index).val();
                window.sessionStorage.setItem(["walking-"+index],[$("#tamper-" + (index)).val()]);
                if($("#tamper-" + (index)).val()){
                    stepConter++;
                }
            });
            if(stepConter == 0){
                alert("歩数を入力してください");
            } else {
                var targetList = targetWalkingStep.parent().find(inputButton);
                targetList.each(function(index, element){
                    if(index == 0){
                        window.sessionStorage.setItem(["walkingAutoFlg"],["1"])
                        $(element).click();
                    } else {
                    }
                });
            }
        })


        /**
        * 共通クリック処理
        */
        function targetClick(target) {
            if(confirm('すべて成功で入力します。すべて成功しましたか？')){
                var targetList = target.parent().find(inputButton);
                targetList.each(function(index, element){
                    if(index == 0){
                        $(element).click();
                    } else {
                        d.promise().then(function(){
                            $(element).click();
                            d = $.Deferred();
                        });
                    }
                });
            }
        }

        /**
        * 睡眠時間
        */
        var targetSleepTime = getTarget('睡眠').eq(0);
        var btnSleepTime = $("<input type='button' value='睡眠時間一括登録（下のテキストに入力された時間を登録します）'>");
        var inputSleepTime = $("<table id='table-sleep-time'><tr><td><input id=\"sleepTime\" /></td><td>時間</td></tr></table>");
        btnSleepTime.css("color","red");
        btnSleepTime.on("click", function(){targetClick(targetSleepTime)});
        targetSleepTime.append(btnSleepTime);
        targetSleepTime.parent().append(inputSleepTime);
        $('#table-sleep-time').css('margin', '5px');
	    var td_props = {
	    	'padding-right':'5px',
	    	'padding-left':'5px'
	    }
	    $('#table-sleep-time tr').each(function(index, element){
	    	$(element).children('td:nth-child(2n)').css(td_props);
	    })

        /**
        * 睡眠
        */
        var targetSleep = getTarget('睡眠').eq(1);
        var btnSleep = $("<input type='button' value='睡眠一括登録'>");
        btnSleep.css("color","red");
        btnSleep.on("click", function(){targetClick(targetSleep)});
        targetSleep.append(btnSleep);

        /**
        * アルコール
        */
        var targetAlc = getTarget('アルコール')
        var btnAlc = $("<input type='button' value='アルコール一括登録'>");
        btnAlc.css("color","red");
        btnAlc.on("click", function(){targetClick(targetAlc)});
        targetAlc.append(btnAlc);

        /**
        * 食生活
        */
        var targetShoku = getTarget('食生活')
        var btnShoku = $("<input type='button' value='食生活一括登録'>");
        btnShoku.css("color","red");
        btnShoku.on("click", function(){targetClick(targetShoku)});
        targetShoku.append(btnShoku);

        /**
        * 就寝２時間前の食事制限
        */
        var targetPlus = getTarget('就寝２時間前の食事制限')
        var btnPlus = $("<input type='button' value='就寝２時間前の食事制限'>");
        btnPlus.css("color","red");
        btnPlus.on("click", function(){targetClick(targetPlus)});
        targetPlus.append(btnPlus);


        /**
        * 口腔ケア
        */
        var targetKoukuu = getTarget('口腔ケア')
        var btnKoukuu = $("<input type='button' value='口腔ケア一括登録'>");
        btnKoukuu.css("color","red");
        btnKoukuu.on("click", function(){targetClick(targetKoukuu)});
        targetKoukuu.append(btnKoukuu);
        
        /**
        * プラス10
        */
        var targetPlus10 = getTarget('プラス10')
        var btnPlus10 = $("<input type='button' value='プラス10一括登録'>");
        btnPlus10.css("color","red");
        btnPlus10.on("click", function(){targetClick(targetPlus10)});
        targetPlus10.append(btnPlus10);
    });

    walkingAuto();
    sleepTimeAuto();
    sleepAuto();
    alAuto();
    eatAuto();
    plusAuto();
    koukuuAuto();
    plus10Auto();


})();
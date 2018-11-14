// ==UserScript==
// @name PebblePad-All-Scripts
// @description Insert tutee name in to title of form.
// @author Alex Robinson
// @namespace uobchemeng.github.io/CustomisePebblePad.html
// @match https://atlas.pebblepad.co.uk/atlas/bham/Viewer/Submission/ViewV5/*
// @grant none
// @version 0.1
// ==/UserScript==

//Copy the tutee name to the CustomisePebblePad
$(".title-text").append("<br>"+$('.asset_footer_text > p').html().split("<br")[0].split(' on ')[0].split(' by ')[1])

//Move the Assessor Assets to the side bar
$("#Form_AssetViewer").clone().attr('id', 'id1').appendTo("#atlas-sidebar")
$("#id1").children().children().hide()
$("#id1 .element-assessor-label-v5").parent().parent().css("display", "")
$("#id1 :input[type=submit]").css({"display": "","width":"100px","padding":"10px","background":"#06a5d1","border":"1px solid #06a5d1", "color":"white"})

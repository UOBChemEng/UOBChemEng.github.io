// ==UserScript==
// @name PebblePad-Name
// @description Insert tutee name in to title of form.
// @author Alex Robinson
// @namespace uobchemeng.github.io/CustomisePebblePad.html
// @match https://atlas.pebblepad.co.uk/atlas/bham/Viewer/Submission/ViewV5/*
// @grant none
// @version 0.1
// ==/UserScript==
$(".title-text").append("<br>"+$('.asset_footer_text > p').html().split("<br")[0].split(' on ')[0].split(' by ')[1])

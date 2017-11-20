//Make a vertical array of tabs
function openVtab(evt, vtabName) 
	{
    var i, vtabcontent, vtablinks;
    vtabcontent = document.getElementsByClassName("vtabcontent");
    for (i = 0; i < vtabcontent.length; i++) 
    	{
        vtabcontent[i].style.display = "none";
    	}
    vtablinks = document.getElementsByClassName("vtablinks");
    for (i = 0; i < vtablinks.length; i++) 
    	{
        vtablinks[i].className = vtablinks[i].className.replace(" active", "");
    	}
    document.getElementById(vtabName).style.display = "block";
    evt.currentTarget.className += " active";
	}

//Remove tags from User input and data stores
function sanitize(html) 
	{
	var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
	var tagOrComment = new RegExp(
		'<(?:'
		// Comment body.
		+ '!--(?:(?:-*[^->])*--+|-?)'
		// Special "raw text" elements whose content should be elided.
		+ '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
		+ '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
		// Regular name
		+ '|/?[a-z]'
		+ tagBody
		+ ')>',
		'gi');
	var oldHtml;
	do 
		{
		oldHtml = html;
		html = html.replace(tagOrComment, '');
		} while (html !== oldHtml);
  	return html.replace(/</g, '&lt;');
	}		
	
function getSpreadsheetUrl(sheetKey,sheetGID)
	{
	var details = {	
		Minutes_SSC_2017: {
						key: '1G8Sa9qhqZS0xuSD5hxYF3lRtz2tJc-Gv8GIqVzfa4p0',
						MasterSheet: '0',
						SortKeys: '1809433302'
						},
		SSC_Minutes: {
						key: '1HFLNETbkDNVPywAm_Q0CHMlShm9I0OT9N_D8FriSbDU',
						MasterSheet: '0',
						SortKeys: '1809433302'
						}
		};
	var ssUrl1 = "https://docs.google.com/spreadsheets/d/"
	var ssUrl2 = "/edit#gid=";
	return ssUrl1+details[sheetKey]['key']+ssUrl2+details[sheetKey][sheetGID];
	
	}
	
function buildSscPage()
	{
	sheetrock({	url: sortKeysheet,query: "select D where D is not null",fetchSize: 9,callback: makeSscVtabs});
	}


function makeSscVtabs (error,options,response)
	{
	if(error){
		makeSscButton('vtab1', 'Could Not Load Dates', 'Error', true);
		$('#ajax-loader-1').hide();
		console.log(error);
		return;}
	else{
		var dateObj={};
		dateObj['date']=[];
		dateObj['dateID']=[];
		dateObj['keyVal']={};
  		var newtabcode1 = '<h3 style="text-align:center;">Staff Student Committee Minutes '
  		var newtabcode2 = '</h3>';
        var loadercode1 = '<div id="ajax-loader-';
  		var loadercode2 = '"><img src="img/UOBChemEng-loading.gif" class="ajax-loader"/></div>';
		for (var i =0; i < response.rows.length; i++){
			var txt1 = sanitize(response.rows[i].cellsArray[0]);
			var txt2 = 'd'+txt1.replace(/\//g, '');
			dateObj['date'].push(txt1);
			dateObj['dateID'].push(txt2);
			dateObj['keyVal'][txt2] = txt1;
			makeSscButton('vtab1', txt1, txt2)
			$('#defaultOpenvtabcontent').after('<div id="'+txt2+'" class="vtabcontent" style="display:none;">'
				+newtabcode1+txt1+newtabcode2
			    +loadercode1+txt2+loadercode2+'</div>');
			}
		$('#ajax-loader-1').hide();

		var parentElementID = document.getElementById('defaultOpenvtabcontent')
		var readyparatxt = document.createTextNode(String('Use tabs to select Staff Student Committee Minutes by date'));
		var readypara = document.createElement('p');
    	readypara.appendChild(readyparatxt);
    	readypara.setAttribute('style', 'text-align:center; font-weight:bold;');
		parentElementID.appendChild(readypara);

		makemenuwrap('vtabwrap', 'menuwrap-v', 'menuwrap-v');
		makeFilterBtn('menuwrap-v','Filter','Filter','menuwrap-button', 'menuwrap-filter-');
		makePrintBtn('menuwrap-v','Print','print','menuwrap-button');
		if(menuRequired ==false){$('#menuwrap-v').hide();}
		if(printRequired == false){$('#button-print').hide();}
		if(filterRequired == false){$('#button-Filter').hide();}

		sheetrock({	url: sortKeysheet, query: "select E,F where E is not null", callback: getSscLevels, params: dateObj});
        }
	}


function makePrintBtn(divID, ptxt1, ptxt2, ptxt3){
	var pmenudiv = document.getElementById(divID);
	var ptxtObj = document.createTextNode(String(ptxt1));
	var pbtn = document.createElement('button');
	pbtn.appendChild(ptxtObj);
	pbtn.setAttribute('type', 'button');
	pbtn.setAttribute('onclick', 'printElement("Unset","Print Minutes","currentvtab")');
	pbtn.setAttribute('id', 'button-' + ptxt2);
	pbtn.setAttribute('class', ptxt3);
	pmenudiv.appendChild(pbtn);
}


function makeFilterBtn(divID, ftxt1, ftxt2, ftxt3, ftxt4){
	var fmenudiv = document.getElementById(divID);
	var filterwrapdiv = document.createElement('div');
	var filtercontentdiv = document.createElement('div');
	filterwrapdiv.setAttribute('id', 'content-' + ftxt2 + '-wrap');
	filterwrapdiv.setAttribute('class', ftxt4 + 'wrap');
	filterwrapdiv.setAttribute('style', 'display:none');
	var ftxtObj = document.createTextNode(String("No Filters Loaded"));
	filtercontentdiv.appendChild(ftxtObj);
	filtercontentdiv.setAttribute('id', 'content-' + ftxt2 + '-content');
	filtercontentdiv.setAttribute('class', ftxt4 + 'content');
	filterwrapdiv.appendChild(filtercontentdiv);
	fmenudiv.appendChild(filterwrapdiv);
	var ftxtObj = document.createTextNode(String(ftxt1));
	var fbtn = document.createElement('button');
	fbtn.appendChild(ftxtObj);
	fbtn.setAttribute('type', 'button');
	fbtn.setAttribute('onclick', 'showFilterMenu("content-' + ftxt2 + '-wrap")');
	fbtn.setAttribute('id', 'button-' + ftxt2);
	fbtn.setAttribute('class', ftxt3);
	fmenudiv.appendChild(fbtn);
}


function showFilterMenu(filterID){
	var filterwrap = document.getElementById(filterID);
	var filterwrapstatus = filterwrap.style.display;
	if(filterwrapstatus == 'none'){
		filterwrap.setAttribute('style', 'display:block');
	}else{
		filterwrap.setAttribute('style', 'display:none');
	}
}


function makemenuwrap(divID,menuID,menuClass){
 	var menudiv = document.getElementById(divID);
   	var menuwrap = document.createElement('div');
	menuwrap.setAttribute('id', menuClass);
	menuwrap.setAttribute('class', menuClass);
	menudiv.appendChild(menuwrap);
}


function getSscLevels (error,options,response){
	if(error){
		var dateObj=options.user.params;
		for (var i =0; i < dateObj['date'].length; i++){
			makeSscPara(dateObj['dateID'][i], 'Could Not Load Levels', 'Error','text-align:center;font-weight: bold;');
			$('#ajax-loader-'+dateObj['dateID'][i]).hide();
			}
		console.log(error);
		return;
		}
	else{
		var dateObj=options.user.params;
		var levelsResponseObj = response.rows;
		sheetrock({	url: sortKeysheet, query: "select A where A is not null", callback: getSscLevelModule,
					params1: dateObj, params2: levelsResponseObj});
	    }
	}



function getSscLevelModule (error,options,response){
	if(error){
		var dateObj=options.user.params1;
		var levelsResponseObj=options.user.params2;
		for (var i =0; i < dateObj['date'].length; i++){
			makeSscPara(dateObj['dateID'][i], 'Could Not Load Keys', 'Error','text-align:center;font-weight: bold;');
			$('#ajax-loader-'+dateObj['dateID'][i]).hide();
			}
		console.log(error);
		return;
		}
	else{
		var dateObj=options.user.params1;
		var levelsResponseObj=options.user.params2;
		var levelModuleResponseObj = response.rows;
		for (var i =0; i < dateObj['date'].length; i++){
			var lMO = freshSsclevelsModulesObj(levelModuleResponseObj);
			var dateArr = dateObj['date'][i].split("/");
			var formattedDate = dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0];
			var srockQuery="select * where A = date'"+formattedDate+"'";
			sheetrock({	url: MasterSheet, query: srockQuery, callback: buildSscMinutes,
						params1: dateObj['date'][i],
						params2: dateObj['dateID'][i],
						params3: lMO,
						params4: levelsResponseObj
						});
            }
	    makefiltermenu(levelsResponseObj);
		if(selectFirstTab){document.getElementById('vtab1').children[0].click();}
    	}
	}


function buildSscMinutes (error,options,response){
	var errorlog='';

	if(error){
		var dateID=options.user.param2;
		makeSscPara(dateID, 'Could Not Load Minutes', 'Error','text-align:center;font-weight: bold;');
		$('#ajax-loader-'+dateID).hide();
		console.log(error);
		return;
		}
	else{
		var mydate=options.user.params1;
		var dateID=options.user.params2;
		var levelModuleObj=options.user.params3;
		var mylevelsObj = {};
		mylevelsObj['lkey']=[];
		mylevelsObj['lname']=[];
		var sheetData = response.rows;
		for (var i = 1; i < sheetData.length; i++){
			levModArr = sheetData[i].cellsArray[1].split("-");
			if(!levModArr[0]){levModArr[0]='Unsorted';}
			if(!levModArr[1]){levModArr[1]='Unsorted';}
			if(!levelModuleObj[levModArr[0]]){levModArr[0]='Unsorted';}
			if(!levelModuleObj[levModArr[0]][levModArr[1]]){levModArr[1]='Unsorted';}
			if(levModArr[0]&&levModArr[1]){
				levelModuleObj[levModArr[0]][levModArr[1]].push(sheetData[i].cellsArray);
				}
			}
		for (var i = 0; i < options.user.params4.length; i++){
			mylevelsObj['lkey'].push(options.user.params4[i].cellsArray[0]);
			if(!options.user.params4[i].cellsArray[1]){
				mylevelsObj['lname'].push(options.user.params4[i].cellsArray[0]);
				}else{
				mylevelsObj['lname'].push(options.user.params4[i].cellsArray[1]);
				}
			}
		mylevelsObj['lkey'].push('Unsorted');
		mylevelsObj['lname'].push('Unsorted');
		var myModules = {};
		for (var i = 0; i < mylevelsObj['lkey'].length; i++){
			var resolvedCtr4=0;
			var levelname = mylevelsObj['lname'][i];
			var myModules = levelModuleObj[mylevelsObj['lkey'][i]];
			var levelCtr=0;
			for(key in myModules){if(myModules[key].length>0){levelCtr++;}}
			if(levelCtr > 0){
				makeSscPara(dateID, levelname, levelname,'text-align:left;font-weight: bold;');
			}
			for(key in myModules){
				if(myModules[key].length>0){
					var resolvedCtr2=0;
					var resolvedCtr3=0;
					makeSscPara(dateID, key, levelname,'text-align:left;font-weight: bold;text-indent:20px;');
					for(var j = 0; j < myModules[key].length; j++){
						var issueCtr=0;
						var tabRowCtr=0;
						var resolvedCtr=0;
						var parentElementID = document.getElementById(dateID);
  	 					var tableObj = document.createElement('table');
			 			var tabID = 't-' + sanitize(myModules[key][j][7]);
			 			tableObj.setAttribute('id', tabID.replace(/ /g,"_"));
						tableObj.setAttribute('style', 'padding-left:50px;empty-cells: show;');
						tableObj.setAttribute('class', sanitize(levelname.replace(/ /g,"_")));
						parentElementID.appendChild(tableObj);
						if(myModules[key][j][2]){
							makeSscTableRow(dateID, 'Issue: ', 'font-style: italic; vertical-align: top;', myModules[key][j][2], myModules[key][j][7]+'issue',
						    'text-align:left; vertical-align: top;',tabID);
						}
						if(myModules[key][j][3]){
							makeSscTableRow(dateID, 'Response: ', 'font-style: italic; vertical-align: top;', myModules[key][j][3], myModules[key][j][7]+'response',
						    'text-align:left; vertical-align: top;',tabID);
							tabRowCtr++;
						}
						if(myModules[key][j][4]){
							makeSscTableRow(dateID, 'Followup by: ', 'font-style: italic; vertical-align: top;', myModules[key][j][4], myModules[key][j][7]+'followupby',
						    'text-align:left; vertical-align: top;', tabID);
							tabRowCtr++;
						}
						if(myModules[key][j][5]){
							makeSscTableRow(dateID, 'Followup Action: ', 'font-style: italic; vertical-align: top;width:120px;', myModules[key][j][5], myModules[key][j][7]+'followupaction',
						    'text-align:left; vertical-align: top;','t-' + myModules[key][j][7]);
							tabRowCtr++;
						}
						if(myModules[key][j][6]){
							if(tabRowCtr == 1||myModules[key][j][6] != 'Resolved'){
								makeSscTableRow(dateID, 'Status: ', 'font-style: italic; vertical-align: top;', myModules[key][j][6], myModules[key][j][7]+'status','text-align:left; vertical-align: top;',tabID);
							}
							if(myModules[key][j][6] == 'Resolved'){
								$(tableObj).addClass('Resolved');
								resolvedCtr++;resolvedCtr3++;
							}
						}
						var jtest = myModules[key].length;
						var jj=j+1;
						if(jj<jtest){
							if(myModules[key][jj][2]){issueCtr=1;}
						}
						if(jj < jtest){
							if(issueCtr > 0 && tabRowCtr > 0){
								var para = document.createElement('p');
								para.innerHTML += '&nbsp;';
								para.setAttribute('class', levelname.replace(/ /g,"_"));
								if(resolvedCtr > 0){
									$(para).addClass('Resolved');
								}else{resolvedCtr2=1;}
								parentElementID.appendChild(para);parentElementID.appendChild(para);
							}
						}
					}
					var moduleParaID = 'p-' + levelname.replace(/ /g,"_")+"-"+key.replace(/ /g,"_")+'-'+dateID.replace(/ /g,"_");
					var para = document.createElement('p');
					para.innerHTML += '&nbsp;';
					para.setAttribute('id', moduleParaID+"-lastpara");
					para.setAttribute('class', levelname.replace(/ /g,"_")+" last");
					if(resolvedCtr2 == 1 && resolvedCtr3 > 0){
						$(para).addClass('Resolved');
					}
					parentElementID.appendChild(para);parentElementID.appendChild(para);
					if(resolvedCtr3 == jtest){
						$('#'+moduleParaID).addClass('Resolved');
						$('#'+moduleParaID+"-lastpara").addClass('Resolved');
						resolvedCtr4++;
					}
				}
			}
			var levelParaID = 'p-' + levelname.replace(/ /g,"_")+"-"+levelname.replace(/ /g,"_")+'-'+dateID.replace(/ /g,"_");
			if(resolvedCtr4 == levelCtr){
				$('#'+levelParaID).addClass('Resolved');
			}
		}
		$('#ajax-loader-'+dateID).hide();
	}
	if(filterDefault){filterOnLoad(filterDefault);}
	if(resolvedDefault){hideResolved()};
}


function makefiltermenu(myfiltlevelObj){
	var filterlevelObj = {};
	filterlevelObj['lkey']=[];
	filterlevelObj['lname']=[];
	for (var i = 0; i < myfiltlevelObj.length; i++){
		filterlevelObj['lkey'].push(myfiltlevelObj[i].cellsArray[0]);
		if(!myfiltlevelObj[i].cellsArray[1]){
			filterlevelObj['lname'].push(myfiltlevelObj[i].cellsArray[0]);
			}else{
			filterlevelObj['lname'].push(myfiltlevelObj[i].cellsArray[1]);
			}
		}
	filterlevelObj['lkey'].push('Unsorted');
	filterlevelObj['lname'].push('Unsorted');
	var ulmenu = document.createElement('ul');
	ulmenu.setAttribute('id', "filterdropdown");
	var liMenu = document.createElement('li');
	var liTxtObj = document.createTextNode(String('Hide All'));
	liMenu.appendChild(liTxtObj);
	liMenu.setAttribute('id', 'fdd-viscontrol');
	liMenu.setAttribute('class', 'Hide');
	liMenu.setAttribute('onclick', 'filterVisAll()');
    ulmenu.appendChild(liMenu);
	for (var i = 0; i < filterlevelObj['lkey'].length; i++){
		var filtlevelname = filterlevelObj['lname'][i];
		var filtlevelclassname = filtlevelname.replace(/ /g,"_");
		if(filtlevelname == "Foundation Year"){filtlevelname = "FY";}
		if(filtlevelname == "Main Library"){filtlevelname = "Library";}
		var liMenu = document.createElement('li');
		var liTxtObj = document.createTextNode(String(filtlevelname));
		liMenu.appendChild(liTxtObj);
		liMenu.setAttribute('onclick', 'filterVis("'+filtlevelclassname+'")');
		liMenu.setAttribute('id', 'fdd-'+filtlevelclassname);
		liMenu.setAttribute('class', 'vis')
		ulmenu.appendChild(liMenu);
		}
	var liMenu = document.createElement('li');
	var liTxtObj = document.createTextNode(String('Hide Resolved'));
	liMenu.appendChild(liTxtObj);
	liMenu.setAttribute('id', 'fdd-rslviscontrol');
	liMenu.setAttribute('class', 'Hide');
	liMenu.setAttribute('onclick', 'rslfilterVisAll()');
	ulmenu.appendChild(liMenu);
	var filtercontentdiv = document.getElementById('content-Filter-content');
	filtercontentdiv.innerHTML = '';
	filtercontentdiv.appendChild(ulmenu);
}

function filterVis(filterClassvis){
	if($('#fdd-'+filterClassvis).hasClass('vis')){
		$('#fdd-'+filterClassvis).removeClass('vis');
		$('.'+filterClassvis).hide();
	}else{
		$('#fdd-'+filterClassvis).addClass('vis');
		$('.'+filterClassvis).show();
	}
}

function filterVisAll(){
	if($('#fdd-viscontrol').hasClass('Hide')){
		$('#fdd-viscontrol').removeClass('Hide');
		$('#fdd-viscontrol').addClass('Show');
		$('#fdd-viscontrol').text('Show All');
		$('#fdd-viscontrol').siblings().removeClass('vis')
		var s = $('#fdd-viscontrol').siblings()
		s.each(function(){
			var ids = this.id.split("-")[1];
			$('.'+ids).hide();
		});
	}else{
		$('#fdd-viscontrol').removeClass('Show');
		$('#fdd-viscontrol').addClass('Hide');
		$('#fdd-viscontrol').text('Hide All');
		$('#fdd-viscontrol').siblings().addClass('vis')
		var s = $('#fdd-viscontrol').siblings()
		s.each(function(){
			var ids = this.id.split("-")[1];
			$('.'+ids).show();
		});
		if(resolvedDefault){hideResolved()};
	}
}

function filterOnLoad(idToShow){
	$('#fdd-viscontrol').removeClass('Hide');
	$('#fdd-viscontrol').addClass('Show');
	$('#fdd-viscontrol').text('Show All');
	$('#fdd-'+idToShow).siblings().removeClass('vis')
	var s = $('#fdd-'+idToShow).siblings()
	s.each(function(){
		var ids = this.id.split("-")[1];
		$('.'+ids).hide();
	});
	//console.log(resolvedDefault);
}

function hideResolved(){
	$('#fdd-rslviscontrol').removeClass('Hide');
	$('#fdd-rslviscontrol').addClass('Show');
	$('#fdd-rslviscontrol').text('Show Resolved');
	$('table.Resolved').hide();
	$('p.Resolved').hide();

}
function showResolved(){
	$('#fdd-rslviscontrol').removeClass('Show');
	$('#fdd-rslviscontrol').addClass('Hide');
	$('#fdd-rslviscontrol').text('Hide Resolved');
	$('table.Resolved').show();
	$('p.Resolved').show();
}

function rslfilterVisAll(){
	if($('#fdd-rslviscontrol').hasClass('Hide')){
		hideResolved();
	}else{
		showResolved();
	}
}


function makeSscTableRow(parentID, tdtitle, tdtitlestyle, tdContents, tdID, style, mytabID){
	tdContents = sanitize(tdContents);
	tdID = sanitize(tdID);
	if(tdtitle == 'Issue: '){
		var txtObj = document.createTextNode(String(tdContents));
		var maintd = document.createElement('td');
		maintd.appendChild(txtObj);
		maintd.setAttribute('style', style);
		maintd.setAttribute("colspan", 2);
		var tablerow = document.createElement('tr');
 		tablerow.appendChild(maintd);
		var parentElementID = document.getElementById(mytabID);
		parentElementID.appendChild(tablerow);
	}else{
		var titleObj =document.createTextNode(String(tdtitle));
		var titletd = document.createElement('td');
		titletd.appendChild(titleObj);
		titletd.setAttribute('style', tdtitlestyle+' width: 9rem; padding-left: 25px');
		var txtObj = document.createTextNode(String(tdContents));
		var maintd = document.createElement('td');
		maintd.appendChild(txtObj);
		maintd.setAttribute('style', style);
		var tablerow = document.createElement('tr');
		tablerow.appendChild(titletd);
		tablerow.appendChild(maintd);
		var parentElementID = document.getElementById(mytabID);
 		parentElementID.appendChild(tablerow);
	}
}


function freshSsclevelsModulesObj(lMRespObj){
	var lMObj = {};
	for (var i =0; i < lMRespObj.length; i++){
		var txt1 = sanitize(lMRespObj[i].cellsArray[0]);
		var txtArr = txt1.split("-");
		if(lMObj[txtArr[0]]){
			if(txtArr[0]&&txtArr[1]){lMObj[txtArr[0]][txtArr[1]]=[];}
			}else{
			lMObj[txtArr[0]] = {};
			lMObj[txtArr[0]]['Unsorted']=[];
			if(txtArr[0]&&txtArr[1]){lMObj[txtArr[0]][txtArr[1]]=[];}
		}
	}
	lMObj['Unsorted']={};
	lMObj['Unsorted']['Unsorted']=[];
	return lMObj;
}


function makeSscButton(divID, txt1, txt2, btnerr){
 			var menudiv = document.getElementById(divID);
 			var txtObj = document.createTextNode(String(txt1));
   			var btn = document.createElement('button');
    		btn.appendChild(txtObj);
    		btn.setAttribute('type', 'button');
        	if(!btnerr){btn.setAttribute('onclick', 'openVtab(event, "'+txt2+'")');}
			btn.setAttribute('id', 'button-' + txt2);
			btn.setAttribute('class', 'vtablinks');
			menudiv.appendChild(btn);
}


function makeSscPara(parentID, paraContents, paraID, style){
			parentID = sanitize(parentID);
			paraContents = sanitize(paraContents);
			paraID = sanitize(paraID);
 			var parentElementID = document.getElementById(parentID);
 			var txtObj = document.createTextNode(String(paraContents));
   			var para = document.createElement('p');
    		para.appendChild(txtObj);
    		para.setAttribute('style', style);
 			para.setAttribute('id', 'p-' + paraID.replace(/ /g,"_")+"-"+paraContents.replace(/ /g,"_")+'-'+parentID.replace(/ /g,"_"));
			para.setAttribute('class', paraID.replace(/ /g,"_"));
			parentElementID.appendChild(para);
}

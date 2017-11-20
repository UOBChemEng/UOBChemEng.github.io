function buildSscPage()
	{
	sheetrock({	url: sortKeysheet,query: "select D where D is not null",fetchSize: 9,callback: makeSscVtabs},);
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
		var readyparatxt = document.createTextNode(String('Please Select Staff Student Committee Minutes by date using the tabs'));
		var readypara = document.createElement('p');
    	readypara.appendChild(readyparatxt);
    	readypara.setAttribute('style', 'text-align:center; font-weight:bold;');
		parentElementID.appendChild(readypara);

		sheetrock({	url: sortKeysheet, query: "select E,F where E is not null", callback: getSscLevels, params: dateObj});
        }
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
	    }
	}	


function buildSscMinutes (error,options,response){
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
			var levelname = mylevelsObj['lname'][i];
			makeSscPara(dateID, levelname, levelname,'text-align:left;font-weight: bold;');
			var myModules = levelModuleObj[mylevelsObj['lkey'][i]];
			for(key in myModules){
				if(myModules[key].length>0){
					makeSscPara(dateID, key, levelname,'text-align:left;font-weight: bold;text-indent:20px;');
					for(var j = 0; j < myModules[key].length; j++){
	
						var parentElementID = document.getElementById(dateID);
  	 					var tableObj = document.createElement('table');
			 			var tabID = 't-' + myModules[key][j][7];
			 			tableObj.setAttribute('id', tabID.replace(/ /g,"_"));
						tableObj.setAttribute('style', 'padding-left:50px;empty-cells: show;');
						tableObj.setAttribute('class', levelname.replace(/ /g,"_"));
						parentElementID.appendChild(tableObj);
						makeSscTd(dateID, 'Issue: ', 'font-style: italic; vertical-align: top;', myModules[key][j][2], myModules[key][j][7]+'issue',
						    'text-align:left; vertical-align: top;',tabID);
						makeSscTd(dateID, 'Response: ', 'font-style: italic; vertical-align: top;', myModules[key][j][3], myModules[key][j][7]+'response',
						    'text-align:left; vertical-align: top;',tabID);
						makeSscTd(dateID, 'Followup by: ', 'font-style: italic; vertical-align: top;', myModules[key][j][4], myModules[key][j][7]+'followupby',
						    'text-align:left; vertical-align: top;', tabID);
						makeSscTd(dateID, 'Followup Action: ', 'font-style: italic; vertical-align: top;width:120px;', myModules[key][j][5], myModules[key][j][7]+'followupaction',
						    'text-align:left; vertical-align: top;','t-' + myModules[key][j][7]);
						makeSscTd(dateID, 'Status: ', 'font-style: italic; vertical-align: top;', myModules[key][j][6], myModules[key][j][7]+'status',
						    'text-align:left; vertical-align: top;',tabID);
   						var nbsp = document.createTextNode(String('&nbsp;'));
						var para = document.createElement('p');
						para.innerHTML += '&nbsp;';
						para.setAttribute('class', levelname.replace(/ /g,"_"));
    					parentElementID.appendChild(para);parentElementID.appendChild(para);
						}
					
					}
				}

		}
		$('#ajax-loader-'+dateID).hide();	 
	}
}


function makeSscTd(parentID, tdtitle, tdtitlestyle, tdContents, tdID, style, mytabID){
 			var titleObj =document.createTextNode(String(tdtitle));
 			var titletd = document.createElement('td');
     		titletd.appendChild(titleObj);
    		titletd.setAttribute('style', tdtitlestyle);			
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
 			var parentElementID = document.getElementById(parentID);
 			var txtObj = document.createTextNode(String(paraContents));
   			var para = document.createElement('p');
    		para.appendChild(txtObj);
    		para.setAttribute('style', style);
 			para.setAttribute('id', 'p-' + paraID.replace(/ /g,"_")+"-"+paraContents.replace(/ /g,"_"));
			para.setAttribute('class', paraID.replace(/ /g,"_"));
			parentElementID.appendChild(para);
}

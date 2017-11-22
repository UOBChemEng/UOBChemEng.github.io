function buildSscPage()
	{
	var datesObj={};
	var levelsObj={};
	var modulesObj={};
	var dataObj={};
	sheetrock({	url: sortKeysheet,query: "select A where A is not null",callback: makeSscVtabs});
	}
	

function makeSscVtabs (error,options,response)
	{
	if(error){return error;}
	else{
 		datesObj=response.rows;
 		document.getElementById("vtabprogress").textContent += ".";
  		var div = document.getElementById('vtab1');
		for (var i =1; i < response.rows.length; i++){
			var txt1 = sanitize(response.rows[i].cellsArray[0]);
			var txt2 = 'd'+txt1.replace(/\//g, '');
			var txtObj = document.createTextNode(String(txt1));
    		var btn = document.createElement('button');
    		btn.appendChild(txtObj);
    		btn.setAttribute('type', 'button');
        	btn.setAttribute('onclick', 'openVtab(event, "'+txt2+'")');
			btn.setAttribute('id', 'button' + i);
			btn.setAttribute('class', 'vtablinks');
			div.appendChild(btn);
			}
		sheetrock({	url: sortKeysheet,query: "select B where B is not null",callback: getLevels});
        }
	}

function getLevels (error,options,response){
	if(error){return error;}
	else{
 		document.getElementById("vtabprogress").textContent += ".";
		levelsObj=response.rows;
		sheetrock({	url: sortKeysheet,query: "select C where C is not null",callback: getModules});
		}
	}
	
function getModules (error,options,response){
	if(error){return error;}
	else{
		document.getElementById("vtabprogress").textContent += ".";
		modulesObj=response.rows;
		sheetrock({	url: MasterSheet,callback: mainDataLoad}); 
		}     	
}

function mainDataLoad (error,options,response){
	if(error){return error;}
	else{
		document.getElementById("vtabprogress").textContent += ".";
		dataObj=response.rows;
		reportResults();}         	
}


function appendMinutesDiv(data){
	
}

function reportResults(){
console.log(datesObj);
console.log(levelsObj);
console.log(modulesObj);
console.log(dataObj);
document.getElementById("vtabprogress").textContent = "Formatting Minutes.";
}
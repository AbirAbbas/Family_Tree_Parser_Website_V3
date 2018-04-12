// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {

    $('.slide-section').click(function(e) {
        var linkHref = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(linkHref).offset().top
        });
    });
    // On page-load AJAX Example
    
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/fileList',   //The server endpoint we are connecting to
        success: function (data) {
            /*  Do something with returned object
                Note that what we get is an object, not a string, 
                so we do not need to parse it on the server.
                JavaScript really does handle JSONs seamlessly
            */

			/* Sample Code
			var newRowContent = "<tr><td>Test</td></tr>";

			($("#indiList tbody")).append(newRowContent); 
			* */
            //We write the object to the console to show that the request was successful
            
            if (data['fileList'].length <= 0) {
				console.log('Empty List');
			}
            else {
				var counter = 0;
				for (var i = 0; i < data['fileList'].length; i++) {
					if (data['objList'][i].length == 0) {
						continue;
					} 
					var newRowContent = "<tr><td><a href=\"/uploads/"+ data['fileList'][i] +"\">"+ data['fileList'][i] +"</a></td><td>"+ data['objList'][i][0].source +"</td><td>"+ data['objList'][i][0].gedc +"</td><td>"+data['objList'][i][0].encoding+"</td><td>"+ data['objList'][i][0].submittername +"</td><td>"+ data['objList'][i][0].submitteraddress +"</td><td>"+data['objList'][i][0].indilength+"</td><td>"+data['objList'][i][0].famlength+"</td></tr>";
					var newDropContent = "<a class=\"dropdown-item\" onclick=\"myFunction(\'"+data['fileList'][i]+"\')\"  href=\"#gedcom\">" + data['fileList'][i] + "</a>";
					($("#indiList tbody")).append(newRowContent);
					($('#dropdownList')).append(newDropContent);
					counter++;
				}
				if (counter == 0) {
					var newDropContent = "<h4 class = \"noIndiPadding\">No valid files!</h4>";
					($("#indiList tbody")).append(newDropContent);
				}
			}		
			
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });

    // Event listener form replacement example, building a Single-Page-App, no redirects if possible
    $('#someform').submit(function(e){
        e.preventDefault();
        $.ajax({});
    });

    $('#footerCopy').text('copyrighted, ' );
    $('#footerCopy').append(' Abir Abbas,');
    $('#footerCopy').append('  2018 - ');
    $('#footerCopy').append(new Date().getFullYear());
    
    
    
    $(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();

		$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top
		}, 500);
	});

});

window.onscroll = function() {scrollFunction()};

function myFunction(fileName) {
	
	$.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/indiSingle', 
        data: { fileName: fileName },  //The server endpoint we are connecting to
        success: function (data) {
			($("#gpanelFile")).empty();
			($("#gpanelFile")).append(fileName);
			
			($('#descendantFile')).empty();
		($('#ancestorFile')).empty();
		($('#insertFile')).empty();
			
			($("#indiBody")).empty();
			($("#indiDesc")).empty();
			($("#indiAnces")).empty();
			for (var i = 0; i < data.length; i++) {
				if (data[i].length == 0) {
						continue;
				} 
				var newDropContent = "<tr><td>"+data[i].givenName+"</td><td>"+data[i].surname+"</td><td>"+data[i].sex+"</td><td>"+data[i].familysize+"</td></tr>";
				($("#indiBody")).append(newDropContent);
				
				var newDescContent = '<option value=\"'+ data[i].givenName + ' ' + data[i].surname +'\">'+ data[i].givenName + ' ' + data[i].surname +'</option>';
				($("#indiDesc")).append(newDescContent);
				($("#indiAnces")).append(newDescContent);
			}	
			
			if (data.length == 0) {
				var newDropContent = "<h4 class = \"noIndiPadding\">No individuals!</h4>";
				($("#indiBody")).append(newDropContent);
			}
			
			($(statusPanelText)).append('Sucessfully read all individuals from file +'+fileName+'!<br>');
			
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });
}

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

//var request = require(./app.js);

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
     $("html, body").animate({ scrollTop: 0 }, "slow");
}

function handleClick() {
	
	var givenname = document.getElementById('givenname').value;
	var surname = document.getElementById('surname').value;
	
	var jObject = JSON.stringify({ "givenName":givenname, "surname":surname });
	
	var fileName = (($("#gpanelFile")).html());
	
	if (fileName == 'All Files') {
		alert('Please select a file');
	}
	else {
		
		$.ajax({
			type: 'get',            //Request type
			dataType: 'json',       //Data type - we will use JSON for almost everything 
			url: '/addIndi', 
			data: { indi: jObject, fileName: fileName },  //The server endpoint we are connecting to
			success: function (data) {
				
				($("#indiBody")).empty();
				($("#indiDesc")).empty();
				($("#indiAnces")).empty();
				
				for (var i = 0; i < data.length; i++) {
					if (data[i].length == 0) {
						continue;
					}
					var newDropContent = "<tr><td>"+data[i].givenName+"</td><td>"+data[i].surname+"</td><td>"+data[i].sex+"</td><td>"+data[i].familysize+"</td></tr>";
					($("#indiBody")).append(newDropContent);
					
					var newDescContent = '<option value=\"'+ data[i].givenName + ' ' + data[i].surname +'\">'+ data[i].givenName + ' ' + data[i].surname +'</option>';
					($("#indiDesc")).append(newDescContent);
					($("#indiAnces")).append(newDescContent);
				}
				
				($(statusPanelText)).append('Sucessfully added individual to '+ fileName + '<br>');
			},
			fail: function(error) {
				// Non-200 return, do something with error
				console.log(error); 
			}
		});
	}
	
	$('html, body').animate({
		scrollTop: $("#gedcom").offset().top
	}, 2000);
	
}

function handleClickCreate() {
	
	var encoding = document.getElementById( "encoding" );
	var fileName = document.getElementById( "filenamecreate" );
	var source = document.getElementById( "sourcecreate" );
	var submitterName = document.getElementById( "submittername" );
	var gedcVersion= document.getElementById( "gedcversion" );
	var submitterAddress = document.getElementById( "submitteraddress" );
	
	var jsonObject = new Object();
	
	if (!fileName.value.includes('.ged')|| source.value == "" || submitterName.value == "" || gedcVersion.value == "" || submitterAddress.value == "" || isNaN(gedcVersion.value)) {
		if (isNaN(gedcVersion.value)) {
			alert('Invalid gedcVersion');
		}
		else {
			if (!fileName.value.includes('.ged')) {
				alert('File name was must be of type .ged');
			}
			else if (submitterName.value == "") {
				alert('Submitter name was left empty!');
			}
			else if (submitterAddress.value == "") {
				alert('Submitter address was left empty!');
			}
			else if (source.value == "") {
				alert('Source was left empty!');
			}
			else if (gedcVersion.value == "") {
				alert('GEDCOM version was left empty!');
			}
			($(statusPanelText)).append('Ran into an issue while creating a Gedcom file!<br>');	
		}
	}
	else {
		jsonObject.encoding = encoding.value;
		jsonObject.source = source.value;
		jsonObject.subName = submitterName.value;
		jsonObject.subAddress = submitterAddress.value;
		jsonObject.gedcVersion = gedcVersion.value;
				
		$.ajax({
			type: 'get',            //Request type
			dataType: 'json',       //Data type - we will use JSON for almost everything 
			url: '/createGEDCOM', 
			data: { obj: jsonObject, fileName: fileName.value },  //The server endpoint we are connecting to
			success: function (data) {	
				if (data['fileList'].length <= 0) {
					console.log('Empty List');
				}
				else {
					($("#indiList tbody")).empty();
					($('#dropdownList')).empty();
					for (var i = 0; i < data['fileList'].length; i++) { 
						if (data['objList'][i].length == 0) {
							continue;
						}
						var newRowContent = "<tr><td><a href=\"/uploads/"+ data['fileList'][i] +"\">"+ data['fileList'][i] +"</a></td><td>"+ data['objList'][i][0].source +"</td><td>"+ data['objList'][i][0].gedc +"</td><td>"+data['objList'][i][0].encoding+"</td><td>"+ data['objList'][i][0].submittername +"</td><td>"+ data['objList'][i][0].submitteraddress +"</td><td>"+data['objList'][i][0].indilength+"</td><td>"+data['objList'][i][0].famlength+"</td></tr>";
						var newDropContent = "<a class=\"dropdown-item\" onclick=\"myFunction(\'"+data['fileList'][i]+"\')\"  href=\"#gedcom\">" + data['fileList'][i] + "</a>";
						($("#indiList tbody")).append(newRowContent);
						($('#dropdownList')).append(newDropContent);
					}
				}
				
				($(statusPanelText)).append('Sucessfully created file called '+ fileName.value + '<br>');	
			},
			fail: function(error) {
				// Non-200 return, do something with error
				console.log(error); 
			}
		});
		alert('File was added sucessfully!');
			$('html, body').animate({
				scrollTop: $("#file").offset().top
			}, 2000);
	}
}

function handleClickDesc() {
	
	var fileName1 = (($("#gpanelFile")).html());
	var maxDesc = document.getElementById( "maxGenDesc" );
		
	if (fileName1 != 'All Files' && maxDesc.value != '' && !isNaN(maxDesc.value) && maxDesc.value >= 0) {
		
		($('#descendantList')).empty();
		($('#descendantList')).append('<thead><tr><th>Generation</th><<th>Individuals</th></tr></thead>');

		var e = document.getElementById("indiDesc");
		var strUser = e.options[e.selectedIndex].value;
		var name = strUser.split(' ');
		
		$.ajax({
			type: 'get',            //Request type
			dataType: 'json',       //Data type - we will use JSON for almost everything 
			url: '/getDesc', 
			data: { fileName: fileName1 , givenName: name[0], surname: name[1], maxDepth: maxDesc.value },  //The server endpoint we are connecting to
			success: function (data) {
				
				for (var i = 0; i < data.length; i++) {
					($('#descendantList')).append("<tr>");
					($('#descendantList')).append("<td>"+i+"</td>");
					var addList = "<td>";
					for (var j = 0; j < data[i].length; j++) {
						addList += data[i][j].givenName+" "+data[i][j].surname+", ";
	
						
					}
					addList += "</td>";
					($('#descendantList')).append(addList);
					($('#descendantList')).append("</tr>");
				}
				
				if (data.length == 0) {
					var newDropContent = "<h4 class = \"noIndiPadding\">No individuals!</h4>";
					($("#descendantList")).append(newDropContent);
				}
				
				($(statusPanelText)).append('Sucessfully retrieved all descendants from '+ fileName1 + '<br>');	
			},
			fail: function(error) {
				// Non-200 return, do something with error
				console.log(error); 
			}
		});
	}
	else {
		if (fileName1 == 'All Files') {
			alert('Please select a file above in the blue drop down list');
		}
		else if (maxDesc.value == '') {
			alert('Please enter a max depth for generations');
		}
		else if (isNaN(maxDesc.value)) {
			alert('Please enter a valid number for max depth');
		}
		else if (maxDesc.value < 0) {
			alert('Please enter a valid number greater than 0');
		}
		else {
			alert('Error!');
		}
		
		($(statusPanelText)).append('Ran into an error while retrieving descendants<br>');	
	}
}

function handleClickAnces() {
	var fileName1 = (($("#gpanelFile")).html());
	var maxDesc = document.getElementById( "maxGenAnces" );
		
	if (fileName1 != 'All Files' && maxDesc.value != '' && !isNaN(maxDesc.value) && maxDesc.value >= 0) {
		
		($('#ancestorList')).empty();
		($('#ancestorList')).append('<thead><tr><th>Generation\'s above</th><<th>Individuals</th></tr></thead>');

		var e = document.getElementById("indiAnces");
		var strUser = e.options[e.selectedIndex].value;
		var name = strUser.split(' ');
		
		$.ajax({
			type: 'get',            //Request type
			dataType: 'json',       //Data type - we will use JSON for almost everything 
			url: '/getAnces', 
			data: { fileName: fileName1 , givenName: name[0], surname: name[1], maxDepth: maxDesc.value },  //The server endpoint we are connecting to
			success: function (data) {
				
				for (var i = 0; i < data.length; i++) {
					($('#ancestorList')).append("<tr>");
					($('#ancestorList')).append("<td>"+i+"</td>");
					var addList = "<td>";
					for (var j = 0; j < data[i].length; j++) {
						addList += data[i][j].givenName+" "+data[i][j].surname+", ";
	
						
					}
					addList += "</td>";
					($('#ancestorList')).append(addList);
					($('#ancestorList')).append("</tr>");
				}
				
				if (data.length == 0) {
					var newDropContent = "<h4 class = \"noIndiPadding\">No individuals!</h4>";
					($("#ancestorList")).append(newDropContent);
				}
				
				($(statusPanelText)).append('Successfully retrieved all in file '+ fileName1 +'<br>');	
			},
			fail: function(error) {
				// Non-200 return, do something with error
				console.log(error); 
			}
		});
	}
	else {
		if (fileName1 == 'All Files') {
			alert('Please select a file above in the blue drop down list');
		}
		else if (maxDesc.value == '') {
			alert('Please enter a max depth for generations');
		}
		else if (isNaN(maxDesc.value)) {
			alert('Please enter a valid number for max depth');
		}
		else if (maxDesc.value < 0) {
			alert('Please enter a valid number greater than 0');
		}
		else {
			alert('Error!');
		}
		
		($(statusPanelText)).append('Ran into an error while retrieving ancestors<br>');	
	}
}

function validateForm() {
	var test = document.getElementById('uploadForm').uploadFile.files[0].name;
	
	if (test.includes('.ged')) {
		alert('File has been added');
		($(statusPanelText)).append('File was added!<br>');	
	}
	else {
		alert('Invalid file format');
		($(statusPanelText)).append('Failed to upload invalid file format<br>');	
		return false;
	}
	
}

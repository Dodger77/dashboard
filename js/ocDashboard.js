var refreshId = new Array();

$(document).ready(function() {
	// fade in widgets
	$(".dashboardItem").fadeIn();

	// automatic reload for widgets with interval > 0
	$('.dashboardItem').each(function(i, current){
		if($("#" + current.id).data('interval') != 0) {
			// set refreshs
		    refreshId[i] = setInterval(function() { loadWidget(current.id); }, $('#' + current.id).data('interval'));	
		    
		    //set status at start
    	    if($("#" + current.id).data('interval') != 0) {
    	    	setBgShadowColor(current.id,$('#' + current.id).data('status'));
    	    }
		    
    	    // bind reload button actions
    	    bindReload(current.id);
	    }
	});
});


//set bg color for widgetItem
function setBgShadowColor(id, status) {
	colors = new Array("black","black","darkgreen","#FF8000","red");
	$('#' + id).css('-webkit-box-shadow','0px 5px 15px -7px ' + colors[status]);
	$('#' + id).css('-moz-box-shadow','0px 5px 15px -7px ' + colors[status]);
	$('#' + id).css('box-shadow','0px 5px 15px -7px ' + colors[status]);
	return true;
}


// bind click function to reload widget via ajax
function bindReload(id) {
    $('#' + id + ' .ocDashboard.head span').live('click', function () {showWaitSymbol(id);loadWidget(id);});
}


//load widget via ajax and set in html
function loadWidget(id) {
	$.ajax({
	    dataType: "json",
	    url:  OC.filePath('ocDashboard', 'ajax', 'reloadWidget.php') + '?widget=' + id,
	    success: function(res) {
			if (res.success) {
				//alert(res.HTML);
				$('#' + res.id).children().fadeOut("fast", function () {
						$('#' + res.id).children().remove();
						$('#' + res.id).append(res.HTML);
		                $('#' + res.id).children().fadeIn("fast", function () {
		                		hideWaitSymbol(res.id);
		                	});
					});

				//set new status
                $('#' + id).data('status',res.STATUS);
			    setBgShadowColor(id,$('#' + id).data('status'));
			}
			else {
				// set error color
				setBgShadowColor(id,4);
				console.log("no success from server");
			}
		},
        error: function(xhr, status, error) {
        	// set error color
			setBgShadowColor(id,4);
			console.log("ajax error");
        }
    });
}


// shows the wait symbol on the left bottom corner
function showWaitSymbol(id) {
	$('.ocDashboard.inAction.' + id).fadeIn();
}


// hides the wait symbol on the left bottom corner
function hideWaitSymbol(id) {
	$('.ocDashboard.inAction.' + id).fadeOut();	
}

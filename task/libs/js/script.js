$('#earthquakeBtn').on('click', function() {
    $.ajax({
        url: "libs/php/getEarthquakeInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            north: $('#selNorth').val(),
            south: $('#selSouth').val(),
            east: $('#selEast').val(),
            west: $('#selWest').val()
        },
        success: function(result) {
            if (result.data == 'No Earthquakes at these co-ordinates') { 
                $('#earthquakeResults').html(result.data);
            } else {
                $('#earthquakeResults').html('No. of Earthquakes: ' + result.data.length);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown)
        }
    }); 
});



$('#timezoneBtn').on('click', function() {
    $.ajax({
        url: "libs/php/getTimezoneInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#selLatTime').val(),
            lng: $('#selLngTime').val()
        },
        success: function(result) {

            if (result.status.name == "ok") {                
                $('#timezoneResults').html('Time: ' + result.data.time + '<br>Timezone: ' + result.data.timezoneId);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown)
        }
    }); 
});



$('#oceanBtn').on('click', function() {
    
    $.ajax({
        url: "libs/php/getOceanInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#selLatOcean').val(),
            lng: $('#selLngOcean').val()
        },
        success: function(result) {
            if(result.data == 'No Ocean at these co-ordinates') {
                $('#oceanResults').html(result.data);
            } else {
                $('#oceanResults').html('Ocean: ' + result.data.name);
            }                    
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown)
        }
    }); 
    
});
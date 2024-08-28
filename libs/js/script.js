$('#earthquakeBtn').on('click', function() {
    $.ajax({
        url: "libs/php/getEarthquakeInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            north: $('#selNorth').val(),
            south: $('#selSouth').val(),
            east: $('#selEast').val(),
            west: $('#selWest').val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                
                $('#results').html(JSON.stringify(result['data'], null, 4));
        
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
        type: 'GET',
        dataType: 'json',
        data: {
            lat: $('#selLatTime').val(),
            lng: $('#selLngTime').val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                
                $('#results').html(JSON.stringify(result['data']));

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown)
        }
    }); 
});



$('#oceanBtn').on('click', function() {
    console.log($('#selLatOcean').val())
    console.log($('#selLngOcean').val())
    /*
    $.ajax({
        url: "libs/php/getOceanInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: $('#selLatOcean').val(),
            lng: $('#selLngOcean').val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                
                $('#results').html(JSON.stringify(result['data']));

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown)
        }
    }); 
    */
});
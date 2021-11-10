const invertal = setInterval(function() {
    if (document.getElementById('autorefresh').checked) {
        $.get( "/server/logs/latest.log", function( data ) {
            $( "#terminalLog" ).html( data );
        })
            .done(function() {
                $("#connectionText").html('')
                if ($("#statusIndicator").html() != 'Status: Offline') {
                    $("#commandSubmit").prop("disabled", false)
                }
            })
            .fail(function(data) {
                $("#connectionText").html('Disconnected!')
                $("#commandSubmit").prop("disabled", true)
                if (data.status = 401) {
                    window.location.href = "/"
                }
            })
        
        if (document.getElementById('autoscroll').checked) {
            document.getElementById("terminalLog").scrollTop = document.getElementById("terminalLog").scrollHeight 
        }
    }    
}, 100)

$('#sendCommand').submit(function(event) {
    event.preventDefault()
    console.log($('#command').val())
    $.post( "#", { command: $('#command').val() } );
})
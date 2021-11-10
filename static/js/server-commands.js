
// Turn the server on/off
function toggleServer() {
    $.post( "/api/toggleServer/" );
}

$("#serverToggle").click(function() {
    if ($("#statusIndicator").html() == "Status: Online") {
        $("#statusIndicator").html('Shutting Down...')
        $("#onlinePlayers").html('<h3>Online</h3>')
        document.getElementById('statusIndicator').classList.add('disabled')
    }

    if ($("#statusIndicator").html() == "Status: Offline") {
        $("#statusIndicator").html('Starting Up...')
        document.getElementById('statusIndicator').classList.add('disabled')

    }
    
    toggleServer()
})
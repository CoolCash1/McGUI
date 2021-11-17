
// Turn the server on/off
function toggleServer() {
    $.post( "/api/toggleServer/" );
}

// Run a server command
function serverCommand(commandText, displayToast = true) {
    $.get( "/api/runcommandurl/" + commandText, function( data ) {    
        if (displayToast) { showToast('Server', data) }
    })
}

$("#serverToggle").click(function() {
    if ($("#statusIndicator").html() == "Status: Online") {
        $("#statusIndicator").html('Shutting Down...')
        $("#onlinePlayers").html('<h3>Online</h3>')
        showToast('Server', 'Server is shutting down. Please wait')
        document.getElementById('statusIndicator').classList.add('disabled')
    }

    if ($("#statusIndicator").html() == "Status: Offline") {
        $("#statusIndicator").html('Starting Up...')
        showToast('Server', 'Server is starting up. Please wait')
        document.getElementById('statusIndicator').classList.add('disabled')

    }
    
    toggleServer()
})
// Perform periodic server info updates to UI

function update() {
    $.get( "/api/server", function( data ) {
        
    })
        .done(function(data) {
            dataParsed = JSON.parse(data)
            if (dataParsed.online) {
                if ($("#statusIndicator").html() != 'Shutting Down...') {
                    if (dataParsed.queryAllowed == true) {
                        $("#statusIndicator").html("Status: Online")
                        $("#serverToggle").html("Stop")
                        $("#commandSubmit").prop("disabled", false)
                        let onlinePlayers = dataParsed.queryData.onlinePlayers
                        htmlOut = '<h3>Online</h3>'
                        for (player in onlinePlayers) {
                            playerUUID = $.get("https://api.mojang.com/users/profiles/minecraft/" + onlinePlayers[player], function(data) {
                                console.log(data)
                                htmlOut += '<div class="card bg-dark text-light"><div class="card-body"><h5 class="card-title"><img style="margin-right: 15px;" src="https://crafatar.com/avatars/' + data + '?size=32" class="image" alt="...">' + onlinePlayers[player] + '</h5><a href="#" class="btn btn-primary">Options</a><a href="#" class="btn btn-secondary">Kick</a><a href="#" class="btn btn-secondary">OP</a><a href="#" class="btn btn-secondary">Ban</a></div></div>'
                            })
                        }
                        $('#onlinePlayers').html(htmlOut) 
                    }
                    else {
                        $("#statusIndicator").html("Status: Query Disabled")
                        $("#serverToggle").html("Stop")
                        $("#commandSubmit").prop("disabled", false)
                        $("#onlinePlayers").html('<h3>Online</h3> <p>This requires query to be enabled.</p>')         
                    }
                } 
            }  else {
                if ($("#statusIndicator").html() != 'Starting Up...') {
                    $("#statusIndicator").html("Status: Offline")
                    $("#serverToggle").html("Start")
                    $("#commandSubmit").prop("disabled", true)
                    $("#onlinePlayers").html('<h3>Online</h3>')         
                } 
            }

            if ($("#statusIndicator").html() != 'Starting Up...' && $("#statusIndicator").html() != 'Shutting Down...') {
                document.getElementById('statusIndicator').classList.remove('disabled')
            }
        })
        .fail(function(data) {
            if (data.status = 401) {
                window.location.href = "/"
            } else {
                document.getElementById('statusIndicator').classList.add('disabled')
                $("#statusIndicator").html("Status: Disconnected")
                $("#onlinePlayers").html('<h3>Online</h3> <p>Disconnected from mcGUI</p>')         
            }
        })
}

update()

const interval = setInterval(function() {
    update()
}, 5000);
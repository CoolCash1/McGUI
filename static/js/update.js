// Perform periodic server info updates to UI

prevOnlinePlayers = []
prevServerOnline = undefined
$.get("/api/server", function (data) {

})
    .done(function (data) {
        dataParsed = JSON.parse(data)
        onlinePlayers = dataParsed.queryData.onlinePlayers
        if (dataParsed.online) {
            // showToast('Server', 'The Server is online.')
            prevServerOnline = true
            if (dataParsed.queryAllowed == true) {
                prevOnlinePlayers = onlinePlayers
            } else { showToast('Server', 'Query is disabled on the server. It is highly reccomended to enable query.') }
        } else {
            showToast('Server', 'The Server is offline.')
            prevServerOnline = false
            if ($("#statusIndicator").html() != 'Starting Up...') {
                $("#statusIndicator").html("Status: Offline")
                $("#serverToggle").html("Start")
                $("#commandSubmit").prop("disabled", true)
                $("#onlinePlayers").html('<h3>Online - ' + onlinePlayers.length + '</h3>')
            }
        }
        if (window.location.pathname == "/players") {
            updatePlayers(dataParsed)
            $("#onlinePlayers").html('<h3>Online - ' + onlinePlayers.length + '</h3>')
            for (player in onlinePlayers) {
                processTemplateAppend('/static/html/playerViewer/playerCard.html', {
                    "name": onlinePlayers[player]
                }, 'onlinePlayers')
            }
        }
    })
    .fail(function (data) {
        showToast('McGUI', 'An error occured while pinging your McGUI Server.')
    })

function update() {
    $.get("/api/server", function (data) {

    })
        .done(function (data) {
            dataParsed = JSON.parse(data)
            if (dataParsed.online) {
                if ($("#statusIndicator").html() != 'Shutting Down...') {
                    if (prevServerOnline != dataParsed.online) { showToast('Server', 'The server is now online!') }
                    document.getElementById('latecyDisplay').classList.remove('hidden')
                    document.getElementById('latecyDisplay').innerHTML = "Latecy: " + dataParsed.status.latency + " ms"
                    if (dataParsed.status.latency > 100) { showToast('Server', 'The server is experincing high latency (<100ms)') }
                    if (dataParsed.queryAllowed == true) {
                        $("#statusIndicator").html("Status: Online")
                        $("#serverToggle").html("Stop")
                        $("#commandSubmit").prop("disabled", false)
                        let onlinePlayers = dataParsed.queryData.onlinePlayers
                        console.log([onlinePlayers, prevOnlinePlayers])
                        console.log([onlinePlayers.length, prevOnlinePlayers.length])
                        if (window.location.pathname == "/players") {
                            updatePlayers(dataParsed)
                            if (prevOnlinePlayers.length != onlinePlayers.length) {
                                $("#onlinePlayers").html('<h3>Online - ' + onlinePlayers.length + '</h3>')
                                for (player in onlinePlayers) {
                                    processTemplateAppend('/static/html/playerViewer/playerCard.html', {
                                        "name": onlinePlayers[player]
                                    }, 'onlinePlayers')
                                }
                            }
                        }
                        prevOnlinePlayers = onlinePlayers
                    }
                    else {
                        $("#statusIndicator").html("Status: Query Disabled")
                        $("#serverToggle").html("Stop")
                        $("#commandSubmit").prop("disabled", false)
                        $("#onlinePlayers").html('<h3>Online</h3> <p>This requires query to be enabled.</p>')
                    }
                }
            } else {
                if ($("#statusIndicator").html() != 'Starting Up...') {
                    if (prevServerOnline != dataParsed.online) { showToast('Server', 'The server has went offline.') }
                    document.getElementById('latecyDisplay').classList.add('hidden')
                    $("#statusIndicator").html("Status: Offline")
                    $("#serverToggle").html("Start")
                    $("#commandSubmit").prop("disabled", true)
                    $("#onlinePlayers").html('<h3>Online</h3>')
                }
            }

            prevServerOnline = dataParsed.online
            if ($("#statusIndicator").html() != 'Starting Up...' && $("#statusIndicator").html() != 'Shutting Down...') {
                document.getElementById('statusIndicator').classList.remove('disabled')
            }
        })
        .fail(function (data) {
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

const interval = setInterval(function () {
    update()
}, 5000);

// const invertal = setInterval(function() {
//     $.get( "/server/ops.json", function( data ) {
        
//     })
//         .done(function() {
            
//         })
//         .fail(function(data) {
             
//         })
// }, 5000)

// Player Functions

async function updatePlayers(serverData) {
    $.get( "/server/ops.json", function( data ) {

        })
            .done(function(ops) {
                $('#operators').html('<h3>Operators - ' + ops.length + '</h3>')
                console.log(ops)
                for (op in ops) {
                    online = ops[op].name in serverData.queryData.onlinePlayers
                    console.log(serverData.queryData.onlinePlayers)
                    console.log(online)
                    processTemplateAppend('/static/html/playerViewer/playerCard.html', {
                        "name": ops[op].name,
                        "online": online
                    }, 'operators')
                }
            })
            .fail(function(data) {
                    
            })

    $.get( "/server/banned-players.json", function( data ) {

            })
                .done(function(banlist) {
                    $('#banlist').html('<h3>Banlist - ' + banlist.length + '</h3>')
                    console.log(banlist)
                    for (player in banlist) {
                        online = banlist[player].name in serverData.queryData.onlinePlayers
                        console.log(serverData.queryData.onlinePlayers)
                        console.log(online)
                        processTemplateAppend('/static/html/playerViewer/banlistCard.html', {
                            "name": banlist[player].name,
                            "online": online
                        }, 'banlist')
                    }
                })
                .fail(function(data) {
                        
                })
}

function kickPlayer(playerName) {
    serverCommand('kick ' + playerName)
}

function banPlayer(playerName) {
    serverCommand('ban ' + playerName)
}

function pardon(playerName) {
    serverCommand('pardon ' + playerName)
}

function showPlayerOptions(playerName) {
    console.log('Showing options for player ' + playerName)
}
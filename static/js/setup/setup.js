let password = ''
let serverAddress = ''
let serverDir = ''
let serverRCONPasswd = ''
let serverName = ''
let serverStartScript = ''

function changeSlide(slideName) {
    let slides = document.getElementsByClassName('slideCard')
    for (let slide in slides) {
        if (typeof(slides[slide]) == 'object') {
            slides[slide].classList.add('hidden')
        }
        document.getElementById(slideName).classList.remove('hidden')
    }
}

function showLoader() {
    document.getElementById('fullScreenLoader').classList.remove('hidden')
    document.getElementById('fullScreenLoader').classList.add('d-flex')
}

function hideLoader() {
    document.getElementById('fullScreenLoader').classList.add('hidden')
    document.getElementById('fullScreenLoader').classList.remove('d-flex')
}

function confirmPasswords() {
    let password1 = $("#password1").val()
    let password2 = $("#password2").val()
    if (password1 == password2) {
        if (password1.length != 0) {
            changeSlide('card3')
            password = password1
        } else { alert('Password box cannot be empty.') }
    } else {
        alert('Passwords do not match.')
    }
}

function pingServer() {
    serverAddress = $("#serverAddress").val()
    showLoader()
    timeout = setTimeout(() => {
        hideLoader()
        alert('Ping timed out')
    }, 10000);
    $.get('/ping/' + serverAddress, function(data) {
        if (data == "ok") {
            hideLoader()
            changeSlide('card4')
            clearTimeout(timeout)
        
        } else {
            hideLoader()
            alert('Server Ping Failed!')
            clearTimeout(timeout)
        }
    })
}

function checkServerDir() {
    serverDir = $("#serverDir").val()
    serverRCONPasswd = $("#RCONPasswd").val()
    // showLoader()
    $.get('/checkDir/' + serverDir, function(data) {
        if (data == "ok") {
            console.log(serverRCONPasswd)
            // if (serverRCONPasswd != undefined) {
            changeSlide('card5')
            // } else {
            //     alert('McGUI requires a conenction to RCON to work properly. Please add your RCON password. Click help in the bottom left corner for help.')
            // }
        } else {
            // hideLoader()
            alert('Invalid Server Directory.')
        }
    })
}

function serverPinger() {
    console.log('Starting Pinger')
    var interval = window.setInterval(function(){
        console.log('pinging server')
        $.get('/mode', function(data) {
            if (data == 'normalMode') {
                changeSlide('complete')
            }
            if (data == 'fail') {
                changeSlide('fail')
            }   
        }) 
    }, 10000);
}

function finish() {
    serverStartScript = $('#serverScript').val()
    serverName = $('#serverName').val()
    changeSlide('loadingSlide')
    postData = {
        password: password, 
        address: serverAddress, 
        dir: serverDir,
        rcon: serverRCONPasswd,
        serverName: serverName,
        startScript: serverStartScript
    }
    console.log(postData)
    $.post('/setup', postData, function(data) {
        console.log(data)
        serverPinger()
    })   
}
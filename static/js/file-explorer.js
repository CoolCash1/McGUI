
currentDirectory = ''

urlDir = getUrlParameter('dir')
if (urlDir != false ) {
    currentDirectory = urlDir
}

jsonForFolder = []

function updateFiles() {
    $("#files").html('')
    url = ''
    if (currentDirectory == '') {
        url = '/api/listdir/root'
        document.getElementById('upFolder').classList.add('hidden')
    } else {
        url = '/api/listdir/' + currentDirectory
        document.getElementById('upFolder').classList.remove('hidden')
    }
    $.get( url, function(data) {})

        .done(function(data) {
            files = JSON.parse(data).files
            console.log(files)
            for (file in files) {
                if (files[file].isDir) {
                    $("#files").append('<tr class="folder" id="' + files[file].name + '"> <th scope="row">' + files[file].name + '</th> <td>Today</td> <td>Folder</td> <td>' + parseInt(files[file].size/1000) + 'kb</td> </tr>')  
                } else {
                    $("#files").append('<tr class="file" id="' + files[file].name + '"> <th scope="row">' + files[file].name + '</th> <td>Today</td> <td>File</td> <td>' + parseInt(files[file].size/1000) + 'kb</td> </tr>')  
                }
            }
            files = document.getElementsByClassName('file')
            console.log(files)
            for (file in files) {
                if (typeof(files[file]) == 'object') {
                    files[file].addEventListener('click', function() {
                        console.log(this.id)
                        window.open('/server' + currentDirectory + '/' + this.id)
                    })   
                } 
            }
            folders = document.getElementsByClassName('folder')
            console.log(folders)
            for (folder in folders) {
                if (typeof(folders[folder]) == 'object') {
                    folders[folder].addEventListener('click', function() {
                        console.log(this.id)
                        currentDirectory += '/' +this.id
                        updateFiles()
                    })
                } 
            }
        })
}

$("#upFolder").click(function(event) {
    event.preventDefault()
    lastAreaIndex = currentDirectory.indexOf( currentDirectory.substring(currentDirectory.lastIndexOf('/') + 1, currentDirectory.length))
    console.log(lastAreaIndex)
    console.log(currentDirectory.substring(0, lastAreaIndex))
    currentDirectory = currentDirectory.substring(0, lastAreaIndex)
    if (currentDirectory == '/') {currentDirectory = ''}
    updateFiles()
})

updateFiles()
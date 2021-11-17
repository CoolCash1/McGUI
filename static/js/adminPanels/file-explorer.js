
var currentDirectory = ''
var fileModal = new bootstrap.Modal(document.getElementById('fileModal'))      

urlDir = getUrlParameter('dir')
if (urlDir != false) {
    currentDirectory = urlDir
}

jsonForFolder = []

function updateFiles() {
    // Update Breadcrumb
    $("#breadCrumbList").html("")
    $("#breadCrumbList").append('<li class="breadcrumb-item" aria-current="page">Root</li>')
    folderList = currentDirectory.split('/')
    folderList.shift()
    for (folder in folderList) {
        if (folderList[folder].length < 20) {
            $("#breadCrumbList").append('<li class="breadcrumb-item" aria-current="page">' + folderList[folder] + '</li>')
        } else {
            $("#breadCrumbList").append('<li class="breadcrumb-item" aria-current="page">...</li>')
        }
    }

    $("#files").html('')
    url = ''
    if (currentDirectory == '') {
        url = '/api/listdir/root'
        document.getElementById('upFolder').classList.add('hidden')
    } else {
        url = '/api/listdir/' + currentDirectory
        document.getElementById('upFolder').classList.remove('hidden')
    }
    $.get(url, function (data) { })

        .done(function (data) {
            files = JSON.parse(data).files
            console.log(files)
            for (file in files) {
                let type = ""
                if (files[file].isDir) { type = "Folder" } else { type = "File" }
                processTemplateAppend('/static/html/explorer/fileExplorerItem.html', {
                    "name": files[file].name,
                    "type": type,
                    "size": files[file].size,
                    "modified": files[file].lastModified
                }, "files", true)
            } 
        })
}

$("#upFolder").click(function (event) {
    event.preventDefault()
    lastAreaIndex = currentDirectory.indexOf(currentDirectory.substring(currentDirectory.lastIndexOf('/') + 1, currentDirectory.length))
    console.log(lastAreaIndex)
    console.log(currentDirectory.substring(0, lastAreaIndex))
    currentDirectory = currentDirectory.substring(0, lastAreaIndex)
    if (currentDirectory == '/') { currentDirectory = '' }
    if (currentDirectory.endsWith('/')) { currentDirectory = currentDirectory.substring(0, currentDirectory.length - 1); }
    updateFiles()
}) 

updateFiles()


// Drag and drop
let dropArea = document.getElementById('drop-area')

    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    })

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

function viewFile(fileName) {
    if (document.getElementById(fileName).classList.contains('File')) { 
        console.log('Viewing File: ' + fileName)
        $('#modal-content').html('')
        processTemplateAppend('/static/html/explorer/fileMenu.html', {
            "name": fileName,
            "size": 12345
        }, 'modal-content')
        $.get('/server/' + currentDirectory + '/' + fileName, function(data) {
            if (typeof(data) == 'object') {
                data = JSON.stringify(data)
            }
            $('#fileDataArea').html(data)
            $('#downloadButton').click(function(event) {
                window.open('/server/' + currentDirectory + '/' + fileName, '_blank').focus();
            })
        })
        fileModal.show()
    }
}
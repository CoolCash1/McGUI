// Template processing is done by JsRender (https://www.jsviews.com/#jsrender)

processTemplate = function(url, variables) {
    $.get(url, function (data) {
        let template = $.templates(data)
        let returnVal = template.render(variables)
        return returnVal
    })
}

processTemplateAppend = function(url, variables, appendID, isExplorerObject = false) {
    $.get(url, function (data) {
        let template = $.templates(data)
        let returnVal = template.render(variables)
        $("#" + appendID).append(returnVal)
        if (isExplorerObject) {
            document.getElementById(variables.name).addEventListener('click', function(event) {
                if (this.classList.contains('Folder')) {
                    console.log('Moving Folder up.')
                    currentDirectory += '/' + this.id
                    updateFiles()
                } 
            })
        }
    })
}

// processTemplateModal = function(url, variables, appendID, modalID) {
//     $.get(url, function (data) {
//         let template = $.templates(data)
//         let returnVal = template.render(variables)
//         $("#" + appendID).append(returnVal)
//         if (isExplorerObject) {
//             document.getElementById(variables.name).addEventListener('click', function(event) {
//                 if (this.classList.contains('Folder')) {
//                     console.log('Moving Folder up.')
//                     currentDirectory += '/' + this.id
//                     updateFiles()
//                 } 
//             })
//         }
//     })
// }

// {"variableName": "variableData"}
showToast = function (title, body) {
    finalHTML = ""

    $.get("/static/html/toast.html", function (data) {
        dataSplit = data.split('[VAR]', limit = 3)
        dataSplit[0] += title
        dataSplit[1] += body
        for (splitSegment in dataSplit) {
            finalHTML += dataSplit[splitSegment]
        }
    })
        .done(function (data) {
            console.log(finalHTML)
            out = $("#toast-container").html() + finalHTML
            $("#toast-container").html(out)

            var newToast = document.getElementById('newToast')
            console.log(newToast)
            if (newToast) {
                var toast = new bootstrap.Toast(newToast)
                
                toast.show()
                newToast.id = ''
            }
        })
        .fail(function (data) {

        })
}

// Clear used toasts
// setInterval(function () {
//     usedToasts = document.getElementsByClassName('')
//     for (toast in usedToasts) {
//         usedToasts[toast].remove()
//     }
// }, 10000);
const apiKey = "P1kFSxY5ndG957IWKgEycqXpTX7rptME"
var limit = 10

// define getGifs Function
var getGifs = (word) => {

    $("#loadingDiv").text("waiting for responses...")

    //getting gueryURL. currently searches for dogs
    var queryURL = `https://api.giphy.com/v1/gifs/search?q=${word}&api_key=${apiKey}&limit=${limit}`;

    //this object will count up all labels in the google vision api response
    var visionCount = {};

    //making an ajax call to giphy
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //iterating through each gif object in the giphy response
        response.data.forEach((data) => {
        
            //defining a variable for this image that will later be used by an inner function called 'gifPausePlay'
            var that = this

            //making a div with image and gif title, rating
            var div = $("<div>")
            var gif = $("<img>")
            gif.attr("src", data.images.original_still.url)
            gif.on("click", (that) => gifPausePlay(that))
            div.append(gif)
            div.append($("<h3>").text(data.title))
            var row = $("<div class='row'>")
            row.append($("<p class='col-md-11'>").text(`Rating: ${data.rating}`))
            row.append($("<a class='col-md-1'>").text("Source").attr("href", data.source))
            div.append(row)

            //making a call to the Google Vision Api
            //this alternative to an ajax call from https://stackoverflow.com/users/4891910/a-moore
            // var visionApiOptions = JSON.stringify({ "requests": [{ "image": { "source": { "imageUri": data.images.original_still.url } }, "features": [{ "type": "LABEL_DETECTION", "maxResults": 5 }] }] });
            // var visionApiRequest = new XMLHttpRequest;
            //  visionApiRequest.onload = function () { console.log(visionApiRequest.responseText) };
            // visionApiRequest.open("POST", "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA9EHeI2lrYJnjfEMhI0rU-J8yyfAOSOAs", !0);
            // visionApiRequest.send(visionApiOptions)
            //end of code from https://stackoverflow.com/users/4891910/a-moore


            //making a div with information from google vision
            // visionApiRequest.onload = function () {
            //     var visionDiv = $("<div>")
            //     const vision = JSON.parse(visionApiRequest.response)
            //     visionDiv.append($("<b>").text("Google Vision Annotation:"))

            //     //iterating through each vision response for a single gif
            //     vision.responses.forEach((response) => {
            //         response.labelAnnotations.forEach((annotation) => {
                        
            //             //write percentage from proportion provided by the Vision response
            //             visionDiv.append(`(${annotation.score.toFixed(2) * 100}%)${annotation.description}, `)
           
            //             //start count of a label(description) from Vision response if its the first time foun 
            //             if (!visionCount[annotation.description]) {visionCount[annotation.description] = 1}
            //             //count occurences of labels from Vision response
            //             visionCount[annotation.description]++
            //         })
            //     })

            //     //add vision information to the new div. Add the new div to the feed in the document. 
            //     $(div).append(visionDiv)
                $("#gifsDiv").prepend(div)
                $("#gifsDiv").prepend("<hr>")

            //     //create the report of the label count from vision responses from all GIFs in this GET
            //     var visSumDiv = $("<div>")
            //     visSumDiv.append($("<h3>").text(`Total Labels`))
            //     visSumDiv.append($("<p>").text(`From all ${limit} GIFs, here is how many times each label was found in the Google Vision annotation.`))
            //     Object.keys(visionCount).forEach((key) => {
            //         // visSumDiv.append($("<p>").text(`${key}: ${visionCount[key]}`))
            //         visSumDiv.append(`${visionCount[key]}: ${key}<br>`)
            //     })
            //     $("#visionSummeryDiv").html(visSumDiv)
            //     $("#loadingDiv").empty()
            // }
        })
    })
    //this makes a button to get 256 gifs of the current topic
    var btn = $("<button>")
    btn.addClass("btn btn-primary btn3 btn-more")
    btn.text("Get More Gifs!")
    btn.on("click", () => {
        limit = 256
        getGifs(word)
    })
    $("#feedEndDiv").html(btn)
}
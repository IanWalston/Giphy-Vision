const array = ["It's Always Sunny In Philidelphia", "Bojack Horseman", "30 Rock", "Blackish", "Parks and Rec", "The Eric Andre Show", "My little Pony: Friendship is Magic", "Spongebob Squarepants", "King of the Hill", "Insecure", "Broad City"]
var limit = 10
const apiKey = "P1kFSxY5ndG957IWKgEycqXpTX7rptME"

// define getGifs Function
var getGifs = (word) => {
    //getting gueryURL. currently searches for dogs
    var queryURL = `https://api.giphy.com/v1/gifs/search?q=${word}&api_key=${apiKey}&limit=${limit}`;

    //making an ajax call 
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var visionCount = {};


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
            console.log(data)

            var row = $("<div class='row'>")

            row.append($("<p class='col-md-6'>").text(`Rating: ${data.rating}`))
            row.append($("<a class='col-md-6'>").text("Source").attr("href", data.source))

            div.append(row)

            //this alternative to an ajax call from https://stackoverflow.com/users/4891910/a-moore
            var b = JSON.stringify({ "requests": [{ "image": { "source": { "imageUri": data.images.original_still.url } }, "features": [{ "type": "LABEL_DETECTION", "maxResults": 5 }] }] });
            var e = new XMLHttpRequest;
            //  e.onload = function () { console.log(e.responseText) };
            e.open("POST", "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA9EHeI2lrYJnjfEMhI0rU-J8yyfAOSOAs", !0);
            e.send(b)
            //end of code from https://stackoverflow.com/users/4891910/a-moore


            //making a div with information from google vision
            e.onload = function () {

                var visionDiv = $("<div>")
                const vision = JSON.parse(e.response)
                visionDiv.append($("<b>").text("Google Vision Annotation:"))

                vision.responses.forEach((response) => {
                    response.labelAnnotations.forEach((annotation) => {

                        //count occurences of descriptions 
                        if(!visionCount[annotation.description]){
                            visionCount[annotation.description]=1
                        }

                        visionCount[annotation.description]++
                        
                        
                        
                        console.log(visionCount)
                        visionDiv.append(`(${annotation.score.toFixed(2) * 100}%)${annotation.description}, `)
                    })
                })
                $(div).append(visionDiv)
                $("#gifsDiv").prepend(div)
                $("#gifsDiv").prepend("<hr>")

            }
        })
        //this shows 256 gifs of the current topic. I disabled this to limit the calling to the google api
        var btn = $("<button>")
        btn.addClass("btn btn-primary butn")
        btn.text("Get More Gifs")
        btn.on("click", () => {
            limit = 256
            getGifs(word)
        })
        $("#gifsDiv").append(btn)
    })
}

//on click function that switches between playing and paused gif
var gifPausePlay = (that) => {
    img = $(that.currentTarget)
    if (img.hasClass("playing")) {
        img[0].src = img[0].src.replace(/\.gif/i, "_s.gif")
        img.removeClass("playing")
    }
    else {
        img[0].src = img[0].src.replace(/\_s.gif/i, ".gif")
        img.addClass("playing")
    }
}

//make a button in the buttonsDiv for each item in the array
var makeButtons = () => {
    $("#buttonsDiv").empty()
    array.forEach((item) => {
        var btn = $("<button>")
        btn.text(item)
        btn.on("click", () => {
            $('#gifsDiv').empty()
            limit = 10
            getGifs(item)
        })
        btn.addClass("btn btn-primary butn")

        var row = $("<div>")
        row.addClass("row")
        row.append(btn)

        $("#buttonsDiv").append(row)
    })
}

//adding functionallity to button adding form
$("#add-the-topic").on("click", () => {
    event.preventDefault();
    userInput = $("#topic-input").val()
    array.unshift(userInput)
    makeButtons()
})

//making buttons for topics in initial array
makeButtons()

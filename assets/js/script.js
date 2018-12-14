//defining global variables
const array = ["It's Always Sunny In Philidelphia", "Bojack Horseman", "30 Rock", "Blackish", "Parks and Rec", "The Eric Andre Show", "My little Pony: Friendship is Magic", "Spongebob Squarepants", "King of the Hill", "Insecure", "Broad City"]

//on click function that switches between playing and paused gif. I was having a problem with (this), so I used (that). Uses regex to put a "_s" on or off the git title. 
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

//defining a function that will make a button in the buttonsDiv for each item in the array
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
        btn.addClass(`btn-primary btn${Math.floor(Math.random() * 4)}`)

        var row = $("<div>")
        row.addClass("row")
        row.append(btn)

        $("#buttonsDiv").append(row)
    })
}

//this makes the add topic button add the user input to the array of topics, and getGifs of topic
$("#add-the-topic").on("click", () => {
    event.preventDefault();
    userInput = $("#topic-input").val()
    array.unshift(userInput)
    getGifs(userInput)
    makeButtons()
})

//making buttons for default topics
makeButtons()

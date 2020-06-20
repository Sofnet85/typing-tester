// Quick querySelectors
const select = (e) => document.querySelector(e)
const selectAll = (e) => document.querySelectorAll(e)
// DOM elements
const info = select('#info')
timer = select('.timer')
input = select("#textInput"),
output = select("#textOutput"),
inputFull = select("#textFull"),
// Control btns
btnPlay = select("#btnPlay"),
btnRefresh = select("#btnRefresh"),
// Counters
_time = select("#time"),
_totalWords = select("#totalWords"),
_writtenWords = select("#writtenWords"),
_accuracy = select("#accuracy"),
_cpm = select("#cpm"),
_wpm = select("#wpm"),
_errors = select("#errors"),
// Location
locationMessage = select("#location")
//Geolocation url
geoUrl = 'http://ip-api.com/json/'
//Geolocation function
const geolocation = (callback) => { 
    fetch(geoUrl).then((response) => {
      response.json().then((data) => {
        callback(undefined, data)
      })
    })
  }

// Function that will return random num
const random = (array) => array[Math.floor(Math.random() * array.length)]

// speedTyping Class
class speedTyping {
    constructor() {
        this.index = 0; // Characters index
        this.words = 0; // Completed words index
        this.errorIndex = 0; // Errors index
        this.correctIndex = 0; // Correct index
        this.accuracyIndex = 0; // Accuracy counter
        this.cpm = 0; // CPM counter
        this.wpm = 0; // WPM cpm / 5
        this.interval = null; // time counter
        this.duration = 60; // Test duration time (60 seconds)
        this.secondsLeft = 0 // Counts seconds left
        this.typing = false; // To check if we are typing
        this.quote = []; // Quotes array
        this.author = []; // Authors array
    }
  
    // Set the timer based on local time
    timer() {
        // Check first if its not running, it's set to null originally
        if (typeof this.interval === "number") return
        // Timestamp in millisecond
        const now = Date.now()
        // Here the const rapresents the sum of the 60sec plus the timestamp, it will serve as countdown
        const done = now + this.duration * 1000
        // Set interval
        this.interval = setInterval(() => {
            // Get seconds left. We ran Date.now() again to update the time
            this.secondsLeft = Math.round((done - Date.now()) / 1000)
            // Display the countdown
            timer.textContent = this.secondsLeft
            // Display seconds taken
            _time.textContent = (60 - this.secondsLeft)
            // Stop when reach 0 and call finish function
            if (this.secondsLeft === 0) {
                this.stop()
                this.finish()
                timer.remove()
            } else if (this.secondsLeft <= 5 && (this.secondsLeft % 2) !== 0) {
                timer.style.background = "#eb4841"
            } else {
                timer.style.background = "#eae7e7"
            }
        }, 1000)
    }
  
    // Start typing function when run when Start button clicked
    start() {
        timer.style.visibility = "visible"
        // Get quotes only
        const getQuote = allQuotes.map((item) => item.text)
        let quoteWords = 0
        if (getQuote.length === 0) {
            this.quote = 'Genius is one percent inspiration and ninety-nine percent perspiration. Every man dies. Not every man really lives. and'
        } else {
            // Get 3 random quotes
            this.quote = `${random(getQuote)} ${random(getQuote)}`
            // Count total words avoiding empty spaces
            quoteWords = this.quote.split(" ").filter((i) => i).length
        }
        // Display total words
        _totalWords.textContent = quoteWords
        // Add set focus on inputand Active class
        input.focus()
        // Check if we start typing
        if (!this.typing) {
            this.typing = true
            // Display the quotes in the input div
            input.textContent = this.quote
            // Start the event listener
            input.addEventListener("keypress", (event) => {
                // Prevent the default action
                event.preventDefault()
                // Just in case
                event = event || window.event
                // Get the pressed key code
                const charCode = event.which || event.keyCode
                // Set the timer
                this.timer()
                // Read it as a normal key
                const charTyped = String.fromCharCode(charCode)
                // Compare the pressed key to the quote letter
                if (charTyped === this.quote.charAt(this.index)) {
                    //Background back to normal
                    input.style.background = "#616ea6"
                    // Detect the spaces by key code(32) - Check them both
                    if (charTyped === " " || charCode === 32) {
                        this.words++
                        // // Update number of written words
                        _writtenWords.textContent = this.words
                    }
                    // Increment the keys index
                    this.index++
                    // Updating current quote (eliminating the already pressed keys)
                    const currentQuote = this.quote.substring(this.index, this.index + this.quote.length)
                    // Update the output div value when typing
                    input.textContent = currentQuote
                    output.innerHTML += charTyped
                    // Increment the correct keys
                    this.correctIndex++
                    // If index is equal to the quote length, that means the text ended, call the finish() method
                    if (this.index === this.quote.length) {
                        // Adding the last necessary word count
                        _writtenWords.textContent = (this.words + 1)
                        this.stop()
                        this.finish()
                        return
                    }
                } else {
                    //Background changes with an error
                    input.style.background = "#eb4841"
                    // Increment the key mistakes
                    this.errorIndex++
                    // Add error counter to the dom
                    _errors.textContent = this.errorIndex
                    // Decrement the correct keys counter
                    this.correctIndex--
                }
                //Dividing by 5 which is the average length of a word. We are just considering the correct char
                this.cpm = this.correctIndex > 5 ? Math.floor((this.correctIndex / this.duration) * 60) : 0
                _cpm.textContent = this.cpm
                // Accuracy: (Correct chars * 100 / total index)
                this.accuracyIndex = this.correctIndex > 5 ? Math.round((this.correctIndex * 100) / this.index) : 0
                // Add accuracy to the dom. We need to check it because division by 0 give us a special values (infinity, NaN)
                if (this.accuracyIndex > 0 && Number.isInteger(this.accuracyIndex)) _accuracy.innerHTML = `${this.accuracyIndex}<span class="small">%</span>`
            })
        }
    }

    // Stop the timer
    stop() {
        // GROSS WPM: (cpm divided by 5(average word length) then divided by the seconds not minute actually passed)
        this.wpm = Math.round((this.cpm / 5) / ( (60 - this.secondsLeft) / 60))
        _wpm.textContent = this.wpm
        // Clear timer and set interval to null
        clearInterval(this.interval)
        this.interval = null
        // Just to be sure
        this.typing = false
        // Reset The Timer value to 0
        timer.textContent = "0"
        // Remove the start btn
        btnPlay.remove()
        // Remove the input area
        input.remove()
        // Remove timer output
        timer.remove()
        // Set active class to Refresh btn
        btnRefresh.classList.add("active")
        // Show the full quote in the hidden div
        inputFull.style.visibility = "visible"
        inputFull.style.padding = "20px"
        // Show the tested quote
        inputFull.innerHTML = `&#8220;${this.quote}&#8221`
        // Completely stop
        return
    }
  
    // Last action
    finish() {
        // Show the results
        const wpm = this.wpm
        let result = ""
        const message = `Your typing speed is <strong>${wpm}</strong> WPM which equals <strong>${this.cpm}</strong> CPM. You've made <strong>${this.errorIndex}</strong> mistakes with a <strong>${this.accuracyIndex}%</strong> accuracy.`
        if (wpm > 5 && wpm < 20) {
            result = `Too Slow! ${message} You should do more practice.`
            output.style.background = "#eb4841"
            output.innerHTML = result
        } else if (wpm > 20 && wpm < 40) {
            result = `About Average! ${message} You can do better!`
            output.style.background = "#f48847"
            output.innerHTML = result
        } else if (wpm > 40 && wpm < 60) {
            result = `Great Job! ${message} You're doing great!`
            output.style.background = "#ffc84a"
            output.innerHTML = result
        } else if (wpm > 60) {
            result = `Insane! ${message} You're are Awesome!`
            output.style.background = "#a6c34c"
            output.innerHTML = result
        } else {
            result = `Hmmm! Please stop playing around and start typing!`
            output.style.background = "#eb4841"
            // output.style.color = "Black"
            output.innerHTML = result
        }
        localStorage.setItem("WPM", wpm)
    }
}

//Getting data from quotes 
geolocation((error, response) => {
  if (error) {
    locationMessage.textContent = ''
  } else {
    locationMessage.textContent = `Visiting from: ${response.city} - ${response.country}`
  }
})

// Initializing the class
const typingTest = new speedTyping()
// Start test with eventListener
btnPlay.addEventListener("click", () => typingTest.start())
// Reload the page with the refresh
btnRefresh.addEventListener("click", () => location.reload())
// Displaying the last WPM score
const savedWPM = localStorage.getItem("WPM") || 0
select("#results").textContent = savedWPM
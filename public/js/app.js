// Quick querySelectors
const select = (e) => document.querySelector(e)
const selectAll = (e) => document.querySelectorAll(e)

// DOM elements
const input = select("#textInput"),
output = select("#textOutput"),
inputFull = select("#textFull"),

// Counters
_timer = select("#timer"),
_totalWords = select("#totalWords"),
_writtenWords = select("#writtenWords"),
_accuracy = select("#accuracy"),
_cpm = select("#cpm"),
_wpm = select("#wpm"),
_errors = select("#errors"),

// Modal
modal = select("#ModalCenter"),
modalBody = select(".modal-body"),
modalClose = selectAll(".modal-close"),
modalReload = select("#modalReload"),

// Control btns
btnPlay = select("#btnPlay"),
btnRefresh = select("#btnRefresh"),

locationMessage = select("#location")
// Array will hold all quotes that stored in external JSON file
allQuotes = [],

//Geolocation url
geoUrl = 'http://ip-api.com/json/'

// Function that returns random key from an array
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
        // Display the timer before interval run
        _timer.textContent = this.duration

        // Set interval
        this.interval = setInterval(() => {
            // Get seconds left. We ran Date.now() again to update the time
            const secondsLeft = Math.round((done - Date.now()) / 1000)
            // Display the countdown
            _timer.textContent = secondsLeft //here also I need to check. I changed it from innerHTML
            // Stop when reach 0 and call finish function
            if (secondsLeft === 0) {
                this.stop()
                this.finish()
            }
        }, 1000)
    }
  
    // Start typing function when run when Start button clicked
    start() {
        //Quotes url
        const quotesUrl = 'https://type.fit/api/quotes'
        //Will use this proxy to solve CORS issue
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

        fetch(proxyUrl + quotesUrl).then((response) => {
            response.json().then((data) => {
                if (data.error === 0) {
                    allQuotes = 0
                } else {
                    allQuotes = data
                }
            })
        })

        console.log(allQuotes)
        // Get quotes only
        const getQuote = allQuotes.map((item) => item.text)
        let quoteWords = ''

        if (getQuote.length === 0) {
            this.quote = 'Genius is one percent inspiration and ninety-nine percent perspiration. You can observe a lot just by watching.'
        } else {
            // Get 3 random quotes
            this.quote = `${random(getQuote)} ${random(getQuote)}`
            // Count total words avoiding empty spaces
            quoteWords = this.quote.split(" ").filter((i) => i).length
        }
        
        // Display total words
        _totalWords.textContent = quoteWords
        // Set the timer
        this.timer()
        // Set active class to Play btn
        // btnPlay.classList.add("active");
        // Enable the typing area
        input.setAttribute("tabindex", "0")
        input.removeAttribute("disabled")
        // Add set focus and Active class
        input.focus()
        input.classList.add("active")
  
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
                // Read it as a normal key
                const charTyped = String.fromCharCode(charCode)
                // Compare the pressed key to the quote letter
                if (charTyped === this.quote.charAt(this.index)) {
                    // Detect the spaces by white space " "  or the key code(32) - Double check both ways
                    if (charTyped === " " && charCode === 32) {
                        this.words++
                        // Update number of written words
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
                        this.stop()
                        this.finish()
                        return
                    }
                } else {
                    // Add the errors into the output div
                    output.innerHTML += `<span class="text-danger">${charTyped}</span>`
                    // Increment the key mistakes
                    this.errorIndex++
                    // Add error counter to the dom
                    _errors.textContent = this.errorIndex
                    // Decrement the correct keys counter
                    this.correctIndex--
                }
                //const rawcpm  = Math.floor(this.index / this.seconds * 60);
                // CPM counter
                this.cpm = this.correctIndex > 5 ? Math.floor((this.correctIndex / this.duration) * 60) : 0
                // Add to the dom
                _cpm.textContent = this.cpm
                // WPM: (correct chars / total time * 60 / 5)
                this.wpm = Math.round(this.cpm / 5)
                _wpm.textContent = this.wpm
                // Accuracy: (Correct chars * 100 / total index)
                this.accuracyIndex = this.correctIndex > 5 ? Math.round((this.correctIndex * 100) / this.index) : 0
                // Add accuracy to the dom. We need to check it because division by 0 give us a special values (infinity, NaN)
                if (this.accuracyIndex > 0 && Number.isInteger(this.accuracyIndex)) _accuracy.innerHTML = `${this.accuracyIndex}<span class="small">%</span>`
            })
        }
    }
    // Stop the timer
    stop() {
        // Clear timer and set interval to null
        clearInterval(this.interval)
        this.interval = null
        // Just to be sure
        this.typing = false
        // Reset The Timer value to 0
        _timer.textContent = "0"
        // Remove the start btn
        btnPlay.remove()
        // Remove the input area
        input.remove()
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
            result = `So Slow! ${message} You should do more practice.`
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

const geolocation = (callback) => { 
  fetch(geoUrl).then((response) => {
    response.json().then((data) => {
      callback(undefined, data)
    })
  })
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
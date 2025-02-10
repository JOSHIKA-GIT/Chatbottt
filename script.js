const stateMappings = {
    "tn": "tamil nadu",
    "mh": "maharashtra",
    "dl": "delhi",
    "wb": "west bengal",
    "up": "uttar pradesh",
    "ka": "karnataka",
    "rj": "rajasthan",
    "gj": "gujarat",
    "ap": "andhra pradesh",
    "ut": "union territories"
};

const states = {
    "tamil nadu": ["Government Museum Chennai", "DakshinaChitra Museum"],
    "maharashtra": ["Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", "Dr. Bhau Daji Lad Museum"],
    "delhi": ["National Museum", "Indira Gandhi Memorial Museum"],
    "west bengal": ["Indian Museum Kolkata", "Victoria Memorial Hall"],
    "uttar pradesh": ["State Museum Lucknow", "Allahabad Museum"],
    "karnataka": ["Visvesvaraya Industrial Museum", "HAL Heritage Centre"],
    "rajasthan": ["Albert Hall Museum", "Jantar Mantar Museum"],
    "gujarat": ["Maharaja Fateh Singh Museum", "Calico Museum of Textiles"],
    "andhra pradesh": ["Salar Jung Museum", "Victoria Jubilee Museum"],
    "union territories": ["National Gallery of Modern Art Delhi", "Goa State Museum"]
};

let step = 0;
let userData = {
    state: "",
    museum: "",
    adults: 0,
    kids: 0,
    name: "",
    mobile: "",
    email: "",
    specialRequirements: ""
};

const chat = document.getElementById("chat");

function appendMessage(message, type) {
    const div = document.createElement("div");
    div.classList.add(type);
    div.innerHTML = message;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function processMessage() {
    const userMessage = document.getElementById("userMessage").value.trim();
    if (!userMessage) return;

    appendMessage(userMessage, "user-message");
    document.getElementById("userMessage").value = '';

    switch (step) {
        case 0: welcomeMessage(); break;
        case 1: askForState(); break;
        case 2: handleStateSelection(userMessage); break;
        case 3: askForMuseum(); break;
        case 4: handleMuseumSelection(userMessage); break;
        case 5: askForAdults(); break;
        case 6: handleAdultsInput(userMessage); break;
        case 7: askForKids(); break;
        case 8: handleKidsInput(userMessage); break;
        case 9: askForName(); break;
        case 10: handleNameInput(userMessage); break;
        case 11: askForMobile(); break;
        case 12: handleMobileInput(userMessage); break;
        case 13: askForEmail(); break;
        case 14: handleEmailInput(userMessage); break;
        case 15: askForSpecialRequirements(); break;
        case 16: handleSpecialRequirements(userMessage); break;
        case 17: showTotalCost(); break;
    }
}

function welcomeMessage() {
    step++;
    appendMessage("Welcome to the chatbot ticket booking system!", "bot-message");
    setTimeout(askForState, 1500);
}

function askForState() {
    appendMessage("Please select a state (Full Name, Short Form, or Partial Name):", "bot-message");
    appendMessage(Object.keys(states).join(", "), "bot-message");
    step++;
}

function findMatchingState(input) {
    input = input.toLowerCase().trim();

    // Check if input is a short form
    if (stateMappings[input]) {
        return stateMappings[input];
    }

    // Check for full name match
    if (states[input]) {
        return input;
    }

    // Check for partial match
    const matchedState = Object.keys(states).find(state => state.includes(input));
    return matchedState || null;
}

function handleStateSelection(state) {
    const matchedState = findMatchingState(state);

    if (matchedState) {
        userData.state = matchedState;
        step++;
        askForMuseum();
    } else {
        appendMessage("Invalid state. Please enter a valid state name, short form, or partial name.", "bot-message");
    }
}

function askForMuseum() {
    appendMessage(`You selected ${userData.state}. Now, please select a museum:`, "bot-message");
    appendMessage(states[userData.state].join(", "), "bot-message");
    step++;
}

function handleMuseumSelection(museum) {
    let normalizedMuseum = museum.toLowerCase().trim();
    const matchingMuseum = states[userData.state].find(m => m.toLowerCase().includes(normalizedMuseum));

    if (matchingMuseum) {
        userData.museum = matchingMuseum;
        step++;
        askForAdults();
    } else {
        appendMessage("Invalid museum. Please select from the list.", "bot-message");
    }
}

function askForAdults() {
    appendMessage("How many adults?", "bot-message");
    step++;
}

function handleAdultsInput(input) {
    if (isNaN(input) || input < 1) {
        appendMessage("Please enter a valid number of adults.", "bot-message");
    } else {
        userData.adults = parseInt(input);
        step++;
        askForKids();
    }
}

function askForKids() {
    appendMessage("How many kids?", "bot-message");
    step++;
}

function handleKidsInput(input) {
    if (isNaN(input) || input < 0) {
        appendMessage("Please enter a valid number of kids.", "bot-message");
    } else {
        userData.kids = parseInt(input);
        step++;
        askForName();
    }
}

function askForName() {
    appendMessage("Please enter your name (only letters).", "bot-message");
    step++;
}

function handleNameInput(name) {
    if (/^[A-Za-z\s]+$/.test(name)) {
        userData.name = name;
        step++;
        askForMobile();
    } else {
        appendMessage("Invalid name. Please enter only letters.", "bot-message");
    }
}

function askForMobile() {
    appendMessage("Please enter your mobile number (10 digits).", "bot-message");
    step++;
}

function handleMobileInput(mobile) {
    if (/^\d{10}$/.test(mobile)) {
        userData.mobile = mobile;
        step++;
        askForEmail();
    } else {
        appendMessage("Invalid mobile number. Please enter 10 digits.", "bot-message");
    }
}

function askForEmail() {
    appendMessage("Please enter your email address.", "bot-message");
    step++;
}

function handleEmailInput(email) {
    if (/\S+@\S+\.\S+/.test(email)) {
        userData.email = email;
        step++;
        askForSpecialRequirements();
    } else {
        appendMessage("Invalid email address. Please enter a valid email.", "bot-message");
    }
}

function askForSpecialRequirements() {
    appendMessage("Please describe any special requirements you may have.", "bot-message");
    step++;
}

function handleSpecialRequirements(requirements) {
    userData.specialRequirements = requirements;
    step++;
    showTotalCost();
}

function showTotalCost() {
    const totalCost = (userData.adults * 100) + (userData.kids * 50);
    userData.totalCost = totalCost;

    appendMessage(`Total cost: ₹${totalCost}.`, "bot-message");

    // Generate Payment QR Code
    const qrContainer = document.createElement("div");
    qrContainer.innerHTML = `<p>Scan the QR code to complete payment:</p>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=your_upi_id@upi&pn=MuseumTicket&am=${totalCost}" alt="Payment QR Code">
    <p>Or <a href="upi://pay?pa=youupiid@upi&pn=MuseumTicket&am=${totalCost}" target="_blank">Click here</a> to pay.</p>`;
    
    qrContainer.classList.add("bot-message");
    chat.appendChild(qrContainer);

    step++;
}

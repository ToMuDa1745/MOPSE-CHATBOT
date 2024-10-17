document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbot = document.querySelector('.chatbot');
    const closeBtn = document.querySelector('.chatbot header .material-symbols-outlined');
    const sendBtn = document.querySelector('#send-btn');
    const inputField = document.querySelector('.chat-input textarea');
    const chatBox = document.querySelector('.Chatbot');

    let responses = []; // Store the intents dataset here
    let schools = []; // Store the school information here

    // Fetch the dataset.json file
    fetch('./dataset.json')
        .then(response => response.json())
        .then(data => {
            responses = data.intents; // Store the intents from the loaded dataset
            schools = data.schools; // Store the schools data
            console.log('Loaded intents:', responses); // Log the loaded intents
            console.log('Loaded schools:', schools); // Log the loaded schools
        })
        .catch(error => {
            console.error('Error loading dataset:', error);
        });

    // Toggle chatbot visibility when the button is clicked
    chatbotToggler.addEventListener('click', () => {
        chatbot.classList.toggle('show-chatbot');
    });

    // Close chatbot when the close button is clicked
    closeBtn.addEventListener('click', () => {
        chatbot.classList.remove('show-chatbot');
    });

    // Handle message sending
    sendBtn.addEventListener('click', () => {
        let message = inputField.value.trim();
        if (message) {
            let outgoingMessage = document.createElement('li');
            outgoingMessage.classList.add('chat', 'outgoing');
            outgoingMessage.innerHTML = `<p>${message}</p>`;
            chatBox.appendChild(outgoingMessage);

            inputField.value = ''; // Clear the input field

            // Auto scroll to the bottom
            chatBox.scrollTop = chatBox.scrollHeight;

            // Simulate bot response after sending a message
            setTimeout(() => {
                let botResponse = document.createElement('li');
                botResponse.classList.add('chat', 'incoming');

                let response = getBotResponse(message); // Get the bot response

                botResponse.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${response}</p>`;
                chatBox.appendChild(botResponse);

                // Auto scroll to the bottom
                chatBox.scrollTop = chatBox.scrollHeight;

            }, 1000); // Simulate delay for bot response
        }
    });

    // Function to match user message with patterns in dataset and get a response
    function getBotResponse(message) {
        console.log("User message:", message); // Debugging log

        message = message.toLowerCase(); // Convert to lowercase for case-insensitive matching

        // Check if responses dataset is loaded
        if (responses.length === 0) {
            console.error("No intents found, dataset might not have loaded correctly");
            return "Sorry, I don't have information on that.";
        }

        // Check for keywords indicating a school information request
        const schoolInfoKeywords = ["information about", "tell me about","how about", "can you provide", "what can you tell me", "provide information", "tell me", "give me"];
        const isSchoolInfoRequest = schoolInfoKeywords.some(keyword => message.includes(keyword));

        if (isSchoolInfoRequest) {
            let schoolMatch = matchSchool(message);
            if (schoolMatch) {
                if (message.includes("newsletter")) {
                    return `Latest Newsletter: ${schoolMatch.newsletter}`;
                }
                if (message.includes("events")) {
                    return `Upcoming Events:<br>${schoolMatch.events.join('<br>')}`;
                }
                return `School Name: ${schoolMatch.name}<br>
                        Address: ${schoolMatch.address}<br>
                        Principal: ${schoolMatch.principal}<br>
                        Motto: ${schoolMatch.motto}<br>
                        Contact Phone: ${schoolMatch.contact.phone}<br>
                        Contact Email: ${schoolMatch.contact.email}<br>
                        Programs Offered: ${schoolMatch.programs.join(', ')}`;
            } else {
                console.log("No school match found for the message."); // Debugging log
            }
        }

        
 // Match against the intents patterns for greetings
for (let intent of responses) {
    if (intent.tag === 'greeting') {
        for (let pattern of intent.patterns) {
            const regex = new RegExp(pattern.toLowerCase(), 'i'); // 'i' for case-insensitive
            if (regex.test(message)) {
                console.log("Matched intent:", intent.tag); // Debugging log
                return `Hello!👋.....I'm your school information assistant. Am here to assist you with all schools information here in Zimbabwe. Feel free to ask. So how can I help you today 😊?`; // Bot introduction message
            }
        }
    }
}


        console.log("No match found"); // Debugging log
        return "Sorry, I don't have information on that."; // Default response if no match is found
    }

    // Updated Function to match a school based on the user's message
    function matchSchool(message) {
        // Clean up the message by converting to lowercase and removing any extra spaces
        message = message.toLowerCase().trim();
        console.log("Matching school with message:", message); // Debugging log

        // Loop through all the schools in the dataset
        for (let school of schools) {
            let schoolNameLower = school.name.toLowerCase();

            // Check for a match if the user mentions part of the school name or the full name
            if (message.includes(schoolNameLower) || schoolNameLower.includes(message)) {
                console.log("Matched school:", school.name); // Debugging log
                return school; // Return the matched school
            }

            // Additionally, check if the first part of the school name matches
            const firstName = school.name.split(' ')[0].toLowerCase();
            if (message.includes(firstName)) {
                console.log("Partially matched school:", school.name); // Debugging log
                return school; // Return the matched school
            
            }


        }

        console.log("No school matches found."); // Debugging log
        return null; // Return null if no school matches
    }
});

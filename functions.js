// --- SIMULATED BACKEND API ---

/**
 * A simple rule-based chatbot that returns a response based on keywords in the user's message.
 * @param {string} userMessage - The message sent by the user.
 * @returns {Promise<string>} A promise that resolves with the bot's response.
 */
function getBotResponse(userMessage) {
    return new Promise(resolve => {
        const message = userMessage.toLowerCase();
        let response = "I'm not sure how to answer that. Type 'help' for a list of commands.";

        const responses = {
            'hello': "Hello there! I'm the Serenity Bot. How can I help you on your mindfulness journey today?",
            'hi': "Hello there! I'm the Serenity Bot. How can I help you on your mindfulness journey today?",
            'mood': "Tracking your mood is a great first step. Try creating an entry in your journal to reflect on how you're feeling.",
            'feeling': "Tracking your mood is a great first step. Try creating an entry in your journal to reflect on how you're feeling.",
            'breathing': "When you're feeling anxious, a deep breathing exercise can be very calming. You can find it in the Mindfulness section.",
            'anxious': "When you're feeling anxious, a deep breathing exercise can be very calming. You can find it in the Mindfulness section.",
            'stress': "It sounds like you're dealing with a lot. The Body Scan exercise is excellent for releasing tension. Give it a try!",
            'overwhelmed': "It sounds like you're dealing with a lot. The Body Scan exercise is excellent for releasing tension. Give it a try!",
            'help': "I can help with the following: \n- 'mood' or 'feeling'\n- 'breathing' or 'anxious'\n- 'stress' or 'overwhelmed'\n- 'support'",
            'support': "If you need immediate support, please check out the Resources section for professional help and hotlines. You're not alone.",
            'thank you': "You're very welcome! I'm here to help anytime.",
            'thanks': "You're very welcome! I'm here to help anytime."
        };

        for (const key in responses) {
            if (message.includes(key)) {
                response = responses[key];
                break;
            }
        }

        // Simulate a network delay
        setTimeout(() => {
            resolve(response);
        }, 800);
    });
}

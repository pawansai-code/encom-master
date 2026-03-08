import Groq from 'groq-sdk';

/**
 * Controller to handle chat requests
 */
export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Initialize Groq client
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful and expert AI Ninja Assistant for Eduverse. Provide concise, clear, and engaging answers.'
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            model: 'llama-3.3-70b-versatile', // Using a fast, highly capable model available on Groq
        });

        const botResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";

        return res.status(200).json({
            response: botResponse
        });

    } catch (error) {
        console.error('Error in chat controller:', error);
        return res.status(500).json({ error: 'Internal server error while processing message' });
    }
};

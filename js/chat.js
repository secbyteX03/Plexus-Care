import { supabase } from './auth.js';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userMessage');
const sendButton = document.getElementById('sendMessage');
const chatWidget = document.getElementById('chatWidget');

// Initialize chat
async function initChat() {
    // Load chat history if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await loadChatHistory(user.id);
    }
    
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners for chat
function setupEventListeners() {
    // Send message on button click
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }
    
    // Send message on Enter key
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }
    
    // Auto-resize textarea
    if (userInput) {
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
}

// Handle sending a message
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage('user', message);
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
        // Get AI response (this is a placeholder - you'll need to implement your AI integration)
        const aiResponse = await getAIResponse(message);
        
        // Remove typing indicator
        if (typingIndicator && typingIndicator.parentNode) {
            typingIndicator.parentNode.removeChild(typingIndicator);
        }
        
        // Add AI response to chat
        addMessage('ai', aiResponse);
        
        // Save message to database if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await saveMessageToDatabase(user.id, message, aiResponse);
        }
    } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Remove typing indicator
        if (typingIndicator && typingIndicator.parentNode) {
            typingIndicator.parentNode.removeChild(typingIndicator);
        }
        
        // Show error message
        addMessage('ai', "I'm sorry, I'm having trouble connecting to the server. Please try again later.");
    }
    
    // Scroll to bottom of chat
    scrollToBottom();
}

// Add a message to the chat
function addMessage(sender, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${content}</p>`;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Add typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    
    return typingDiv;
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get AI response (placeholder - implement your AI integration here)
async function getAIResponse(message) {
    // This is a simple mock response - replace with actual AI API call
    const responses = [
        "I understand you're feeling unwell. Can you tell me more about your symptoms?",
        "How long have you been experiencing these symptoms?",
        "I recommend drinking plenty of fluids and getting some rest. Would you like me to help you find a doctor?",
        "Based on your symptoms, it might be a good idea to consult with a healthcare professional.",
        "I'm here to help. Could you describe your symptoms in more detail?"
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a random response for now
    return responses[Math.floor(Math.random() * responses.length)];
}

// Save message to database
async function saveMessageToDatabase(userId, userMessage, aiResponse) {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([
                { 
                    user_id: userId,
                    content: userMessage,
                    is_ai_generated: false
                },
                {
                    user_id: userId,
                    content: aiResponse,
                    is_ai_generated: true
                }
            ]);
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving message to database:', error);
        throw error;
    }
}

// Load chat history from database
async function loadChatHistory(userId) {
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });
            
        if (error) throw error;
        
        // Clear existing messages
        chatMessages.innerHTML = '';
        
        // Add messages to chat
        if (messages && messages.length > 0) {
            messages.forEach(msg => {
                const sender = msg.is_ai_generated ? 'ai' : 'user';
                addMessage(sender, msg.content);
            });
        } else {
            // Add welcome message if no history
            addMessage('ai', "Hello! I'm your AI Health Assistant. How can I help you today?");
        }
        
        return messages;
    } catch (error) {
        console.error('Error loading chat history:', error);
        // Still show welcome message if there's an error
        addMessage('ai', "Hello! I'm your AI Health Assistant. How can I help you today?");
        return [];
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', initChat);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addMessage,
        getAIResponse,
        saveMessageToDatabase,
        loadChatHistory
    };
}

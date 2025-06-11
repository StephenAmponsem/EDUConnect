// Academic Q&A Website JavaScript

// Global Variables
let currentUser = null;
let questions = [];
let currentQuestion = null;
let aiAssistantActive = false;

// Sample Data
const sampleQuestions = [
    {
        id: 1,
        title: "How to solve quadratic equations using the quadratic formula?",
        description: "I'm having trouble understanding when and how to use the quadratic formula. Can someone explain the steps and provide an example?",
        category: "Mathematics",
        tags: ["Algebra"],
        author: "Stephen",
        authorType: "Student",
        date: new Date("2025-06-29"),
        answers: [
            {
                id: 1,
                content: "The quadratic formula is ax² + bx + c = 0, where x = (-b ± √(b²-4ac)) / 2a. First, identify your a, b, and c values, then substitute them into the formula.",
                author: "Amponsem",
                authorType: "Teacher",
                date: new Date("2025-06-29"),
                votes: 135,
                isAI: false
            }
        ],
        votes: 140,
        views: 142
    },
    
    {
        id: 2,
        title: "What is the difference between a Computer Progam and Computer Programming?",
        description: "I want to understand the difference between a Computer program and Computer Programming .",
        category: "Computer Science",
        tags: ["Programming"],
        author: "Stephen",
        authorType: "Student",
        date: new Date("2025-06-22"),
        answers: [
            {
                id: 2,
                content: "A Computer program is a set of instructions for a computer to follow whiles Computer programming is the act of writting a computer program.",
                author: "Programming Professor",
                authorType: "Professor",
                date: new Date("2025-06-22"),
                votes: 200,
                isAI: false
            }
        ],
        votes: 210,
        views: 234
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadQuestions();
    attachEventListeners();
});

function initializeApp() {
    questions = [...sampleQuestions];
    currentUser = {
        name: "Demo User",
        type: "student",
        id: "demo123"
    };
}

function attachEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Question form
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', handleQuestionSubmit);
    }

    // AI Assistant
    const getAIHelpBtn = document.getElementById('getAIHelp');
    if (getAIHelpBtn) {
        getAIHelpBtn.addEventListener('click', showAIAssistant);
    }

    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                askAI();
            }
        });
    }

    // Filters
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterQuestions);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterQuestions);
    }

    // Modal close on outside click
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('questionModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

function handleNavigation(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href').substring(1);
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    e.target.classList.add('active');
    
    // Show/hide sections
    showSection(target);
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show hero section for home
    if (sectionName === 'home') {
        document.querySelector('.hero-section').style.display = 'block';
        document.getElementById('questions-list').classList.remove('hidden');
    } else if (sectionName === 'questions') {
        document.querySelector('.hero-section').style.display = 'none';
        document.getElementById('questions-list').classList.remove('hidden');
    } else if (sectionName === 'ask') {
        document.querySelector('.hero-section').style.display = 'none';
        document.getElementById('ask-question').classList.remove('hidden');
    }
}

function showAskQuestion() {
    showSection('ask');
    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#ask') {
            link.classList.add('active');
        }
    });
}

function showQuestions() {
    showSection('questions');
    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#questions') {
            link.classList.add('active');
        }
    });
}

function loadQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    questions.forEach(question => {
        const questionCard = createQuestionCard(question);
        container.appendChild(questionCard);
    });
}

function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.onclick = () => openQuestionModal(question);
    
    const answersCount = question.answers ? question.answers.length : 0;
    const isAnswered = answersCount > 0;
    
    card.innerHTML = `
        <div class="question-header">
            <div>
                <h3 class="question-title">${escapeHtml(question.title)}</h3>
                <div class="question-meta">
                    <span class="category-tag">${formatCategory(question.category)}</span>
                    <span class="question-date">${formatDate(question.date)}</span>
                    <span class="question-author">${escapeHtml(question.author)} (${question.authorType})</span>
                </div>
            </div>
            <div class="question-stats">
                <span><i class="fas fa-thumbs-up"></i> ${question.votes}</span>
                <span><i class="fas fa-comment"></i> ${answersCount}</span>
                <span><i class="fas fa-eye"></i> ${question.views}</span>
            </div>
        </div>
        <div class="question-preview">
            ${escapeHtml(question.description.substring(0, 150))}${question.description.length > 150 ? '...' : ''}
        </div>
        <div class="question-tags">
            ${question.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
    `;
    
    return card;
}

function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('questionTitle').value;
    const category = document.getElementById('questionCategory').value;
    const description = document.getElementById('questionDescription').value;
    const tags = document.getElementById('questionTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!title || !category || !description) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const newQuestion = {
        id: questions.length + 1,
        title,
        description,
        category,
        tags,
        author: currentUser.name,
        authorType: currentUser.type,
        date: new Date(),
        answers: [],
        votes: 0,
        views: 0
    };
    
    questions.unshift(newQuestion);
    loadQuestions();
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showNotification('Question posted successfully!', 'success');
    
    // Navigate back to questions
    showQuestions();
}

function openQuestionModal(question) {
    currentQuestion = question;
    
    // Increment views
    question.views++;
    
    const modal = document.getElementById('questionModal');
    const modalTitle = document.getElementById('modalQuestionTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDate = document.getElementById('modalDate');
    const modalAuthor = document.getElementById('modalAuthor');
    const modalContent = document.getElementById('modalContent');
    const modalTags = document.getElementById('modalTags');
    const answersContainer = document.getElementById('answersContainer');
    
    modalTitle.textContent = question.title;
    modalCategory.textContent = formatCategory(question.category);
    modalCategory.className = 'category-tag';
    modalDate.textContent = formatDate(question.date);
    modalAuthor.textContent = `${question.author} (${question.authorType})`;
    modalContent.textContent = question.description;
    
    modalTags.innerHTML = question.tags.map(tag => 
        `<span class="tag">${escapeHtml(tag)}</span>`
    ).join('');
    
    // Load answers
    answersContainer.innerHTML = '';
    if (question.answers && question.answers.length > 0) {
        question.answers.forEach(answer => {
            const answerCard = createAnswerCard(answer);
            answersContainer.appendChild(answerCard);
        });
    } else {
        answersContainer.innerHTML = '<p>No answers yet. Be the first to answer!</p>';
    }
    
    modal.style.display = 'block';
}

function createAnswerCard(answer) {
    const card = document.createElement('div');
    card.className = 'answer-card';
    
    const aiIndicator = answer.isAI ? '<span class="ai-indicator"><i class="fas fa-robot"></i> AI Answer</span>' : '';
    
    card.innerHTML = `
        <div class="answer-meta">
            <span>${escapeHtml(answer.author)} (${answer.authorType}) ${aiIndicator}</span>
            <span>${formatDate(answer.date)}</span>
            <span><i class="fas fa-thumbs-up"></i> ${answer.votes}</span>
        </div>
        <div class="answer-content">
            ${escapeHtml(answer.content)}
        </div>
    `;
    
    return card;
}

function closeModal() {
    const modal = document.getElementById('questionModal');
    modal.style.display = 'none';
    currentQuestion = null;
}

function submitAnswer() {
    const answerText = document.getElementById('answerText');
    const content = answerText.value.trim();
    
    if (!content) {
        alert('Please enter your answer.');
        return;
    }
    
    if (!currentQuestion) return;
    
    const newAnswer = {
        id: (currentQuestion.answers?.length || 0) + 1,
        content,
        author: currentUser.name,
        authorType: currentUser.type,
        date: new Date(),
        votes: 0,
        isAI: false
    };
    
    if (!currentQuestion.answers) {
        currentQuestion.answers = [];
    }
    
    currentQuestion.answers.push(newAnswer);
    
    // Update the question in the main array
    const questionIndex = questions.findIndex(q => q.id === currentQuestion.id);
    if (questionIndex !== -1) {
        questions[questionIndex] = currentQuestion;
    }
    
    // Refresh the modal
    openQuestionModal(currentQuestion);
    
    // Clear the answer text
    answerText.value = '';
    
    showNotification('Answer posted successfully!', 'success');
}

function filterQuestions() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    let filteredQuestions = [...questions];
    
    // Filter by category
    if (categoryFilter) {
        filteredQuestions = filteredQuestions.filter(q => q.category === categoryFilter);
    }
    
    // Sort questions
    switch (sortFilter) {
        case 'recent':
            filteredQuestions.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'popular':
            filteredQuestions.sort((a, b) => b.votes - a.votes);
            break;
        case 'unanswered':
            filteredQuestions = filteredQuestions.filter(q => !q.answers || q.answers.length === 0);
            break;
    }
    
    // Update display
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    filteredQuestions.forEach(question => {
        const questionCard = createQuestionCard(question);
        container.appendChild(questionCard);
    });
}

// AI Assistant Functions
function showAIAssistant() {
    const aiPanel = document.getElementById('aiPanel');
    aiPanel.classList.add('active');
    aiAssistantActive = true;
    
    // Initialize AI conversation
    const aiContent = document.getElementById('aiContent');
    aiContent.innerHTML = `
        <div class="ai-message assistant">
            <p>Hello! I'm your AI assistant. I can help you with:</p>
            <ul>
                <li>Improving your question</li>
                <li>Suggesting relevant topics</li>
                <li>Providing study tips</li>
                <li>Finding similar questions</li>
            </ul>
            <p>How can I help you today?</p>
        </div>
    `;
}

function closeAI() {
    const aiPanel = document.getElementById('aiPanel');
    aiPanel.classList.remove('active');
    aiAssistantActive = false;
}

function askAI() {
    const aiInput = document.getElementById('aiInput');
    const userMessage = aiInput.value.trim();
    
    if (!userMessage) return;
    
    const aiContent = document.getElementById('aiContent');
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'ai-message user';
    userMessageDiv.innerHTML = `<p>${escapeHtml(userMessage)}</p>`;
    aiContent.appendChild(userMessageDiv);
    
    // Clear input
    aiInput.value = '';
    
    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-message assistant';
    loadingDiv.innerHTML = '<p><span class="loading"></span> Thinking...</p>';
    aiContent.appendChild(loadingDiv);
    
    // Scroll to bottom
    aiContent.scrollTop = aiContent.scrollHeight;
    
    // Simulate AI response
    setTimeout(() => {
        loadingDiv.remove();
        const aiResponse = generateAIResponse(userMessage);
        
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'ai-message assistant';
        aiMessageDiv.innerHTML = `<p>${aiResponse}</p>`;
        aiContent.appendChild(aiMessageDiv);
        
        aiContent.scrollTop = aiContent.scrollHeight;
    }, 1500);
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('improve') || message.includes('better')) {
        return "To improve your question, try to: 1) Be specific about what you're struggling with, 2) Include what you've already tried, 3) Add relevant context or examples, 4) Use clear and concise language.";
    } else if (message.includes('math') || message.includes('equation')) {
        return "For math questions, consider: 1) Showing your work so far, 2) Specifying which step you're stuck on, 3) Including the original problem statement, 4) Mentioning your grade level or course.";
    } else if (message.includes('science') || message.includes('biology') || message.includes('physics')) {
        return "For science questions: 1) Include diagrams if relevant, 2) Mention specific concepts you're confused about, 3) Provide context from your textbook or class, 4) Ask about practical applications.";
    } else if (message.includes('programming') || message.includes('code')) {
        return "For programming questions: 1) Include your code attempt, 2) Describe the expected vs actual output, 3) Mention the programming language, 4) Include any error messages you're getting.";
    } else if (message.includes('study') || message.includes('tips')) {
        return "Study tips: 1) Break complex topics into smaller parts, 2) Use active recall instead of just re-reading, 3) Teach concepts to others or explain them aloud, 4) Practice with varied examples.";
    } else {
        return "I'd be happy to help! Could you be more specific about what you need assistance with? You can ask about improving your question, study strategies, or subject-specific advice.";
    }
}

function getAIAnswer() {
    if (!currentQuestion) return;
    
    const aiContent = `Based on the question "${currentQuestion.title}", here's what I can help with:\n\n`;
    
    let aiResponse = '';
    
    switch (currentQuestion.category) {
        case 'mathematics':
            aiResponse = `${aiContent}For this math problem, I recommend: 1) Breaking it into steps, 2) Identifying the key formulas needed, 3) Working through similar examples first, 4) Checking your answer by substituting back into the original equation.`;
            break;
        case 'physics':
            aiResponse = `${aiContent}For this physics question: 1) Identify the given variables and what you need to find, 2) List relevant formulas, 3) Draw a diagram if applicable, 4) Check units in your final answer.`;
            break;
        case 'biology':
            aiResponse = `${aiContent}For this biology topic: 1) Start with basic definitions, 2) Understand the process step-by-step, 3) Look for patterns or cycles, 4) Connect to real-world examples.`;
            break;
        case 'computer-science':
            aiResponse = `${aiContent}For this programming concept: 1) Understand the problem requirements, 2) Plan your algorithm step-by-step, 3) Test with simple examples first, 4) Debug systematically.`;
            break;
        default:
            aiResponse = `${aiContent}I recommend: 1) Breaking the topic into smaller parts, 2) Looking for reliable sources, 3) Connecting new information to what you already know, 4) Practicing with examples.`;
    }
    
    // Add AI answer to the question
    const aiAnswer = {
        id: (currentQuestion.answers?.length || 0) + 1,
        content: aiResponse,
        author: "AI Assistant",
        authorType: "ai",
        date: new Date(),
        votes: 0,
        isAI: true
    };
    
    if (!currentQuestion.answers) {
        currentQuestion.answers = [];
    }
    
    currentQuestion.answers.push(aiAnswer);
    
    // Update the question in the main array
    const questionIndex = questions.findIndex(q => q.id === currentQuestion.id);
    if (questionIndex !== -1) {
        questions[questionIndex] = currentQuestion;
    }
    
    // Refresh the modal
    openQuestionModal(currentQuestion);
    
    showNotification('AI answer generated!', 'success');
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .ai-indicator {
        background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.8rem;
        margin-left: 10px;
    }
`;
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // or getFirestore for Firestore

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app); // or getFirestore(app)
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

// Sign Up
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("User signed up:", userCredential.user);
  })
  .catch((error) => {
    console.error(error.message);
  });

// Login
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("User logged in:", userCredential.user);
  })
  .catch((error) => {
    console.error(error.message);
  });
import { ref, set, get, child } from "firebase/database";
import { database } from "./firebase";

// Save user profile
set(ref(database, 'users/' + userId), {
  username: "JohnDoe",
  email: "john@example.com",
  role: "student"
});

// Read data
get(child(ref(database), `users/${userId}`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
});

document.head.appendChild(style);
// --- REFINED SCRIPT WITH CORRECTED NAVIGATION LOGIC ---

const app = {
    // --- STATE MANAGEMENT ---
    state: {
        journalEntries: [],
        currentAiTheme: 'Calm',
        lastGeneratedMoment: '',
        moods: [
            { name: 'Positive', icon: 'fa-smile-beam', text: "Your mood appears positive today! Keep up the great work." },
            { name: 'Neutral', icon: 'fa-meh', text: "Your mood seems neutral. Consider trying a mindfulness exercise." },
            { name: 'Negative', icon: 'fa-frown', text: "You might be feeling down. Remember you're not alone - we're here for you." },
            { name: 'Joyful', icon: 'fa-grin-stars', text: "You're having an excellent day! Share your positive energy with others." }
        ],
    },

    // --- DOM ELEMENT CACHING ---
    elements: {},

    // --- INITIALIZATION ---
    init() {
        this.cacheDomElements();
        this.setupEventListeners();
        this.checkLoginState(); // Check for existing login on page load
        this.loadJournalFromStorage();
        this.renderJournalEntries();
        this.setupScrollAnimations();
        this.setupMindfulnessAnimations();
        this.arrangeExercisesInCircle();
        this.setupInteractiveCursor();
        this.setupInteractiveBackgrounds();
        this.addBotWelcomeMessage();
    },

    cacheDomElements() {
        this.elements = {
            // General Elements
            navLinks: document.querySelectorAll('nav a'),
            cursor: document.querySelector('.cursor'),
            sections: document.querySelectorAll('main > .section-container'),
            // Journal
            journalForm: document.querySelector('.journal-form'),
            analyzeBtn: document.getElementById('analyze-btn'),
            moodResult: document.getElementById('mood-result'),
            moodIcon: document.getElementById('mood-icon'),
            moodText: document.getElementById('mood-text'),
            journalTextarea: document.getElementById('journal-entry'),
            journalList: document.getElementById('journal-list'),
            emptyJournalMessage: document.querySelector('.entry-empty'),
            // AI
            generateAiBtn: document.getElementById('generate-ai-btn'),
            aiLoadingEl: document.querySelector('.ai-loading'),
            aiOutputEl: document.getElementById('ai-output'),
            saveToJournalBtn: document.getElementById('save-to-journal-btn'),
            themeSelector: document.querySelector('.theme-selector'),
            // Mindfulness
            exerciseItems: document.querySelectorAll('.exercise-item'),
            // Auth & Profile
            authButtons: document.querySelector('.auth-buttons'),
            profileNavLink: document.getElementById('profile-nav-link'),
            profileSection: document.getElementById('profile'),
            loginBtn: document.getElementById('login-btn'),
            signupBtn: document.getElementById('signup-btn'),
            logoutBtn: document.getElementById('logout-btn'),
            loginModal: document.getElementById('login-modal'),
            signupModal: document.getElementById('signup-modal'),
            loginForm: document.getElementById('login-form'),
            signupForm: document.getElementById('signup-form'),
            profileNameDisplay: document.getElementById('profile-name-display'),
            profileEmailDisplay: document.getElementById('profile-email-display'),
            profileHomeBtn: document.getElementById('profile-home-btn'),
            // Chatbot
            chatbotFab: document.getElementById('chatbot-fab'),
            chatbotWindow: document.getElementById('chatbot-window'),
            closeChatbotBtn: document.getElementById('close-chatbot-btn'),
            chatbotBody: document.getElementById('chatbot-body'),
            chatbotForm: document.getElementById('chatbot-form'),
            chatbotInput: document.getElementById('chatbot-input'),
        };
    },

    setupEventListeners() {
        // Main Navigation
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-section');
                this.showView(targetId);
            });
        });

        // Profile Home Button
        this.elements.profileHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('home');
        });

        // Authentication Modals
        this.elements.loginBtn.addEventListener('click', () => this.openModal(this.elements.loginModal));
        this.elements.signupBtn.addEventListener('click', () => this.openModal(this.elements.signupModal));
        this.elements.logoutBtn.addEventListener('click', () => this.auth.logout());
        
        document.querySelectorAll('.modal .close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) this.closeModal(e.target);
        });

        this.elements.loginForm.addEventListener('submit', (e) => this.auth.handleLogin(e));
        this.elements.signupForm.addEventListener('submit', (e) => this.auth.handleSignup(e));

        // Chatbot
        this.elements.chatbotFab.addEventListener('click', () => this.chatbot.toggle());
        this.elements.closeChatbotBtn.addEventListener('click', () => this.chatbot.toggle(false));
        this.elements.chatbotForm.addEventListener('submit', (e) => this.chatbot.handleUserMessage(e));

        // Other features (Journal, AI, etc.)
        this.elements.journalForm.addEventListener('submit', (e) => this.handleJournalSubmit(e));
        this.elements.generateAiBtn.addEventListener('click', () => this.handleAiGenerate());
        this.elements.themeSelector.addEventListener('click', (e) => this.handleThemeSelection(e));
        this.elements.saveToJournalBtn.addEventListener('click', () => this.handleSaveToJournal());
    },
    
    // --- VIEW & NAVIGATION LOGIC ---
    showView(viewId) {
        const isProfileView = viewId === 'profile';

        // Toggle visibility of main sections vs. profile section
        this.elements.sections.forEach(section => {
            if (section.id === 'profile') {
                section.classList.toggle('hidden', !isProfileView);
            } else {
                section.classList.toggle('hidden', isProfileView);
            }
        });

        // Update active nav link
        this.elements.navLinks.forEach(link => {
            const isActive = link.getAttribute('data-section') === viewId;
            link.classList.toggle('active', isActive);
        });

        // Scroll to the section if it's not the profile view
        if (!isProfileView) {
            const targetElement = document.getElementById(viewId);
            if (targetElement) {
                // Using a timeout allows the DOM to update before scrolling
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 0);
            }
        }
    },
    
    // --- AUTHENTICATION & UI LOGIC ---
    auth: {
        handleLogin(e) {
            e.preventDefault();
            const email = e.target.email.value;
            // In a real app, you'd fetch this from a server.
            // Here, we simulate by checking if user data exists for this email.
            const userData = {
                fullName: 'ALok Kumar',
                email: email
            };
            
            localStorage.setItem('serenityUser', JSON.stringify(userData));
            app.closeModal(app.elements.loginModal);
            app.updateUiForLoginState(true, userData);
        },

        handleSignup(e) {
            e.preventDefault();
            const userData = {
                fullName: e.target.fullName.value,
                email: e.target.email.value
            };
            
            localStorage.setItem('serenityUser', JSON.stringify(userData));
            app.closeModal(app.elements.signupModal);
            app.updateUiForLoginState(true, userData);
        },

        logout() {
            localStorage.removeItem('serenityUser');
            app.updateUiForLoginState(false);
        }
    },

    checkLoginState() {
        const userData = JSON.parse(localStorage.getItem('serenityUser'));
        this.updateUiForLoginState(!!userData, userData);
    },

    updateUiForLoginState(isLoggedIn, userData = {}) {
        this.elements.authButtons.classList.toggle('hidden', isLoggedIn);
        this.elements.profileNavLink.classList.toggle('hidden', !isLoggedIn);

        if (isLoggedIn) {
            this.elements.profileNameDisplay.textContent = userData.fullName;
            this.elements.profileEmailDisplay.textContent = userData.email;
            this.showView('profile');
        } else {
            this.showView('home');
        }
    },
    
    openModal(modal) {
        modal.classList.remove('hidden');
    },

    closeModal(modal) {
        modal.classList.add('hidden');
    },

    chatbot: {
        isOpen: false,
        toggle(forceState) {
            this.isOpen = typeof forceState === 'boolean' ? forceState : !this.isOpen;
            app.elements.chatbotWindow.classList.toggle('hidden', !this.isOpen);
        },
        
        handleUserMessage(e) {
            e.preventDefault();
            const messageText = app.elements.chatbotInput.value.trim();
            if (!messageText) return;

            this.addMessage(messageText, 'user');
            app.elements.chatbotInput.value = '';

            getBotResponse(messageText).then(botResponse => {
                setTimeout(() => this.addMessage(botResponse, 'bot'), 500);
            });
        },

        addMessage(text, type) {
            const messageEl = document.createElement('div');
            messageEl.className = `chat-message ${type}`;
            messageEl.textContent = text;
            app.elements.chatbotBody.appendChild(messageEl);
            app.elements.chatbotBody.scrollTop = app.elements.chatbotBody.scrollHeight;
        }
    },
    
    addBotWelcomeMessage() {
        setTimeout(() => {
            this.chatbot.addMessage("Hello! I'm the Serenity Bot. How can I assist you today? Type 'help' to see what I can do.", 'bot');
        }, 1000);
    },

    // --- UI & DOM MANIPULATION ---
    setButtonLoadingState(isLoading) {
        this.elements.analyzeBtn.disabled = isLoading;
        this.elements.analyzeBtn.innerHTML = isLoading 
            ? `<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Analyzing...`
            : `<i class="fas fa-paper-plane" aria-hidden="true"></i> Analyze Mood`;
    },
    
    displayMoodResult(mood) {
        this.elements.moodIcon.innerHTML = `<i class="fas ${mood.icon}" aria-hidden="true"></i>`;
        this.elements.moodText.textContent = mood.text;
        this.elements.moodResult.classList.remove('hidden');
        this.elements.moodResult.style.display = 'flex';
        anime({
            targets: this.elements.moodResult,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutCubic'
        });
    },

    handleJournalSubmit(e) {
        e.preventDefault();
        const entryText = this.elements.journalTextarea.value.trim();
        if (!entryText) {
            alert('Please write something in your journal before analyzing.');
            return;
        }
        this.setButtonLoadingState(true);
        setTimeout(() => {
            const randomMood = this.state.moods[Math.floor(Math.random() * this.state.moods.length)];
            this.displayMoodResult(randomMood);
            this.addJournalEntry(entryText, randomMood);
            this.elements.journalTextarea.value = '';
            this.setButtonLoadingState(false);
        }, 1500);
    },
    
    handleThemeSelection(e) {
        const clickedBtn = e.target.closest('.theme-btn');
        if (!clickedBtn) return;
        
        this.elements.themeSelector.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
        this.state.currentAiTheme = clickedBtn.dataset.theme;
    },

    handleSaveToJournal() {
        if (!this.state.lastGeneratedMoment) return;
        const mood = { name: 'Mindful Moment', icon: 'fa-robot' };
        this.addJournalEntry(this.state.lastGeneratedMoment, mood);
        alert('Mindful moment saved to your journal!');
        anime({
            targets: this.elements.saveToJournalBtn,
            opacity: 0,
            duration: 300,
            easing: 'easeOutExpo',
            complete: () => {
                this.elements.saveToJournalBtn.classList.add('hidden');
                this.elements.saveToJournalBtn.style.display = 'none';
            }
        });
    },
    
    handleAiGenerate() {
        this.elements.aiOutputEl.style.opacity = 0;
        this.elements.aiLoadingEl.classList.remove('hidden');
        this.elements.saveToJournalBtn.classList.add('hidden');
        this.elements.generateAiBtn.disabled = true;

        setTimeout(() => {
            this.state.lastGeneratedMoment = this.getAiMindfulMoment(this.state.currentAiTheme);
            const p = document.createElement('p');
            p.textContent = this.state.lastGeneratedMoment;

            this.elements.aiOutputEl.innerHTML = '';
            this.elements.aiOutputEl.appendChild(p);
            
            this.elements.aiLoadingEl.classList.add('hidden');
            anime({
                targets: this.elements.aiOutputEl,
                opacity: 1,
                duration: 500,
                easing: 'easeOutExpo'
            });

            this.elements.saveToJournalBtn.classList.remove('hidden');
            this.elements.saveToJournalBtn.style.display = 'inline-flex';
            anime({
                targets: this.elements.saveToJournalBtn,
                opacity: [0, 1],
                translateY: [10, 0],
                duration: 400,
                easing: 'easeOutExpo',
                delay: 200
            });
            this.elements.generateAiBtn.disabled = false;
        }, 1800);
    },

    getAiMindfulMoment(theme) {
        const moments = {
            Calm: [
                "Find a quiet space. Close your eyes and take three deep, slow breaths. With each exhale, feel your body releasing tension.",
                "Notice the sensation of your feet on the floor. Feel the support of the ground beneath you. You are stable and grounded.",
                "Imagine a gentle, calming blue light filling your entire body, soothing every muscle and every thought as it goes.",
                "Listen to the sounds around you without judgment. Acknowledge them and let them pass like clouds in the sky."
            ],
            Focus: [
                "Gently bring your attention to your breath. Notice the coolness as you inhale and the warmth as you exhale. Do this for one minute.",
                "Pick an object in front of you. Observe its color, texture, shape, and size for 30 seconds as if you're seeing it for the first time.",
                "Before you begin your next task, state your intention clearly in your mind. For example, 'I will focus only on this email for 10 minutes.'",
                "Place your hand on your heart and feel its steady beat. This rhythm is your anchor to the present moment."
            ],
            Gratitude: [
                "Think of one person who has positively impacted your life. Hold them in your mind and silently send them your thanks.",
                "What is one simple pleasure you experienced today? A warm cup of coffee, a moment of sunshine? Savor that memory.",
                "Take a moment to be grateful for your body and all it allows you to do, from breathing to walking to experiencing the world.",
                "Look around you and find one thing you often take for granted. Acknowledge its value and feel a sense of appreciation for it."
            ]
        };
        const themePrompts = moments[theme] || moments['Calm'];
        return themePrompts[Math.floor(Math.random() * themePrompts.length)];
    },
    
    // --- JOURNAL LOGIC ---
    loadJournalFromStorage() {
        this.state.journalEntries = JSON.parse(localStorage.getItem('serenityJournalEntries')) || [];
    },

    saveJournalToStorage() {
        localStorage.setItem('serenityJournalEntries', JSON.stringify(this.state.journalEntries));
    },

    addJournalEntry(content, mood) {
        const newEntry = { content, mood, date: new Date().toISOString() };
        this.state.journalEntries.unshift(newEntry);
        this.renderJournalEntries();
        this.saveJournalToStorage();
    },

    renderJournalEntries() {
        this.elements.journalList.innerHTML = '';
        this.elements.emptyJournalMessage.style.display = this.state.journalEntries.length === 0 ? 'block' : 'none';
        this.state.journalEntries.forEach(entry => {
            const entryEl = this.createEntryElement(entry);
            this.elements.journalList.appendChild(entryEl);
        });
    },
    
    createEntryElement(entryData) {
        const entry = document.createElement('div');
        entry.className = 'entry';
        const formattedDate = new Date(entryData.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        entry.innerHTML = `
            <div class="entry-header">
                <div class="entry-date">${formattedDate}</div>
                <div class="entry-mood">
                    <i class="fas ${entryData.mood.icon}" aria-hidden="true"></i> ${entryData.mood.name}
                </div>
            </div>
            <div class="entry-content">${entryData.content.replace(/\n/g, '<br>')}</div>
        `;
        return entry;
    },
    
    // --- ANIMATIONS & INTERACTIONS ---
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    },

    setupMindfulnessAnimations() {
        this.elements.exerciseItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('flipped')) {
                     anime({ targets: item, rotateY: '180deg', duration: 600, easing: 'easeInOutSine' });
                    item.classList.add('flipped');
                }
            });
            item.addEventListener('mouseleave', () => {
                 if (item.classList.contains('flipped')) {
                    anime({ targets: item, rotateY: '0deg', duration: 600, easing: 'easeInOutSine' });
                    item.classList.remove('flipped');
                 }
            });
        });
    },

    arrangeExercisesInCircle() {
        const radius = 220;
        const container = document.querySelector('.exercise-list');
        if (!container) return;
        
        const items = container.querySelectorAll('.exercise-item');
        const total = items.length;
        const angleStep = (2 * Math.PI) / total;

        items.forEach((item, i) => {
            const angle = i * angleStep - (Math.PI / 2);
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));
            item.style.transform = `translate(${x}px, ${y}px)`;
        });
    },

    setupInteractiveCursor() {
        if (!this.elements.cursor) return;
        
        document.addEventListener('mousemove', e => {
            this.elements.cursor.style.left = e.clientX + 'px';
            this.elements.cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .exercise-item, .resource-card').forEach(el => {
            el.addEventListener('mouseenter', () => this.elements.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.elements.cursor.classList.remove('hover'));
        });
    },

    setupInteractiveBackgrounds() {
        // --- 1. Particle constellation for canvas backgrounds ---
        const createParticleAnimation = (canvasId) => {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            let particles = [];
            const particleCount = 50;
            const connectionDistance = 120;
            let animationFrameId;

            const resizeCanvas = () => {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            };

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.radius = Math.random() * 2 + 1;
                    this.vx = Math.random() * 0.4 - 0.2;
                    this.vy = Math.random() * 0.4 - 0.2;
                    this.color = 'rgba(93, 138, 168, 0.5)';
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > canvas.width) this.x = Math.random() * canvas.width;
                    if (this.y < 0 || this.y > canvas.height) this.y = Math.random() * canvas.height;
                }
            }

            const init = () => {
                resizeCanvas();
                particles = [];
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
                if (!animationFrameId) {
                    animate();
                }
            };

            const connectParticles = () => {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < connectionDistance) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(93, 138, 168, ${1 - distance / connectionDistance})`;
                            ctx.lineWidth = 0.3;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            };

            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                connectParticles();
                animationFrameId = requestAnimationFrame(animate);
            };

            window.addEventListener('resize', init);
            init();
        };

        // --- 2. Twinkling stars for div backgrounds ---
        const createStarryBackground = (containerId, starCount = 30) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                const size = Math.random() * 3 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 5}s`;
                star.style.animationDuration = `${Math.random() * 3 + 4}s`; // Slower twinkle
                container.appendChild(star);
            }
        };

        // --- Apply effects to the respective containers ---
        createStarryBackground('home-background');
        createParticleAnimation('journal-background');
        createStarryBackground('ai-background');
        createStarryBackground('mindfulness-background');
        createStarryBackground('resources-background');
    },
};

// --- START THE APP ---
document.addEventListener('DOMContentLoaded', () => app.init());


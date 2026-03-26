// État global du jeu
let gameState = {
    rage_leo: 0,
    suspicion: 0, // Suspicion générale de l'inspecteur
    suspicion_leo: 0, // Suspicion spécifique pointant vers Léo
    evidence: [],
    introStep: 0, // Étape de l'introduction linéaire
    decouverte: null, // Comment Léo a appris (sms, ouie)
    paranormal: 0, // Score d'étrangeté (POV Mathis)
    interrogated: {
        leo: false,
        chloe: false,
        mathis: false,
        sarah: false
    },
    chapter1TransitionPlayed: false,
    questionsAsked: [],
    currentNode: "start"
};

// Fonction de réinitialisation complète
function resetGame() {
    gameState.rage_leo = 0;
    gameState.suspicion = 0;
    gameState.suspicion_leo = 0;
    gameState.evidence = [];
    gameState.introStep = 0;
    gameState.decouverte = null;
    gameState.paranormal = 0;
    gameState.interrogated = { leo: false, chloe: false, mathis: false, sarah: false };
    gameState.chapter1TransitionPlayed = false;
    gameState.questionsAsked = [];
    gameState.currentNode = "start";
    
    console.clear();
    console.log("%c 🔄 PARTIE RÉINITIALISÉE - DOSSIER 404 ", "background: #ed4245; color: white; padding: 5px; border-radius: 3px;");
}

// Éléments du DOM
const storyTextEl = document.getElementById('story-text');
const choicesContainerEl = document.getElementById('choices-container');
const sceneTypeBadgeEl = document.getElementById('scene-type-badge');
const sceneImageEl = document.getElementById('scene-image');
const skipBtnEl = document.getElementById('skip-btn');

let typewriterInterval = null;

// Gestionnaire d'Assets (Image Loader)
const AssetManager = {
    basePaths: {
        backgrounds: "assets/images/backgrounds/",
        characters: "assets/images/characters/",
        flashbacks: "assets/images/flashbacks/"
    },
    // Fallback : pixel noir base64
    fallback: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",

    getSceneImage(nodeId, node) {
        // Mapping spécifique pour les suspects au Chapitre 1
        if (nodeId === "int_chloe_entry" || (node && node.suspect === "chloe" && nodeId.startsWith("int_chloe_"))) {
            return this.basePaths.characters + "chloe_room_nerveuse.jpg";
        }
        if (nodeId === "int_leo_entry" || (node && node.suspect === "leo" && nodeId.startsWith("int_leo_"))) {
            return this.basePaths.characters + "leo_room_neutre.jpg";
        }
        
        // Mapping général
        if (nodeId === "intro_summary") return this.basePaths.backgrounds + "rapport_synthese.jpg";
        if (nodeId === "intro_trombi") return this.basePaths.backgrounds + "trombinoscope_groupe.jpg";
        if (nodeId === "intro_scelles") return this.basePaths.backgrounds + "inventaire_scelles.jpg";
        if (nodeId === "intro_conclusion") return this.basePaths.backgrounds + "fermeture_dossier.jpg";
        if (nodeId.startsWith("intro_") || nodeId === "start") return this.basePaths.backgrounds + "intro_bureau.jpg";
        
        if (nodeId.startsWith("int_") || nodeId === "chapter1_start" || nodeId === "exit_room") {
            return this.basePaths.backgrounds + "room_shadow.jpg";
        }
        if (nodeId.startsWith("fb_")) return this.basePaths.flashbacks + "memory_blur.jpg";
        
        return this.fallback;
    },

    updateVisual(nodeId, node) {
        if (!sceneImageEl) return;
        
        const src = this.getSceneImage(nodeId, node);
        const gameContainer = document.getElementById('game-container');
        
        if (src === this.fallback) {
            gameContainer.classList.add('no-image');
            sceneImageEl.style.display = 'none';
        } else {
            gameContainer.classList.remove('no-image');
            sceneImageEl.style.display = 'block';
            sceneImageEl.style.opacity = 0;
            
            setTimeout(() => {
                sceneImageEl.src = src;
                sceneImageEl.onerror = () => { 
                    sceneImageEl.src = this.fallback;
                    gameContainer.classList.add('no-image');
                };
                sceneImageEl.onload = () => { sceneImageEl.style.opacity = 1; };
            }, 50);
        }
    }
};

// Fonction de logging générique pour le test (F12)
function logStateChange(category, value, detail = "") {
    const total = gameState[category];
    const color = value > 0 ? "#7289da" : "#ed4245";
    console.log(`%c LOG: ${category.toUpperCase()} ${value > 0 ? '+' : ''}${value} ${detail} (Total: ${total})`, `color: ${color}; font-weight: bold;`);
    
    if (category === 'evidence') {
        console.log(`%c INVENTAIRE PREUVES: [${gameState.evidence.join(', ')}]`, "color: #9e9e9e; font-style: italic;");
    }
}

// Fonction pour récupérer le texte dynamique basé sur l'état
function getDynamicText(node) {
    let baseText = (typeof node.text === 'function') ? node.text(gameState) : node.text;
    
    // Indices textuels pour l'immersion
    if (node.type === 'present') {
        if (gameState.suspicion + gameState.suspicion_leo > 15) baseText += " L'inspecteur se lève et fait les cent pas, son ombre plane sur vous.";
        else if (gameState.suspicion > 8) baseText += " L'inspecteur vous scrute en silence, tapotant son stylo.";
    }
    
    if (node.type === 'past') {
        if (gameState.rage_leo > 12) baseText += " Votre vision se trouble, une chaleur étouffante monte en vous.";
        else if (gameState.rage_leo > 6) baseText += " Vous sentez vos muscles se crisper violemment.";
    }

    return baseText;
}

// Animation typewriter
function typeWriter(text, element, speed, callback) {
    if (typewriterInterval) clearInterval(typewriterInterval);
    element.textContent = "";
    skipBtnEl.classList.remove('hidden');
    
    let i = 0;
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            finishTypewriter();
        }
    };

    typewriterInterval = setInterval(type, speed);

    const finishTypewriter = () => {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        element.textContent = text;
        skipBtnEl.classList.add('hidden');
        if (callback) callback();
    };

    skipBtnEl.onclick = finishTypewriter;
}

// Moteur de rendu des nœuds
function renderNode(nodeId) {
    const node = storyNodes[nodeId];
    if (!node) return;

    // Transition Spéciale : Écran de titre du Chapitre 1
    if (nodeId === "chapter1_start" && !gameState.chapter1TransitionPlayed) {
        gameState.chapter1TransitionPlayed = true;
        showChapterTransition("CHAPITRE 1", "Les Ombres du Chalet", () => {
            proceedToNode(nodeId, node);
        });
        return;
    }

    proceedToNode(nodeId, node);
}

function showChapterTransition(title, subtitle, callback) {
    const titleScreen = document.getElementById('chapter-title-screen');
    const chapterNumEl = titleScreen.querySelector('.chapter-number');
    const chapterSubEl = titleScreen.querySelector('.chapter-subtitle');
    const gameContainer = document.getElementById('game-container');
    
    chapterNumEl.textContent = title;
    chapterSubEl.textContent = subtitle;
    
    // On masque tout sauf le visual pour l'immersion
    gameContainer.classList.add('loading');
    titleScreen.classList.remove('hidden');
    
    // 1. Fade-in (1s)
    setTimeout(() => {
        titleScreen.classList.add('visible');
    }, 50);

    // 2. Reste fixe (3s) + 1s fade-in = 4s total avant fade-out
    setTimeout(() => {
        // 3. Fade-out (1s)
        titleScreen.classList.remove('visible');
        
        setTimeout(() => {
            titleScreen.classList.add('hidden');
            callback();
        }, 1000);
    }, 4000);
}

function proceedToNode(nodeId, node) {
    const gameContainer = document.getElementById('game-container');
    
    // 1. On masque instantanément
    gameContainer.classList.add('loading');
    
    // 2. On attend un tout petit délai pour laisser le navigateur placer les éléments dans le noir
    setTimeout(() => {
        gameState.currentNode = nodeId;
        sceneTypeBadgeEl.textContent = node.type === 'past' ? "Souvenir / Flash-back" : "Interrogatoire en cours";
        
        // Mise à jour de l'image
        AssetManager.updateVisual(nodeId, node);

        // Afficher les choix IMMÉDIATEMENT
        renderChoices(node);

        const fullText = getDynamicText(node);
        
        // Animation du texte
        typeWriter(fullText, storyTextEl, 40); // Vitesse du JSON
        
        // 4. On réaffiche proprement
        gameContainer.classList.remove('loading');
    }, 100);
}

function renderChoices(node) {
    choicesContainerEl.innerHTML = '';
    
    node.choices.forEach(choice => {
        if (choice.condition && !choice.condition(gameState)) return;

        const button = document.createElement('button');
        button.className = 'choice-btn';
        
        let label = (typeof choice.text === 'function') ? choice.text(gameState) : choice.text;
        let isDisabled = false;

        if (choice.isFlashback) label = `👁️ ${label}`;
        
        if (node.id === "chapter1_start" && choice.suspect) {
            if (gameState.interrogated[choice.suspect]) {
                label = `✓ ${label}`;
                isDisabled = true;
            }
        } else if (choice.questionId) {
            if (gameState.questionsAsked.includes(choice.questionId)) {
                label = `• ${label}`;
                isDisabled = true;
            }
        }

        button.textContent = label;
        if (isDisabled) {
            button.disabled = true;
        }

        button.onclick = () => handleChoice(choice);
        choicesContainerEl.appendChild(button);
    });
}

// Gestionnaire de choix
function handleChoice(choice) {
    // Capturer l'ancien état pour les logs
    const oldState = { ...gameState };

    if (choice.questionId && !gameState.questionsAsked.includes(choice.questionId)) {
        gameState.questionsAsked.push(choice.questionId);
    }

    if (choice.update) choice.update(gameState);

    // Logs automatiques pour les changements
    ['rage_leo', 'suspicion', 'suspicion_leo', 'paranormal'].forEach(key => {
        if (gameState[key] !== oldState[key]) {
            logStateChange(key, gameState[key] - oldState[key]);
        }
    });

    if (gameState.evidence.length !== oldState.evidence.length) {
        logStateChange('evidence', 1, `(${gameState.evidence[gameState.evidence.length - 1]})`);
    }

    if (gameState.decouverte !== oldState.decouverte) {
        console.log(`%c LOG: DECOUVERTE = ${gameState.decouverte.toUpperCase()}`, "color: #f1c40f; font-weight: bold;");
    }

    renderNode(choice.nextId);
}

window.onload = () => {
    resetGame();
    renderNode(gameState.currentNode);
};
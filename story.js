const storyNodes = {
    // SCENE 0 : LE BUREAU DE L'INSPECTEUR (SÉQUENCE LINÉAIRE)
    "start": {
        id: "start",
        type: "present",
        text: "Bureau de l'Inspecteur. L'air est lourd.\nUn dossier scellé, légèrement humide, repose sur la table métallique.\nL'inspecteur vous fixe sans ciller :\n'Lisez tout. On ne commence rien tant que vous n'avez pas assimilé les faits.'",
        choices: [
            { text: "Continuer la lecture [📄]", nextId: "intro_summary" }
        ]
    },
    "intro_summary": {
        id: "intro_summary",
        type: "present",
        text: "L'encre est sèche, mais les mots sont clairs. \nLe rapport de gendarmerie ne laisse aucune place au doute : le huis clos était total. \nPersonne n'a pu entrer, personne n'a pu sortir.\n\n─── RAPPORT DE SYNTHÈSE ───\n\n📍 Lieu : Chalet 'Les Mélèzes', secteur isolé.\n🕒 Heure estimée : 04h00 du matin.\n❄️ Contexte : Tempête de neige majeure. Communications coupées. Secours arrivés avec 12h de retard.",
        choices: [
            { text: "Page suivante [📸]", nextId: "intro_trombi" }
        ]
    },
    "intro_trombi": {
        id: "intro_trombi",
        type: "present",
        text: "Les sourires sur ces photos sont figés pour l'éternité. Thomas, Julie, Kevin, Emma... quatre noms désormais barrés d'un trait rouge.\n\nIls sont entrés vivants dans ce chalet. Ils n'en sont jamais ressortis. Les quatre autres attendent dans la zone d'interrogatoire.\n\n─── ÉTAT DES VICTIMES ───\n\n❌ DÉCÉDÉS :\n• Thomas (Plaies multiples)\n• Julie (Retrouvée dans la cave)\n• Kevin (Corps dans la neige)\n• Emma (Traumatisme crânien)\n\n⚖️ EN GARDE À VUE :\n• Léo (Refuse de parler)\n• Chloé (État de choc)\n• Sarah (Étonnamment calme)\n• Mathis (Propos incohérents)",
        choices: [
            { text: "Page suivante [📦]", nextId: "intro_scelles" }
        ]
    },
    "intro_scelles": {
        id: "intro_scelles",
        type: "present",
        text: "C'est tout ce qu'il reste d'eux. \nDes objets froids, inertes, alignés sur une table en inox. \nDes pièces d'un puzzle qu'il faut maintenant reconstituer.\n\n─── INVENTAIRE DES SCELLÉS ───\n\n📦 Pièce n°1 : Le téléphone de Chloé (Écran brisé).\n📦 Pièce n°2 : L'appareil photo d'Emma (Carte SD manquante).\n📦 Pièce n°3 : Un mot froissé avec traces de sang.\n📦 Pièce n°4 : Planche de bois sculptée (Trouvée près du poêle).",
        choices: [
            { text: "Continuer [📁]", nextId: "intro_conclusion" }
        ]
    },
    "intro_conclusion": {
        id: "intro_conclusion",
        type: "present",
        text: "Les pages se referment. Les documents sont étudiés. Il est temps d'aller chercher la vérité, la vraie.",
        choices: [
            { text: "Entrer dans la zone d'interrogatoire", nextId: "chapter1_start" }
        ]
    },

    // CHAPITRE 1 : MENU INTERROGATOIRE
    "chapter1_start": {
        id: "chapter1_start",
        type: "present",
        text: "L'inspecteur consulte ses notes. 'Quatre survivants, quatre versions. Qui voulez-vous interroger ?'",
        choices: [
            { text: "Interroger Léo", nextId: "int_leo_entry", suspect: "leo" },
            { text: "Interroger Chloé", nextId: "int_chloe_entry", suspect: "chloe" },
            { text: "Interroger Mathis", nextId: "int_mathis_entry", suspect: "mathis" },
            { text: "Interroger Sarah", nextId: "int_sarah_entry", suspect: "sarah" },
            { 
                text: "PASSER AU CHAPITRE SUIVANT", 
                nextId: "chapter2_intro", 
                condition: (state) => Object.values(state.interrogated).every(v => v === true)
            }
        ]
    },

    // --- TRANSITION COMMUNE DE SORTIE ---
    "exit_room": {
        id: "exit_room",
        type: "present",
        text: "L'inspecteur : 'C'est noté. J'ai tout ce qu'il me faut pour le moment.' Vous quittez la salle d'interrogatoire.",
        choices: [
            { text: "[Retourner au Bureau]", nextId: "chapter1_start" }
        ]
    },

    // --- LÉO : LE POIDS DU DOUTE ---
    "int_leo_entry": {
        id: "int_leo_entry",
        type: "present",
        suspect: "leo",
        mood: "neutre",
        text: "Léo lève les yeux vers vous, il triture nerveusement un gobelet en carton vide. 'C'est quand que je peux rentrer ?'",
        choices: [
            { text: "Parlez-moi de votre relation avec Chloé.", nextId: "int_leo_q1", questionId: "leo_q1", isFlashback: false, mood: "inquiet" },
            { text: "Que faisiez-vous pendant que les autres s'installaient ?", nextId: "fb_leo", questionId: "leo_q2", isFlashback: true },
            { text: "On m'a dit que vous étiez furieux sur le perron.", nextId: "int_leo_q3", questionId: "leo_q3", isFlashback: false, mood: "colere" },
            { text: "[Terminer l'interrogatoire]", nextId: "exit_room", update: (state) => { state.interrogated.leo = true; } }
        ]
    },
    "int_leo_q1": {
        id: "int_leo_q1",
        type: "present",
        suspect: "leo",
        text: "Léo : 'On était heureux... enfin, je le pensais. On devait se marier l'été prochain.'",
        choices: [{ text: "Poser une autre question", nextId: "int_leo_entry", mood: "neutre" }]
    },
    "int_leo_q3": {
        id: "int_leo_q3",
        type: "present",
        suspect: "leo",
        mood: "colere",
        text: "Léo : 'Furieux ? Non, j'étais juste fatigué par la route.'",
        update: (state) => { state.suspicion += 3; },
        choices: [{ text: "Poser une autre question", nextId: "int_leo_entry", mood: "neutre" }]
    },
    "fb_leo": {
        id: "fb_leo",
        type: "past",
        text: "(POV LÉO) Le parking est plongé dans le silence. Vous déchargez les bagages du coffre. Le téléphone de Chloé, resté sur le siège passager, s'allume soudainement.",
        choices: [
            { 
                text: "Lire le SMS", 
                nextId: "fb_leo_sms",
                update: (state) => { state.rage_leo += 5; state.decouverte = 'sms'; }
            },
            { 
                text: "Reposer sans lire", 
                nextId: "fb_leo_ouie",
                update: (state) => { state.rage_leo += 2; state.decouverte = 'ouie'; }
            }
        ]
    },
    "fb_leo_sms": {
        id: "fb_leo_sms",
        type: "past",
        text: "Le message de Thomas s'affiche : 'Hâte d'être à ce soir au chalet...'. Vos mains tremblent. La haine vous envahit.",
        choices: [{ text: "Fin du souvenir (Retour)", nextId: "exit_room", update: (state) => { state.interrogated.leo = true; } }]
    },
    "fb_leo_ouie": {
        id: "fb_leo_ouie",
        type: "past",
        text: "Vous hésitez, puis reposez l'appareil. En rentrant dans le chalet, vous entendez Thomas rire avec complicité à l'étage. Une boule se forme dans votre ventre.",
        choices: [{ text: "Fin du souvenir (Retour)", nextId: "exit_room", update: (state) => { state.interrogated.leo = true; } }]
    },

    // --- CHLOÉ : LE SECRET DES ESCALIERS ---
    "int_chloe_entry": {
        id: "int_chloe_entry",
        type: "present",
        suspect: "chloe",
        text: "Chloé Dubois est assise en face de vous. Elle ne vous regarde pas. Ses mains tremblent légèrement sur la table en inox. Elle semble terrifiée, mais est-ce de la culpabilité ou de la douleur ?",
        choices: [
            { text: "Quelle était la nature de votre lien avec Thomas ?", nextId: "int_chloe_q1", questionId: "chloe_q1", isFlashback: false },
            { text: "Que s'est-il passé à l'étage avec Thomas ?", nextId: "fb_chloe", questionId: "chloe_q2", isFlashback: true },
            { text: "Est-ce que Léo savait ?", nextId: "int_chloe_q3", questionId: "chloe_q3", isFlashback: false },
            { text: "[Terminer l'interrogatoire]", nextId: "exit_room", update: (state) => { state.interrogated.chloe = true; } }
        ]
    },
    "int_chloe_q1": {
        id: "int_chloe_q1",
        type: "present",
        text: "Chloé : 'C'était un ami, rien de plus. Il m'aidait juste à supporter Léo.'",
        choices: [{ text: "Poser une autre question", nextId: "int_chloe_entry" }]
    },
    "int_chloe_q3": {
        id: "int_chloe_q3",
        type: "present",
        text: "Chloé : 'Il ne savait rien. Il n'écoute jamais de toute façon.'",
        choices: [{ text: "Poser une autre question", nextId: "int_chloe_entry" }]
    },
    "fb_chloe": {
        id: "fb_chloe",
        type: "past",
        text: "(POV CHLOÉ) Vous êtes dans la chambre. Thomas entre 'pour vous aider avec votre valise'. Julie surveille le couloir, mais l'atmosphère est lourde de non-dits.",
        choices: [
            { 
                text: "Embrasser Thomas", 
                nextId: "fb_chloe_kiss",
                update: (state) => { state.suspicion += 3; }
            },
            { 
                text: "Repousser Thomas", 
                nextId: "fb_chloe_reject",
                update: (state) => { state.suspicion += 1; }
            }
        ]
    },
    "fb_chloe_kiss": {
        id: "fb_chloe_kiss",
        type: "past",
        text: "Vous prenez un risque immense. Thomas vous serre contre lui. Julie s'impatiente dans le couloir... Sarah a peut-être entendu quelque chose.",
        choices: [{ text: "Fin du souvenir (Retour)", nextId: "exit_room", update: (state) => { state.interrogated.chloe = true; } }]
    },
    "fb_chloe_reject": {
        id: "fb_chloe_reject",
        type: "past",
        text: "'Pas ici, Léo est juste en bas !' Thomas sort de la chambre, visiblement frustré.",
        choices: [{ text: "Fin du souvenir (Retour)", nextId: "exit_room", update: (state) => { state.interrogated.chloe = true; } }]
    },

    // --- SARAH : LE PAPIER FROISSÉ ---
    "int_sarah_entry": {
        id: "int_sarah_entry",
        type: "present",
        text: "Sarah est assise bien droite. Elle dégage une assurance troublante.",
        choices: [
            { text: "Comment décririez-vous l'ambiance au chalet ?", nextId: "int_sarah_q1", questionId: "sarah_q1", isFlashback: false },
            { text: "Avez-vous vu Thomas et Chloé ensemble ?", nextId: "fb_sarah", questionId: "sarah_q2", isFlashback: true },
            { text: "Quel est votre avis sur Léo ?", nextId: "int_sarah_q3", questionId: "sarah_q3", isFlashback: false },
            { text: "[Terminer l'interrogatoire]", nextId: "exit_room", update: (state) => { state.interrogated.sarah = true; } }
        ]
    },
    "int_sarah_q1": {
        id: "int_sarah_q1",
        type: "present",
        text: "Sarah : 'Électrique. Comme si un orage couvait à l'intérieur de chacun.'",
        choices: [{ text: "Poser une autre question", nextId: "int_sarah_entry" }]
    },
    "int_sarah_q3": {
        id: "int_sarah_q3",
        type: "present",
        text: "Sarah : 'Léo ? Un volcan qui attend son heure. Il ne voit rien, ou il fait semblant.'",
        choices: [{ text: "Poser une autre question", nextId: "int_sarah_entry" }]
    },
    "fb_sarah": {
        id: "fb_sarah",
        type: "past",
        text: "(POV SARAH) Vous rangez les courses dans le couloir. Vous voyez un petit papier tomber de la poche de Thomas quand il monte rejoindre Chloé à l'étage.",
        choices: [
            { 
                text: "Ramasser le papier", 
                nextId: "fb_sarah_pick",
                update: (state) => { state.evidence.push('mot_doux'); }
            },
            { 
                text: "Le laisser par terre", 
                nextId: "fb_sarah_leave",
                update: (state) => { state.suspicion_leo += 2; }
            }
        ]
    },
    "fb_sarah_pick": {
        id: "fb_sarah_pick",
        type: "past",
        text: "Vous lisez le mot doux. Vous le glissez dans votre poche. Un levier de chantage précieux.",
        choices: [{ text: "Fin du souvenir (Retour)", nextId: "exit_room", update: (state) => { state.interrogated.sarah = true; } }]
    },
    "fb_sarah_leave": {
        id: "fb_sarah_leave",
        type: "past",
        text: "Vous le piétinez par dépit. Léo finira sans doute par le trouver plus tard, et ce ne sera pas beau à voir.",
        choices: [{ text: "Fin du souvenir (Retour)", nextId: "exit_room", update: (state) => { state.interrogated.sarah = true; } }]
    },

    // --- MATHIS : L'OMBRE ET LE SAUCISSON ---
    "int_mathis_entry": {
        id: "int_mathis_entry",
        type: "present",
        text: "Mathis tambourine sur la table. 'On en a pour longtemps ?'",
        choices: [
            { text: "Avez-vous remarqué des tensions particulières ?", nextId: "int_mathis_q1", questionId: "mathis_q1", isFlashback: false },
            { text: "Racontez-moi votre premier soir à la cuisine.", nextId: "fb_mathis", questionId: "mathis_q2", isFlashback: true },
            { text: "Que pensez-vous du groupe ?", nextId: "int_mathis_q3", questionId: "mathis_q3", isFlashback: false },
            { text: "[Terminer l'interrogatoire]", nextId: "exit_room", update: (state) => { state.interrogated.mathis = true; } }
        ]
    },
    "int_mathis_q1": {
        id: "int_mathis_q1",
        type: "present",
        text: "Mathis : 'Léo et Thomas se lançaient des piques. J'ai essayé de détendre l'atmosphère.'",
        choices: [{ text: "Poser une autre question", nextId: "int_mathis_entry" }]
    },
    "int_mathis_q3": {
        id: "int_mathis_q3",
        type: "present",
        text: "Mathis : 'On était des potes, enfin c'est ce que je croyais avant que tout n'explose.'",
        choices: [{ text: "Poser une autre question", nextId: "int_mathis_entry" }]
    },
    "fb_mathis": {
        id: "fb_mathis",
        type: "past",
        text: "(POV MATHIS) Vous coupez le saucisson avec Kevin. Vous regardez par la fenêtre de la cuisine vers la lisière du bois sombre.",
        choices: [
            { 
                text: "Fixer la forêt", 
                nextId: "fb_mathis_forest",
                update: (state) => { state.paranormal += 1; }
            },
            { 
                text: "Ignorer et boire", 
                nextId: "fb_mathis_ignore",
                update: (state) => { state.paranormal += 0; }
            }
        ]
    },
    "fb_mathis_forest": {
        id: "fb_mathis_forest",
        type: "past",
        text: "Vous jurez voir une silhouette bouger. Kevin se moque de vous. Vous restez convaincu qu'un rôdeur est là.",
        choices: [{ text: "Fin du souvenir (Retour)", nextId: "exit_room", update: (state) => { state.interrogated.mathis = true; } }]
    },
    "fb_mathis_ignore": {
        id: "fb_mathis_ignore",
        type: "past",
        text: "Vous ne voyez rien. L'ambiance reste purement humaine, malgré les tensions du groupe.",
        choices: [{ text: "Fin du souvenir (Retour)", nextId: "exit_room", update: (state) => { state.interrogated.mathis = true; } }]
    },

    // FIN DE CHAPITRE
    "chapter2_intro": {
        id: "chapter2_intro",
        type: "present",
        text: "L'inspecteur se lève. 'Toutes ces versions concordent sur un point : Thomas était au centre de toutes les attentions. Mais les versions divergent sur ce qui s'est passé ensuite.'",
        choices: [
            { text: "Fin de la Démo (Recommencer)", nextId: "start", update: (state) => { resetGame(); } }
        ]
    }
};

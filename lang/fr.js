/* Textes du site en français. Voir lang/languages.js pour ajouter une langue. */
window.I18N = window.I18N || {};
window.I18N.fr = {
  meta: {
    title: "Dorian Gotty Michelson | Ingénieur Data Scientist",
    description: "Portfolio de Dorian Gotty Michelson, ingénieur data scientist à Toulouse : parcours, projets en IA et articles pour comprendre l’intelligence artificielle.",
    iaTitle: "Comprendre l’IA | Dorian Gotty Michelson",
    iaDescription: "Six articles illustrés de démonstrations interactives pour comprendre l’intelligence artificielle, sans prérequis."
  },

  nav: {
    skip: "Aller au contenu",
    about: "À propos",
    ai: "Comprendre l’IA",
    contact: "Contact",
    language: "Langue",
    menu: "Menu",
    themeDark: "Passer en thème sombre",
    themeLight: "Passer en thème clair"
  },

  hero: {
    role: "Ingénieur Data Scientist à Toulouse",
    intro: "Je conçois, entraîne et déploie des modèles d’intelligence artificielle, de la donnée brute jusqu’au tableau de bord qui aide à décider.",
    status: "Ingénieur diplômé du CESI Toulouse après trois ans d’alternance, je recherche un poste en data science ou en ingénierie IA.",
    ctaContact: "Me contacter",
    ctaCv: "Télécharger mon CV (PDF)",
    ctaAi: "Lire mes articles sur l’IA"
  },

  net: {
    aria: "Démonstration : un réseau de neurones apprend à séparer deux groupes de points",
    caption: "Ce petit réseau de neurones apprend en direct à séparer les points bleus des points orange. Cliquez dans le cadre pour ajouter des points et le voir s’adapter.",
    addA: "Ajouter des points bleus",
    addB: "Ajouter des points orange",
    reset: "Nouveau jeu de points",
    play: "Reprendre",
    pause: "Mettre en pause",
    iterations: "Itérations",
    accuracy: "Points bien classés"
  },

  sections: {
    experience: "Expériences",
    projects: "Projets",
    skills: "Compétences",
    education: "Formation",
    languages: "Langues",
    passions: "En dehors du code",
    contact: "Contact"
  },

  experience: [
    {
      org: "Occitaline",
      role: "Ingénieur en alternance, développeur et data scientist",
      period: "2023 – 2026",
      text: "Conception et entraînement de modèles d’IA en Python avec des frameworks de deep learning, gestion et traitement des données. Développement en C, C# et technologies web (HTML, CSS, JavaScript, PHP), gestion de bases de données SQL."
    },
    {
      org: "Météo France",
      role: "Ingénieur de recherche",
      period: "2025, 1 mois",
      text: "Intégration de modèles d’IA sur le superordinateur opérationnel : optimisation, déploiement et exécution dans un environnement Linux haute performance."
    },
    {
      org: "SafeSquare GmbH",
      role: "Développeur",
      period: "2025, 3 mois",
      text: "Développement d’un plug-in WPF (.NET, C#) qui scanne un réseau, détecte les modules connectés et configure leurs adresses IP. Travail sur les protocoles réseau et les interfaces desktop."
    }
  ],

  projects: [
    {
      title: "Maintenance prédictive de vannes de contrôle",
      context: "Projet de fin d’études",
      text: "Un modèle qui anticipe les défaillances à partir de capteurs de pression, de débit et de position. J’ai comparé plusieurs approches de détection d’anomalies et de prédiction de panne (XGBoost, Isolation Forest, LSTM), puis présenté les résultats dans un tableau de bord Power BI.",
      tags: ["Python", "Pandas", "Scikit-learn", "XGBoost", "TensorFlow", "Power BI"],
      link: { href: "ia.html#panne", label: "Comprendre la maintenance prédictive" }
    },
    {
      title: "Génération automatique de légendes d’images",
      context: "Projet deep learning",
      text: "Architecture encodeur-décodeur : un réseau convolutif ResNet extrait les caractéristiques de l’image, puis un LSTM avec mécanisme d’attention écrit la légende. Entraîné sur MS COCO, évalué avec le score BLEU et comparé au modèle BLIP via Hugging Face.",
      tags: ["PyTorch", "ResNet", "LSTM", "Attention", "Hugging Face"],
      link: { href: "ia.html#vision", label: "Comprendre comment l’IA voit une image" }
    },
    {
      title: "Logiciel de gestion de tâches",
      context: "Projet logiciel",
      text: "Application pour créer, affecter, prioriser et suivre des tâches. Interface WPF en architecture MVVM, données stockées dans SQL Server via Entity Framework Core, tests unitaires xUnit et versionnage Git.",
      tags: ["C#", ".NET", "WPF", "MVVM", "SQL Server", "xUnit"]
    }
  ],

  skills: [
    { name: "IA et data", items: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "XGBoost", "Pandas", "Hugging Face", "Power BI"] },
    { name: "Développement", items: ["C", "C#", ".NET", "WPF", "JavaScript", "HTML / CSS", "PHP"] },
    { name: "Données et outils", items: ["SQL", "SQL Server", "Entity Framework Core", "Git", "Linux", "Calcul haute performance"] }
  ],

  education: [
    { school: "CESI Toulouse", degree: "Diplôme d’ingénieur, cycle préparatoire intégré", period: "2021 – 2026" },
    { school: "IPSA Toulouse", degree: "Cursus en école d’ingénieurs", period: "2020 – 2021" },
    { school: "Lycée Françoise, Tournefeuille", degree: "Baccalauréat scientifique", period: "2017 – 2020" }
  ],

  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "B2" },
    { name: "Espagnol", level: "B1" }
  ],

  passions: [
    { title: "Batterie", text: "Quinze ans de batterie et deux groupes de musique m’ont appris à travailler en équipe : écouter les autres, tenir un rythme commun et trouver ma place dans un ensemble." },
    { title: "Course à pied", text: "Je suis marathonien. La course m’a appris que, pour être bon en équipe, il faut d’abord être solide seul : sinon, on freine les autres, qui attendent qu’on maîtrise sa propre spécialité." },
    { title: "Stand-up", text: "Monter sur scène m’a rendu à l’aise à l’oral. C’est un atout que je retrouve dans ma vie professionnelle, pour présenter un projet ou expliquer un résultat technique." }
  ],

  contact: {
    intro: "Une offre, une question sur un projet ou sur un article ? Écrivez-moi avec ce formulaire ou directement par email.",
    name: "Nom",
    email: "Email",
    message: "Message",
    send: "Envoyer le message",
    sending: "Envoi en cours…",
    sent: "Message envoyé. Merci, je vous réponds dès que possible.",
    error: "Le message n’est pas parti. Réessayez, ou écrivez-moi directement à l’adresse email ci-contre.",
    invalid: "Renseignez votre nom, un email valide et un message.",
    mailto: "Votre messagerie s’ouvre avec le message prérempli : il ne reste qu’à l’envoyer.",
    direct: "Me joindre directement",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    cvLabel: "CV (PDF)"
  },

  footer: {
    made: "Site conçu et codé à la main en HTML, CSS et JavaScript."
  },

  ia: {
    title: "Comprendre l’IA",
    intro: "L’intelligence artificielle est partout, mais rarement expliquée. Voici six articles courts, du plus général au plus concret, pour comprendre ce qui se passe vraiment à l’intérieur. La plupart s’accompagnent d’une démonstration à manipuler.",
    toc: "Sommaire",
    outro: "Une question sur un de ces sujets, ou envie d’en voir un autre expliqué ici ?",
    outroLink: "Écrivez-moi",

    bases: {
      nav: "IA, machine learning, deep learning",
      title: "IA, machine learning, deep learning : qui est qui ?",
      lead: "Trois termes souvent employés comme synonymes. Ils désignent en réalité des cercles emboîtés.",
      body: `
<p>L’<strong>intelligence artificielle</strong> est le domaine le plus large : tout programme qui accomplit une tâche qu’on croyait réservée à l’humain, comme jouer aux échecs, traduire un texte ou reconnaître un visage. Les premiers systèmes suivaient des règles écrites à la main par des experts : « si la température dépasse 39 °C et que la toux persiste, alors… ».</p>
<p>Le <strong>machine learning</strong> (apprentissage automatique) change d’approche. Au lieu d’écrire les règles, on donne au programme des milliers d’exemples et il trouve lui-même les régularités. Pour filtrer les spams, on ne liste pas tous les mots suspects : on montre des emails déjà triés, et l’algorithme apprend à distinguer les deux.</p>
<p>Le <strong>deep learning</strong> (apprentissage profond) est une famille de méthodes de machine learning qui s’appuie sur des réseaux de neurones à nombreuses couches. C’est lui qui a permis les grands progrès récents en vision, en reconnaissance vocale et en génération de texte.</p>
<p>Enfin, l’<strong>IA générative</strong> (ChatGPT, générateurs d’images) est une application du deep learning : des modèles qui produisent un contenu nouveau au lieu de simplement classer ce qu’on leur donne.</p>`,
      diagram: {
        ai: "Intelligence artificielle",
        ml: "Machine learning",
        dl: "Deep learning",
        gen: "IA générative",
        caption: "Chaque cercle est un cas particulier de celui qui le contient."
      },
      after: `<p class="takeaway"><strong>À retenir :</strong> tout le deep learning est du machine learning, et tout le machine learning est de l’IA. L’inverse n’est pas vrai.</p>`
    },

    apprendre: {
      nav: "Comment une machine apprend",
      title: "Comment une machine apprend-elle ?",
      lead: "Pour une machine, apprendre, c’est ajuster des nombres jusqu’à ce que ses erreurs deviennent petites.",
      body: `
<p>Un modèle est une formule avec des réglages, qu’on appelle des <strong>paramètres</strong>. Le plus simple qui soit est une droite : <code>prédiction = a × x + b</code>. Il a deux paramètres : <code>a</code>, la pente, et <code>b</code>, la hauteur.</p>
<p>L’apprentissage suit toujours la même boucle :</p>
<ol>
  <li>le modèle fait une prédiction pour chaque exemple ;</li>
  <li>on mesure son <strong>erreur</strong> en la comparant à la bonne réponse ;</li>
  <li>on calcule dans quelle direction modifier chaque paramètre pour réduire cette erreur ;</li>
  <li>on fait un petit pas dans cette direction, puis on recommence.</li>
</ol>
<p>C’est la <strong>descente de gradient</strong>. Imaginez-vous en montagne dans le brouillard, à la recherche de la vallée : vous tâtez la pente sous vos pieds et faites un pas vers le bas, encore et encore.</p>
<p>La taille du pas s’appelle le <strong>taux d’apprentissage</strong>. Trop petit, l’apprentissage n’en finit pas. Trop grand, on enjambe la vallée et l’erreur explose. Essayez ci-dessous.</p>`,
      after: `<p>Un réseau de neurones comme celui de ChatGPT fonctionne exactement sur ce principe, mais avec des milliards de paramètres au lieu de deux, et une méthode de calcul automatique des directions appelée <strong>rétropropagation</strong>.</p>`
    },

    chatgpt: {
      nav: "Comment fonctionne ChatGPT",
      title: "Comment fonctionne ChatGPT ?",
      lead: "ChatGPT ne cherche pas la réponse dans une base de données. Il devine, mot après mot, la suite la plus probable.",
      body: `
<p>ChatGPT est un <strong>grand modèle de langage</strong> (LLM, pour <em>Large Language Model</em>). Il a d’abord été entraîné sur une immense quantité de textes avec une seule consigne : prédire le mot suivant. Plus précisément, il découpe le texte en petits morceaux appelés <strong>tokens</strong>, un mot ou un bout de mot.</p>
<p>Pour bien prédire la suite d’une phrase, il faut avoir capté énormément de choses : la grammaire, le sens des mots, des faits sur le monde, et même des raisonnements simples. C’est ce qui donne l’impression que le modèle « comprend ».</p>
<p>Quand vous posez une question, le modèle calcule une probabilité pour chaque token possible, en choisit un, l’ajoute au texte, puis recommence jusqu’à la fin de la réponse. Son architecture, le <strong>Transformer</strong>, repose sur un mécanisme d’<strong>attention</strong> qui relie chaque mot à tous ceux qui le précèdent, même éloignés.</p>
<p>Une seconde phase d’entraînement, guidée par des retours humains, lui apprend ensuite à répondre de façon utile plutôt qu’à simplement continuer le texte.</p>`,
      after: `<p>La <strong>température</strong> règle la part de hasard : basse, le modèle choisit presque toujours le mot le plus probable ; haute, il ose des mots moins attendus. C’est aussi pour cela qu’un modèle de langage peut affirmer avec aplomb quelque chose de faux : il produit ce qui est plausible, pas ce qui est vérifié.</p>`,
      model: {
        start: ["Le", "chat"],
        end: ".",
        table: {
          "chat": [["dort", 0.34], ["mange", 0.26], ["regarde", 0.22], ["joue", 0.18]],
          "dort": [["sur", 0.48], ["dans", 0.37], [".", 0.15]],
          "mange": [["sa", 0.55], ["une", 0.30], [".", 0.15]],
          "regarde": [["la", 0.50], ["les", 0.35], [".", 0.15]],
          "joue": [["avec", 0.70], ["dans", 0.20], [".", 0.10]],
          "sur": [["le", 0.60], ["la", 0.40]],
          "dans": [["le", 0.55], ["la", 0.45]],
          "avec": [["la", 0.50], ["les", 0.50]],
          "sa": [["gamelle", 0.70], ["souris", 0.30]],
          "une": [["souris", 0.60], ["croquette", 0.40]],
          "le": [["canapé", 0.50], ["jardin", 0.30], ["lit", 0.20]],
          "la": [["fenêtre", 0.45], ["pelote", 0.35], ["cuisine", 0.20]],
          "les": [["oiseaux", 0.60], ["mouches", 0.40]],
          "puis": [["dort", 0.40], ["mange", 0.30], ["joue", 0.30]]
        },
        fallback: [[".", 0.70], ["puis", 0.30]]
      }
    },

    vision: {
      nav: "Comment l’IA voit une image",
      title: "Comment l’IA voit-elle une image ?",
      lead: "Pour un ordinateur, une image n’est qu’un tableau de nombres. Tout l’enjeu est d’y retrouver des formes.",
      body: `
<p>Une photo est une grille de pixels, et chaque pixel est un nombre qui indique son intensité (trois nombres pour une image en couleur : rouge, vert, bleu). Une photo de smartphone, ce sont des millions de nombres.</p>
<p>Les <strong>réseaux de neurones convolutifs</strong> (CNN) analysent cette grille avec de petits <strong>filtres</strong> : des carrés de 3 × 3 nombres qu’on fait glisser sur toute l’image. À chaque position, on multiplie les pixels par les nombres du filtre et on additionne le tout. Le résultat est fort là où l’image ressemble au motif du filtre.</p>
<p>Les premières couches détectent des contours et des textures. Les suivantes combinent ces contours en formes (un œil, une roue), puis en objets entiers. La grande différence avec le traitement d’image classique : le réseau ne reçoit pas des filtres choisis à la main, il <strong>apprend</strong> lui-même ceux qui lui sont utiles pendant l’entraînement.</p>`,
      after: `<p>C’est sur ce principe que repose mon projet de génération de légendes : un CNN (ResNet) transforme l’image en une description numérique, puis un réseau de langage la traduit en une phrase comme « un chien court sur la plage ».</p>`
    },

    panne: {
      nav: "Prédire une panne",
      title: "Prédire une panne avant qu’elle arrive",
      lead: "Une machine qui va tomber en panne donne souvent des signes avant-coureurs. L’IA aide à les repérer à temps.",
      body: `
<p>Dans l’industrie, on fait traditionnellement la maintenance soit après la panne, ce qui coûte cher et peut être dangereux, soit à dates fixes, au risque de remplacer des pièces encore en bon état. La <strong>maintenance prédictive</strong> ouvre une troisième voie : surveiller l’état réel de l’équipement et intervenir au bon moment.</p>
<p>Des capteurs mesurent en continu la pression, le débit, la température ou les vibrations. Un modèle apprend à quoi ressemble le <strong>fonctionnement normal</strong>, puis signale tout ce qui s’en écarte : c’est la <strong>détection d’anomalies</strong>.</p>
<p>La méthode la plus simple calcule, à chaque instant, la moyenne et la dispersion (l’écart-type) des mesures récentes. Une valeur trop éloignée de la moyenne déclenche une alerte. Toute la difficulté est de régler le seuil : trop bas, on croule sous les fausses alertes ; trop haut, on rate les vraies pannes.</p>`,
      after: `<p>Dans mon projet de fin d’études sur des vannes de contrôle, j’ai comparé cette logique à des modèles plus avancés : <strong>Isolation Forest</strong>, qui isole les mesures atypiques, <strong>XGBoost</strong>, qui apprend à partir des pannes passées, et un réseau <strong>LSTM</strong>, capable de suivre l’évolution d’un signal dans le temps.</p>`
    },

    limites: {
      nav: "Limites et biais",
      title: "Les limites et les biais de l’IA",
      lead: "Une IA n’est ni neutre ni infaillible. Elle reflète ses données et ignore ce qu’elle ne sait pas.",
      body: `
<p><strong>Elle reproduit les biais de ses données.</strong> Un modèle apprend à partir d’exemples passés. Un outil de recrutement entraîné sur dix ans de CV majoritairement masculins risque d’apprendre qu’être un homme est un critère de réussite. C’est ce qui est arrivé à Amazon, qui a abandonné un tel outil en 2018.</p>
<p><strong>Elle peut se tromper avec assurance.</strong> Les modèles de langage produisent parfois des informations fausses mais parfaitement formulées, qu’on appelle des <strong>hallucinations</strong>. Ils génèrent du texte plausible sans vérifier les faits.</p>
<p><strong>Elle généralise mal hors de son terrain.</strong> Un modèle entraîné sur des photos prises de jour peut échouer la nuit. Un modèle de maintenance appris sur une machine neuve peut être dérouté par une machine usée.</p>
<p><strong>Elle est difficile à expliquer.</strong> Un réseau de neurones à des millions de paramètres ne justifie pas ses décisions. C’est un vrai problème en médecine ou en finance, et tout un champ de recherche, l’<strong>IA explicable</strong>, s’y consacre.</p>
<p><strong>Elle a un coût énergétique.</strong> Entraîner et faire tourner les grands modèles demande beaucoup de calcul, donc d’électricité, et d’eau pour refroidir les centres de données.</p>`,
      after: `<p class="takeaway"><strong>À retenir :</strong> une IA est un outil statistique puissant. Bien l’utiliser, c’est vérifier ses données, mesurer ses erreurs et garder un humain dans la boucle pour les décisions importantes.</p>`
    }
  },

  demo: {
    gradient: {
      title: "Ajuster une droite aux points",
      help: "Lancez l’entraînement et regardez la droite se placer. Augmentez ensuite fortement le taux d’apprentissage et recommencez.",
      step: "Faire un pas",
      train: "Entraîner",
      stop: "Arrêter",
      reset: "Recommencer",
      lr: "Taux d’apprentissage",
      steps: "Pas",
      error: "Erreur moyenne",
      model: "Modèle",
      diverged: "L’erreur explose : le pas est trop grand, le modèle saute par-dessus la solution.",
      converged: "L’erreur ne baisse presque plus : le modèle a trouvé sa meilleure droite.",
      aria: "Graphique : points de données et droite ajustée par descente de gradient"
    },
    nextword: {
      title: "Prédire le mot suivant",
      help: "Ce mini-modèle ne connaît qu’une trentaine de mots, mais il fonctionne sur le même principe. Cliquez sur un mot, ou laissez le modèle tirer au sort selon les probabilités.",
      pick: "Laisser le modèle choisir",
      restart: "Recommencer",
      temperature: "Température",
      candidates: "Mots suivants possibles",
      done: "Phrase terminée. Recommencez pour en générer une autre.",
      endToken: "fin de phrase"
    },
    conv: {
      title: "Appliquer un filtre à une image",
      help: "Dessinez dans l’image de gauche, puis changez de filtre. Survolez le résultat pour voir quels pixels sont combinés.",
      input: "Image",
      output: "Résultat",
      kernel: "Filtre 3 × 3",
      filter: "Filtre",
      clear: "Effacer",
      sample: "Image d’exemple",
      filters: {
        edgesV: "Contours verticaux",
        edgesH: "Contours horizontaux",
        outline: "Tous les contours",
        blur: "Flou",
        sharpen: "Netteté"
      },
      aria: "Image de 32 par 32 pixels sur laquelle on peut dessiner"
    },
    anomaly: {
      title: "Surveiller un capteur",
      help: "Le signal contient deux incidents simulés (zones orangées) : un pic soudain et une dérive progressive. Réglez le seuil pour les détecter sans multiplier les fausses alertes.",
      threshold: "Seuil",
      unit: "écarts-types",
      detected: "Incidents détectés",
      falseAlerts: "Fausses alertes",
      newData: "Nouvelles mesures",
      legendSignal: "Mesure",
      legendBand: "Zone normale",
      legendIncident: "Incident réel",
      legendAlert: "Alerte",
      aria: "Graphique : signal d’un capteur, zone normale et alertes"
    }
  }
};

# Site de Dorian Gotty Michelson

Site vitrine statique (HTML, CSS, JavaScript, sans dépendance ni étape de build) :

- `index.html` : page « À propos » (parcours, projets, compétences, contact)
- `ia.html` : page « Comprendre l'IA » (6 articles et 4 démonstrations interactives)

## Arborescence

```
index.html, ia.html
css/style.css          styles (thème clair et sombre)
js/config.js           email, LinkedIn, GitHub, CV, formulaire  <- à compléter
js/i18n.js             moteur de traduction
js/main.js             menu, thème, rendu de la page À propos, formulaire
js/hero-net.js         réseau de neurones de la page d'accueil
js/demos.js            démonstrations de la page IA
lang/languages.js      liste des langues proposées
lang/fr.js, lang/en.js tous les textes du site
assets/                CV, favicon, photo (assets/img/photo.jpg)
```

## Modifier un texte

Tous les textes sont dans `lang/fr.js` et `lang/en.js`. Il suffit de modifier la valeur entre guillemets.

## Ajouter une langue

1. Copier `lang/en.js` en `lang/es.js` (par exemple).
2. En haut du nouveau fichier, remplacer `window.I18N.en` par `window.I18N.es`, puis traduire les textes.
3. Ajouter `{ code: "es", label: "Español" }` dans `lang/languages.js`.

Une clé oubliée dans une langue s'affiche automatiquement en français.

## Ajouter la photo

Déposer une photo carrée nommée `photo.jpg` dans `assets/img/`. Tant qu'elle est absente, les initiales s'affichent.

## Activer le formulaire de contact

GitHub Pages n'exécute pas de code serveur, donc le formulaire passe par un service gratuit :

1. Créer un compte sur https://formspree.io (offre gratuite) et créer un formulaire avec ton email.
2. Copier son adresse (du type `https://formspree.io/f/abcdwxyz`) dans `formEndpoint` de `js/config.js`.

Tant que `formEndpoint` est vide, le bouton ouvre la messagerie du visiteur avec le message prérempli.

## Tester en local

Double-cliquer sur `index.html` suffit. Pour un test plus fidèle : `python -m http.server` dans ce dossier, puis ouvrir http://localhost:8000.

## Mettre en ligne avec GitHub Pages

1. Créer un compte sur https://github.com.
2. Créer un dépôt public nommé **`<ton-pseudo>.github.io`** (pour obtenir l'adresse `https://<ton-pseudo>.github.io`).
3. Envoyer le contenu de ce dossier dans le dépôt : bouton « uploading an existing file » sur la page du dépôt, glisser-déposer tous les fichiers et dossiers, puis « Commit changes ». (Ou avec Git : `git init`, `git add .`, `git commit -m "Premier envoi"`, `git branch -M main`, `git remote add origin https://github.com/<ton-pseudo>/<ton-pseudo>.github.io.git`, `git push -u origin main`.)
4. Dans le dépôt : **Settings > Pages > Build and deployment > Source : Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
5. Le site est en ligne après une ou deux minutes.

Chaque nouvel envoi de fichiers met le site à jour automatiquement.

## Statistiques de visite (Umami)

Les statistiques sont anonymes et sans cookie : pas besoin de bandeau de consentement.

### Mise en place (une seule fois)

1. Créer un compte gratuit sur https://cloud.umami.is (offre « Hobby »).
2. Cliquer sur **Add website** : nom `Mon site`, domaine `dorianmichelson.github.io`.
3. Ouvrir le site ajouté, puis **Edit** (ou l'onglet des réglages) : copier le **Website ID**.
4. Coller ce Website ID dans `umamiWebsiteId` de `js/config.js`, puis commit et push.
5. Si l'adresse du site change, mettre à jour `statsDomain` dans `js/config.js` et le domaine dans Umami.

### Ne pas compter tes propres visites

Ouvre une fois `https://dorianmichelson.github.io/?stats=off` sur chaque navigateur et appareil que tu utilises.
Pour réactiver le comptage sur ce navigateur : `?stats=on`.

### Ce que tu verras dans Umami

- Tableau de bord : visiteurs, pages vues, durée moyenne des visites, taux de rebond, sites d'origine
  (LinkedIn, Indeed, Google…), pays, villes, navigateurs, appareils.
- Onglet **Events** : les événements envoyés par `js/analytics.js`. Clique sur un événement pour voir le détail de ses propriétés.

| Événement | Détail | Ce que ça t'apprend |
|---|---|---|
| `temps-actif` | `duree`, `secondes` | Temps réellement passé (onglet visible et visiteur actif) |
| `section-vue` | `section` | Jusqu'où les gens lisent : parcours, projets, passions, chaque article… |
| `defilement` | `profondeur` | 25, 50, 75 ou 100 % de la page |
| `demo-utilisee` | `demo` | Quelles démos sont manipulées |
| `cv-telecharge` | | Téléchargements du CV |
| `clic-contact` | `type` | Clics sur email, LinkedIn, GitHub |
| `formulaire-contact` | `mode` | Messages envoyés |
| `langue`, `theme` | | Changements de langue ou de thème |

Astuce : pour savoir quelle candidature a amené un visiteur, ajoute `?utm_source=nom-entreprise` à l'adresse
que tu envoies (ex. `https://dorianmichelson.github.io/?utm_source=airbus`). Umami regroupe ces visites
dans son rapport UTM et dans le détail des pages vues.

/*
 * Réglages personnels du site. Laisser une valeur vide ("") masque le lien correspondant.
 */
window.SITE_CONFIG = {
  email: "dorian.gotty.michelson@gmail.com",

  // Ex. : "https://www.linkedin.com/in/dorian-gotty-michelson"
    linkedin: "https://www.linkedin.com/in/dorian-gotty-michelson-10786a236/",
  // Ex. : "https://github.com/ton-pseudo"
    github: "https://github.com/dorianmichelson",
  cv: "assets/CV_Dorian_Gotty_Michelson.pdf",

  // Formulaire de contact : créer un formulaire gratuit sur https://formspree.io
  // puis coller ici son adresse, ex. "https://formspree.io/f/abcdwxyz".
  // Tant que c'est vide, le bouton ouvre la messagerie du visiteur avec le message prérempli.
  formEndpoint: "",

  // Statistiques de visite (Umami, gratuit et sans cookie) : voir le README.
  // Coller ici le "Website ID" donné par Umami, ex. "1a2b3c4d-5e6f-...".
  // Tant que c'est vide, aucune statistique n'est collectée.
    umamiWebsiteId: "9c357a19-61d5-49ce-b714-31165bdf7174"

  // Les visites ne sont comptées que sur ce domaine (pas quand tu ouvres le site en local).
  statsDomain: "dorianmichelson.github.io"
};

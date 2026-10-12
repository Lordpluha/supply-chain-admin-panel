import type { Translation } from '../en'

/** The sign-in screen. */
export const auth: Pick<Translation, 'auth'> = {
  auth: {
    title: "Chaîne d'approvisionnement",
    subtitle: "Connectez-vous au panneau d'exploitation",
    email: 'E-mail',
    password: 'Mot de passe',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    signIn: 'Se connecter',
    signingIn: 'Connexion…',
    invalidCredentials: 'E-mail ou mot de passe incorrect',
    demoHint: "Le prototype est pré-rempli avec le compte opérateur d'origine.",
    signedInAs: 'Connecté en tant que {{name}}',
  },
}

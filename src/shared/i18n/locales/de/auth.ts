import type { Translation } from '../en'

/** The sign-in screen. */
export const auth: Pick<Translation, 'auth'> = {
  auth: {
    title: 'Lieferkette',
    subtitle: 'Beim Betriebspanel anmelden',
    email: 'E-Mail',
    password: 'Passwort',
    showPassword: 'Passwort anzeigen',
    hidePassword: 'Passwort verbergen',
    signIn: 'Anmelden',
    signingIn: 'Anmeldung läuft…',
    invalidCredentials: 'E-Mail oder Passwort ist falsch',
    demoHint: 'Der Prototyp ist mit dem angelegten Betreiberkonto vorausgefüllt.',
    signedInAs: 'Angemeldet als {{name}}',
  },
}

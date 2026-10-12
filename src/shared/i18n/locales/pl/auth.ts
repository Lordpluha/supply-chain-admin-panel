import type { Translation } from '../en'

/** The sign-in screen. */
export const auth: Pick<Translation, 'auth'> = {
  auth: {
    title: 'Łańcuch dostaw',
    subtitle: 'Zaloguj się do panelu operacyjnego',
    email: 'E-mail',
    password: 'Hasło',
    showPassword: 'Pokaż hasło',
    hidePassword: 'Ukryj hasło',
    signIn: 'Zaloguj się',
    signingIn: 'Logowanie…',
    invalidCredentials: 'Nieprawidłowy e-mail lub hasło',
    demoHint: 'Prototyp jest wstępnie wypełniony danymi konta operatora.',
    signedInAs: 'Zalogowano jako {{name}}',
  },
}

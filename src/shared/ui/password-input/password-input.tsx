import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../input-group'

export type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>

/**
 * A password field with a reveal control.
 *
 * Typing a password blind is where most sign-in failures come from, and the
 * alternative — retyping it — is worse. Hidden is still the default: the reveal
 * is something the operator asks for.
 *
 * The toggle is a real `<button type="button">`. Left as a plain `type=submit`
 * it would send the form, and without `aria-pressed` a screen reader could not
 * tell whether the password is currently showing.
 */
export const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
  const { t } = useTranslation()
  const [revealed, setRevealed] = useState(false)

  const Icon = revealed ? EyeOff : Eye

  return (
    <InputGroup className={className}>
      <InputGroupInput {...props} type={revealed ? 'text' : 'password'} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-pressed={revealed}
          aria-label={revealed ? t('auth.hidePassword') : t('auth.showPassword')}
          onClick={() => setRevealed(!revealed)}
        >
          <Icon aria-hidden="true" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

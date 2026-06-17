import { sdk } from '../sdk'
import { registrations } from './registrations'
import { resetPassword } from './resetPassword'

export const actions = sdk.Actions.of()
  .addAction(resetPassword)
  .addAction(registrations)

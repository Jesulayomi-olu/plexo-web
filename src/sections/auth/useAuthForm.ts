'use client'

import { useCallback, useId, useRef, useState } from 'react'

type Values<K extends string> = Record<K, string>
export type Errors<K extends string> = Partial<Record<K, string>>

/**
 * Values and error messages for an auth form.
 * - `set` updates a value; a field that is showing an error is checked again as you type, so its
 *   message goes away as soon as it is fixed (and a password change re-checks "do not match").
 * - `check` validates everything (on submit), shows the messages and moves focus to the first field
 *   with one; it returns true when the form is valid.
 * - `flag` shows or clears one message (e.g. the mismatch when leaving "Confirm password").
 * - `ids[key]` is the field's input id.
 */
export function useAuthForm<K extends string>(initial: Values<K>, validate: (values: Values<K>) => Errors<K>) {
  const uid = useId()
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<Errors<K>>({})
  const valuesRef = useRef(values)

  const keys = Object.keys(initial) as K[]
  const ids = Object.fromEntries(keys.map((key) => [key, `${uid}-${key}`])) as Record<K, string>

  const set = useCallback(
    (key: K, value: string) => {
      const next = { ...valuesRef.current, [key]: value }
      valuesRef.current = next
      setValues(next)
      setErrors((prev) => {
        const fresh = validate(next)
        const out: Errors<K> = { ...prev }
        for (const k of Object.keys(prev) as K[]) if (prev[k]) out[k] = fresh[k]
        return out
      })
    },
    [validate],
  )

  const check = useCallback(() => {
    const found = validate(valuesRef.current)
    setErrors(found)
    const first = (Object.keys(initial) as K[]).find((key) => found[key])
    if (first) document.getElementById(`${uid}-${first}`)?.focus()
    return !first
  }, [validate, initial, uid])

  const flag = useCallback((key: K, message: string | undefined) => {
    setErrors((prev) => (prev[key] === message ? prev : { ...prev, [key]: message }))
  }, [])

  return { values, errors, set, check, flag, ids }
}

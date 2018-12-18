import test from 'ava'
import {
    FormatKeys, FormatKey, FormatKeyValue,
    parseKeys, simplifyKeys
} from './format'

test('parseKeys', (t) => {
  t.throws(() => parseKeys({ a: 1 }), /value: a/)
  t.throws(() => parseKeys({ a: [] }), /value: a/)
  t.throws(() => parseKeys({ a: { value: 1 } }), /value: a/)
  t.throws(() => parseKeys({ a: { value: '123', context: 1 } }), /key: a/)
  t.throws(() => parseKeys({ a: { value: '123', context: [{ value: 123 }] } }), /value: a/)
  t.throws(() => parseKeys({ a: { value: '123', context: [{ value: '123', matches: false }] } }), /Invalid key context matches/)

  const keys = parseKeys({ hello: 'Hello' })

  t.deepEqual(keys, { hello: { value: 'Hello' } })

  const dataString = parseKeys({ data: { value: '123' } })

  t.deepEqual(dataString, { data: { value: '123' } })

  const dataWithContext = parseKeys({ data: { value: '123', context: [] } })

  t.deepEqual(dataWithContext, { data: { value: '123', context: [] } })
})

test('simplifyKeys', (t) => {
  let data: FormatKeys = {}

  t.deepEqual(simplifyKeys(data), {})

  data = { props: {} as FormatKey }

  t.deepEqual(simplifyKeys(data), { props: undefined })

  data = { props: { value: '' as FormatKeyValue } as FormatKey }

  t.deepEqual(simplifyKeys(data), { props: '' })

  data = { props: { value: [] } as FormatKey }

  t.deepEqual(simplifyKeys(data), { props: [] })

  data = { props: { value: [[1, 1, 'test']] } }

  t.deepEqual(simplifyKeys(data), { props: [[1, 1, 'test']] })

  data = { props: { value: [[1, 1, 'test']], context: [] } }

  t.deepEqual(simplifyKeys(data), { props: { value: [[1, 1, 'test']], context: [] } })
})

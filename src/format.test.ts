
import test from 'ava';
import { parseKeys } from './format';

test('parseKeys', t => {
    t.throws(() => parseKeys({ a: 1 }), /value: a/);
    t.throws(() => parseKeys({ a: [] }), /value: a/);

    const keys = parseKeys({ hello: 'Hello' });
    t.deepEqual(keys, { hello: { value: 'Hello' } });
})

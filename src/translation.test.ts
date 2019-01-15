
import test from 'ava';
import { parseTranslationData } from './translation';

test('parseKeys', t => {
    t.throws(() => parseTranslationData({ a: 1 }), /value: a/);
    t.throws(() => parseTranslationData({ a: [] }), /value: a/);

    const keys = parseTranslationData({ hello: 'Hello' });
    t.deepEqual(keys, { hello: { value: 'Hello' } });
})

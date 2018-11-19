
import test from 'ava';
import { Translator } from './translator';


test('not found key', t => {
    const s = new Translator({
        hello: { value: 'Hello' }
    }, { throwUndefinedKey: false });

    t.is(s.t('hello'), 'Hello')
    t.is(s.t('hi'), 'hi')
})

test('default keys', t => {
    const s = new Translator({
        hello: { value: 'Hello' }
    }, {
            throwUndefinedKey: false,
            defaultKeys: {
                hi: { value: 'Hi!' }
            }
        });

    t.is(s.t('hello'), 'Hello')
    t.is(s.t('hi'), 'Hi!')
})

test('sprintf', t => {
    const s = new Translator({
        hello: { value: 'Hello %(name)s' },
        count_news: { value: '%d news' },
    }, {
            throwUndefinedKey: false,
            defaultKeys: {
                hi: { value: 'Hi, %(name)s' }
            }
        });

    t.is(s.t('hello', [{ name: 'Ion' }]), 'Hello Ion')
    t.is(s.t('hi', [{ name: 'Ion' }]), 'Hi, Ion')

    t.is(s.t('count_news', [10]), '10 news')
})

test('counts', t => {
    const s = new Translator({
        count_news: {
            value: [
                [0, 0, 'no news'],
                [1, 1, 'one news'],
                [2, null, '%d news'],
            ]
        },
    }, { throwUndefinedKey: false });

    t.is(s.t('count_news', [10]), '10 news')
    t.is(s.t('count_news', [0]), 'no news')
    t.is(s.t('count_news', [1]), 'one news')
})

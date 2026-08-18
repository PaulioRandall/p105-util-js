import DirtyMap from './DirtyMap.js'

function onUpdate(map) {
	const observer = { count: 0 }
	map.onUpdate(() => observer.count++)
	return observer
}

describe('DirtyMap.js', () => {
	test('delete(k): Deletes an entry an puts key in dirty set', () => {
		const m = new DirtyMap()

		m.put('a', 1)
		m.clean()
		m.delete('a')

		expect(m.has('a')).toEqual(false)
		expect(m.isKeyDirty('a')).toEqual(true)
	})

	test('getOrInsert(k, defaultValue)', () => {
		const m = new DirtyMap()

		let v = m.getOrInsert('a', 1)

		expect(v).toEqual(1)
		expect(m.get('a')).toEqual(1)
		expect(m.isKeyDirty('a')).toEqual(true)

		m.clean()
		v = m.getOrInsert('a', 2)

		expect(v).toEqual(1)
		expect(m.get('a')).toEqual(1)
		expect(m.isKeyDirty('a')).toEqual(false)
	})

	test('getOrInsertComputed(k, valueGenerator)', () => {
		const m = new DirtyMap()
		const genValue = (key) => key.length

		let v = m.getOrInsertComputed('abc', genValue)

		expect(v).toEqual(3)
		expect(m.get('abc')).toEqual(3)
		expect(m.isKeyDirty('abc')).toEqual(true)

		m.clean()
		v = m.getOrInsertComputed('abc', genValue)

		expect(v).toEqual(3)
		expect(m.get('abc')).toEqual(3)
		expect(m.isKeyDirty('abc')).toEqual(false)
	})

	test('put(k,v): New entry causes key to become dirty', () => {
		const m = new DirtyMap()
		const result = m.put('a', 1)

		expect(m.get('a')).toEqual(1)
		expect(m.isKeyDirty('a')).toEqual(true)

		expect(result).toEqual(m)
	})

	test('put(k,v): Updating entry with new value causes key to become dirty', () => {
		const m = new DirtyMap()

		m.put('a', 1)
		m.clean()
		m.put('a', 2)

		expect(m.get('a')).toEqual(2)
		expect(m.isKeyDirty('a')).toEqual(true)
	})

	test('put(k,v): Updating entry with the same value does not cause key to become dirty', () => {
		const m = new DirtyMap()

		m.put('a', 1)
		m.clean()
		m.put('a', 1)

		expect(m.get('a')).toEqual(1)
		expect(m.isKeyDirty('a')).toEqual(false)
	})

	test('put(k,v,f): Custom compare function overides default function', () => {
		const m = new DirtyMap()

		m.put('a', 1)
		m.clean()
		m.put('a', '1', (a, b) => a == b)

		expect(m.get('a')).toEqual(1)
		expect(m.isKeyDirty('a')).toEqual(false)
	})

	test('putAll(obj): Puts all values', () => {
		const m = new DirtyMap()

		m.set('a', 1)
		m.set('b', 2)
		m.clean()

		m.putAll({
			a: 1,
			b: -2,
			c: 3,
		})

		expect(m.get('a')).toEqual(1)
		expect(m.get('b')).toEqual(-2)
		expect(m.get('c')).toEqual(3)

		expect(m.isKeyDirty('a')).toEqual(false)
		expect(m.isKeyDirty('b')).toEqual(true)
		expect(m.isKeyDirty('c')).toEqual(true)
	})

	test('putMissing(k,v,f): Adds an entry when missing and ignores when not', () => {
		const m = new DirtyMap()

		m.putMissing('a', 1)
		expect(m.get('a')).toEqual(1)
		expect(m.isKeyDirty('a')).toEqual(true)

		m.clean()

		m.putMissing('a', 2)
		expect(m.get('a')).toEqual(1)
		expect(m.isKeyDirty('a')).toEqual(false)
	})

	test('set(k,v): New entry causes key to become dirty', () => {
		const m = new DirtyMap()
		const result = m.set('a', 1)

		expect(m.get('a')).toEqual(1)
		expect(m.isKeyDirty('a')).toEqual(true)

		expect(result).toEqual(m)
	})

	test('set(k,v): Updating entry with new value causes key to become dirty', () => {
		const m = new DirtyMap()

		m.set('a', 1)
		m.clean()
		m.set('a', 2)

		expect(m.get('a')).toEqual(2)
		expect(m.isKeyDirty('a')).toEqual(true)
	})

	test('set(k,v): Updating entry with the same value causes key to become dirty', () => {
		const m = new DirtyMap()

		m.set('a', 1)
		m.clean()
		m.set('a', 1)

		expect(m.isKeyDirty('a')).toEqual(true)
	})

	test('setAll(obj): Sets all values', () => {
		const m = new DirtyMap()

		m.set('a', 1)
		m.set('b', 2)
		m.clean()

		m.setAll({
			a: 1,
			b: -2,
			c: 3,
		})

		expect(m.get('a')).toEqual(1)
		expect(m.get('b')).toEqual(-2)
		expect(m.get('c')).toEqual(3)

		expect(m.isKeyDirty('a')).toEqual(true)
		expect(m.isKeyDirty('b')).toEqual(true)
		expect(m.isKeyDirty('c')).toEqual(true)
	})

	test('willPutDirty(k,v)', () => {
		const m = new DirtyMap()

		let willbeDirty = m.willPutDirty('a', 1)
		expect(willbeDirty).toEqual(true)

		m.set('a', 1)
		m.clean()

		willbeDirty = m.willPutDirty('a', 1)
		expect(willbeDirty).toEqual(false)
	})

	test('clear()', () => {
		const m = new DirtyMap()

		m.set('a', 1)
		m.set('b', 2)
		m.set('c', 3)
		m.clean()

		m.clear()

		expect(m.isKeyDirty('a')).toEqual(true)
		expect(m.isKeyDirty('b')).toEqual(true)
		expect(m.isKeyDirty('c')).toEqual(true)
	})
})

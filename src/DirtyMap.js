//

function err(msg) {
	return new Error(`[DirtyMap] ${msg}`)
}

function strictEquals(a, b) {
	return a === b
}

function checkEqualityFunc(func) {
	if (!func || typeof func !== 'function') {
		throw err(`Equality function must be a function, not a '${typeof func}'`)
	}
}

// DirtyMap extends the standard Map class by keeping a set
// of all keys for entries that are dirty, i.e. those that
// have been added, changed, deleted, or flagged by the
// user. It does not record what changes were made.
export default class DirtyMap extends Map {
	_dirty = new Set()

	// dirty returns the set of dirty keys.
	get dirty() {
		return this._dirty
	}

	// clean removes all keys from the dirty set.
	//
	// Returns the dirty map for chaining.
	clean() {
		this._dirty.clear()
		return this
	}

	// clear removes all items from the map, adding all keys
	// to the dirty set.
	//
	// Returns the dirty map for chaining.
	clear() {
		for (const k of this.keys()) {
			this._dirty.add(k)
		}

		super.clear()
	}

	// delete removes the entry if it exists. $key is
	// flagged as dirty only if a deletion occurred.
	delete(key) {
		if (this.has(key)) {
			super.delete(key)
			this._dirty.add(key)
			return true
		}

		return false
	}

	// getOrInsert returns the value associated with $key.
	// If $key does not exist, $defaultValue is set as the
	// $key's value within the map, $key is added to the
	// dirty set, and $defaultValue is returned.
	getOrInsert(key, defaultValue) {
		if (this.has(key)) {
			return this.get(key)
		}

		super.set(key, defaultValue)
		this._dirty.add(key)

		return defaultValue
	}

	// getOrInsertComputed returns the value associated $key.
	// If $key does not exist, $valueGenerator function is
	// called, with $key as it's argument, and the result set
	// as the value within the map. $key is added to the
	// dirty set, and the generated value returned.
	getOrInsertComputed(key, valueGenerator) {
		if (this.has(key)) {
			return this.get(key)
		}

		const v = valueGenerator(key)
		super.set(key, v)
		this._dirty.add(key)

		return v
	}

	// isDirty returns true if the dirty set contains any
	// keys. After a call to #clean, this function will
	// always return false.
	isDirty() {
		return this._dirty.size > 0
	}

	// isKeyDirty returns true if $key is in the dirty set.
	isKeyDirty(key) {
		return this._dirty.has(key)
	}

	// put adds the $key/$value pair to the map, if the
	// pairing doesn't already exist. $key is added to the
	// dirty set only if the parining didn't already exist.
	//
	// Use the #set method if you want always want $key added
	// to the dirty set.
	//
	// An optional $equalityFunc may be passed, otherwise
	// `(a, b) => a === b` is used.
	//
	// Returns the dirty map for chaining.
	put(key, value, equalityFunc = strictEquals) {
		checkEqualityFunc(equalityFunc)
		this._put(key, value, equalityFunc)
		return this
	}

	// putAll invokes the #put method for all own property
	// fields in $obj. See #put method docs for more details.
	//
	// Returns the dirty map for chaining.
	putAll(obj, equalityFunc = strictEquals) {
		checkEqualityFunc(equalityFunc)
		const keys = Object.getOwnPropertyNames(obj)

		for (const k of keys) {
			this._put(k, obj[k], equalityFunc)
		}

		return this
	}

	// putMissing invokes the #put method only if $key does
	// not exist. $key does not become dirty if the value is
	// not put. See #put method docs for more details.
	//
	// Returns the dirty map for chaining.
	putMissing(key, value, equalityFunc = strictEquals) {
		checkEqualityFunc(equalityFunc)

		if (!this.has(key)) {
			this._put(key, value, equalityFunc)
		}

		return this
	}

	// set adds the $key/$value pair to the map. $key is
	// always added to the dirty set, even if the parining
	// already existed.
	//
	// Use the #put method if you only want $key added to
	// the dirty set when $key/$value pairs does not already
	// exist.
	//
	// Returns the dirty map for chaining.
	set(key, value) {
		super.set(key, value)
		this._dirty.add(key)
		return this
	}

	// setAll invokes the #set method for all own property
	// fields in $obj. See #sut method docs for more details.
	//
	// Returns the dirty map for chaining.
	setAll(obj) {
		const keys = Object.getOwnPropertyNames(obj)

		for (const k of keys) {
			this.set(k, obj[k])
		}

		return this
	}

	// willPutDirty returns true if $key is already dirty or
	// putting the $key/$value pair will result in $key
	// becomming dirty.
	//
	// An optional $equalityFunc may be passed, otherwise
	// `(a, b) => a === b` is used.
	willPutDirty(key, value, equalityFunc = strictEquals) {
		checkEqualityFunc(equalityFunc)

		return (
			!!this._dirty.has(key) || //
			!this.has(key) || //
			!this._isEqual(key, value, equalityFunc)
		)
	}

	_put(key, value, equalityFunc) {
		if (!this._isEqual(key, value, equalityFunc)) {
			super.set(key, value)
			this._dirty.add(key)
		}
	}

	_isEqual(key, value, equalityFunc) {
		const hasKey = this.has(key)
		const currValue = this.get(key)
		const areEqual = equalityFunc ? equalityFunc : strictEquals
		return hasKey && areEqual(currValue, value)
	}
}

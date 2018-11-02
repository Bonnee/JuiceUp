module.exports = class Intervals {
	constructor() {
		this._intervals = [];
	}

	add(fun, delay) {
		var newInterval = setInterval(fun, delay);

		return this._intervals.push(newInterval) - 1;
	}

	addOnce(fun, timeout) {
		var newTimeout = setTimeout(fun, timeout);

		return this._intervals.push(newTimeout) - 1;
	}

	clear(id) {
		if (id && this._intervals[id]) {
			clearInterval(this._intervals[id]);
			delete this._intervals[id];
			return true;
		}
		return false;
	}

	clearAll() {
		for (let interval in this._intervals) {
			this.clear(interval);
		}
	}
}
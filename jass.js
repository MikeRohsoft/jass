class Sequence {
    /**
     * 
     * @param {Function[] | Function | ClassDecorator[] | ClassDecorator | void} objectArray 
     * @param {any[] | Function[] | Function | void} functionArray 
     * @param {any[] | void} [parameterArray] 
     */
    constructor(objectArray, functionArray, parameterArray) {
        this.objectArray = objectArray;
        this.functionArray = functionArray;
        this.parameterArray = parameterArray;

        this.isObjectArray = Array.isArray(this.objectArray);
        this.isFunctionArray = Array.isArray(this.functionArray);
        this.isParameterArray = Array.isArray(this.parameterArray);
        
        this.nextFunction = this.functionArray;
        this.nextObject = this.objectArray || void 0;
        this.nextParameters = this.parameterArray;

        this._index = 0;
        this._end = 1;  
        this.bufferedString = '';

        this.init();
    }

    init() {
        if (this.isObjectArray) {
            this._end = this.objectArray.length;
        }

        if (this.isParameterArray && this.parameterArray.length > this._end) {
            this._end = this.parameterArray.length;
        }

        if (this.isFunctionArray && this.functionArray.length > this._end) {
            this._end = this.functionArray.length;
        }

        if (!this.isObjectArray) {
            if (typeof this.objectArray !== 'function') {
				return;
            }
			this.initShiftMode();	
			this.nextFunction = this.objectArray;
			this.isFunctionArray = false;
            return;
        }
        
        if (this.objectArray.some(v => typeof v !== 'function')) {
			return;
        }
		this.isFunctionArray = this.isObjectArray ? true : false;
		this.initShiftMode();
		this.functionArray = this.objectArray;
		
    }
	
	initShiftMode() {
		this.nextObject = void 0;
		this.parameterArray = this.functionArray;
		this.isParameterArray = this.isFunctionArray ? true : false;
		this.isObjectArray = false;	
	}

    /**
     * @returns {any}
     */
    next() {
        if (this._index >= this._end) {
            return;
        }

        if (this.isObjectArray && this._index < this.objectArray.length) {
            this.nextObject = this.objectArray[this._index];
        }

        if (this.isFunctionArray && this._index < this.functionArray.length) {
            this.nextFunction = this.functionArray[this._index];
            this.bufferedString = '';
        } 
        
        if (this.bufferedString !== '') {
            this.nextFunction = this.bufferedString;
        }

        if (typeof this.nextFunction === 'string') {
            this.bufferedString = this.nextFunction;
            this.nextFunction = this.nextObject[this.nextFunction];
        }

        if (this.isParameterArray && this._index < this.parameterArray.length) {
            this.nextParameters = this.parameterArray[this._index];
        }

        this._index++;

        if (typeof this.nextFunction !== 'function') {
            return;
        }

        if (Array.isArray(this.nextParameters)) {
            return this.nextFunction.call(this.nextObject, ...this.nextParameters);
        }

        return this.nextFunction.call(this.nextObject, this.nextParameters);
    }

    /**
     * @returns {Number}
     */
    index() {
        return this._index;
    }   

    /**
     * @returns {Number}
     */
    end() {
        return this._end;
    }
}

module.exports = Sequence;
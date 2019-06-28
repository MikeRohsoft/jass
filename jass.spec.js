const Sequence = require('./jass');

describe("Sequence", () => {

    it("First Sequence Test, we start simple with 1 Function", () => {
        const testHelloWorld = () => 'Hello World';
        const seq = new Sequence(testHelloWorld);
        expect(seq.end()).toBe(1);
        expect(seq.next()).toBe('Hello World');        
        expect(seq.next()).toBeFalsy();
    });

    it("Second Sequence Test, we test how it looks with a Sequence of Functions and some parameters", () => {
        const testFunc1 = () => 'Test Func 1 Callback';
        const testFunc2 = (a, b) => `${a} Test Func 2 Callback ${b}`;
        const seq = new Sequence([testFunc1, testFunc2, testFunc1], [null, ['Hello', 'World']]);
        expect(seq.end()).toBe(3);
        expect(seq.next()).toBe('Test Func 1 Callback');        
        expect(seq.next()).toBe('Hello Test Func 2 Callback World');
        expect(seq.next()).toBe('Test Func 1 Callback'); 
        expect(seq.next()).toBeFalsy();
    });

    it("Third Sequence Test, we test how it looks with using 'this' context", () => {
        const testClass = class {
			constructor() {
				this.strCallback = 'Callback';
			}
			testFunc1() {
				return `Test Func 1 ${this.strCallback}`;
			}
		};
		const test = new testClass();
        const seq = new Sequence(test, test.testFunc1, [null, null]);
        expect(seq.end()).toBe(2);
        expect(seq.next()).toBe('Test Func 1 Callback');        
        expect(seq.next()).toBe('Test Func 1 Callback');
        expect(seq.next()).toBeFalsy();
    });

    it("Fourth Sequence Test, we test how it looks to call the Functions from String Context", () => {
        const test = { testFunc1: () => 'Test Func 1 Callback', };
        const test2 = { testFunc1: () => 'Test Func 1 Callback 2', };
        const seq = new Sequence([test, test2], 'testFunc1');
        expect(seq.end()).toBe(2);
        expect(seq.next()).toBe('Test Func 1 Callback');        
        expect(seq.next()).toBe('Test Func 1 Callback 2');
        expect(seq.next()).toBeFalsy();
    });

    it("Fith Sequence Test, we test if it still works with Parameters", () => {
        const test = { testFunc: () => 'Test Func 1 Callback 2', };
		const test2 = { testFunc: (a, b) => `${a} ${b}`, };
        const seq = new Sequence([test, test2], 'testFunc', [null, null, ['a', 'b']]);
        expect(seq.end()).toBe(3);
		expect(seq.next()).toBe('Test Func 1 Callback 2');
        expect(seq.next()).toBe('null undefined');        
        expect(seq.next()).toBe('a b');
        expect(seq.next()).toBeFalsy();
    });

    it("Sixth Sequence Test, we test if it still works ", () => {
        const testFunc1 = () => 'Test Func 1 Callback';
        const seq = new Sequence(testFunc1, [null, null]);
        expect(seq.end()).toBe(2);
        expect(seq.next()).toBe('Test Func 1 Callback');        
        expect(seq.next()).toBe('Test Func 1 Callback');
        expect(seq.next()).toBeFalsy();
    });
	
	it("Seventh Sequence Test, we test how it looks with static Object Functions", () => {
        const testFunc = (a, b) => `${a} Test Func 1 Callback ${b}`;
        const seq = new Sequence(testFunc, [null, null, ['a', 'b']]);
        expect(seq.end()).toBe(3);
		expect(seq.next()).toBe('null Test Func 1 Callback undefined');
        expect(seq.next()).toBe('null Test Func 1 Callback undefined');        
        expect(seq.next()).toBe('a Test Func 1 Callback b');
        expect(seq.next()).toBeFalsy();
    });

    it("Eighth Sequence Test, we test how it looks with static Object Function Sequence", () => {
        const test = { testFunc1: (a, b) => `${a} Test Func 1 Callback ${b}`, };
        const seq = new Sequence([test.testFunc1, test.testFunc1, test.testFunc1], [null, ['a', 'b']]);
        expect(seq.end()).toBe(3);
        expect(seq.next()).toBe('null Test Func 1 Callback undefined');
        expect(seq.next()).toBe('a Test Func 1 Callback b');
		expect(seq.next()).toBe('a Test Func 1 Callback b');
        expect(seq.next()).toBeFalsy();
    });
	
});
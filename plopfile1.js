const co = require('./co')
const thunkify = require('thunkify')
const assert = require('assert')

//thunk tests

let thunk1 = function(name, fn) {
	try{
		fn(name)
	}
	catch(e) {
		arguments[2](new TypeError('the error: '+error))
	}

}

function* thunk1Gen() {
	let name1 = yield thunkify(thunk1)("xuzhan", (name)=>{
		console.log(`name1: ${name}`)
	},'gaga')
	let name2 = yield thunkify(thunk2)(name1, (err,name)=>{
		console.log(`name2: ${name}`)
	})
	return name2
}

co(thunk1Gen)

var thunkFn = function(word, cb){
	cb(word)
}

var thunkableFnWithWord = thunkify(thunkFn)


function *genRoutine(jiao) {
	let ret1 = yield thunkableFnWithWord(jiao)
	let ret2 = yield thunkableFnWithWord(ret1)
	return ret2
}

let gr = genRoutine('zeze')

gr.next().value( (ret)=>{
	console.log(ret)
	gr.next(ret+"gaga").value( (ret)=>{
		console.log(ret)
		console.log(gr.next(ret+"jiujiu").value)
	} )
})


function createGetData(num) {
	return new Promise( (resolve, reject) => {
		setTimeout(resolve(num + 1),3000)
	} )
}

function* genCreate(num) {
	let ret = yield createGetData(num)
	let ret1 = yield createGetData(ret)
	return ret1
}

let gc = genCreate(1)

gc.next().value.then( num=> {
	console.log(num)
	gc.next(num + 1).value.then( num=> {
		console.log(num)
		console.log(gc.next(num + 1).value)
	} )
} )



// co thunk

//simple thunk
function get(val, err){
	val++
	return function(done) {
		done(null, val)
	}
}

co(function *() {
	let ret = yield get(1)
	console.log(`ret: ${ret}`)
})

//thunkify
let get1 = function(val, cb) {
	val++
	cb(null, val)
}
let thunkifyGet = thunkify(get1)
co(function *() {
	let ret = yield thunkifyGet(1)
	console.log(`thunkRet: ${ret}`)
})

var ctx = {
	some: 'thing'
}

//wrap





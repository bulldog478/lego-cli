var path = require('path')
var fs = require('./fs-promise.js')


fs.fileExists(path.resolve(__dirname,'./fs-promise.js'))
.then(function(isExist) {
	console.log('go')
	if(isExist) {
		return fs.readFile(path.resolve(__dirname,'./fs-promise.js'))
	} else{
		console.err('no exist')
	}
})
.then(function(content) {
	console.log(content)
	return fs.writeFile('./writefile.js',content) 
}).then(function(something) {
	console.log(something)
})


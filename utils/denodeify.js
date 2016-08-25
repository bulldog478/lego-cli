module.exports = denodeify

var array_slice = Array.prototype.slice
function denodeify(cb /*...args*/){
	var baseArgs = array_slice.call(arguments, 1)
	return function() {
		nodeArgs = baseArgs.concat(array_slice.call(arguments))
		return new Promise( (resolve, reject)=>{
			nodeArgs.push(function(err, result) {
				if(err) reject(err)
				else if(arguments.length > 2) resolve(array_slice.call(arguments, 1))
				else resolve(result)
			})
			cb.apply(this, nodeArgs)
		})
	}
}


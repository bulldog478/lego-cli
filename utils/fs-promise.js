'use strict'

var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var denodeify = require('./denodeify')

	
var fs_promise = function() {
	var readFile = denodeify(fs.readFile);
	var writeFile = denodeify(fs.writeFile);
	var makeDir = denodeify(mkdirp);

	function getFile(path) {
		return readFile(path,'utf8')
	}

	function setFile(path, data) {
		return writeFile(path, data, 'utf8')
	}

	function json(path) {
		return readFile(path).then(function(data) {
			return JSON.parse(data)
		})
	}

	function fileExists(path) {
		return new Promise(function(resolve) {
			fs.exists(path, resolve)
		})
	}

	return {
		readFile: getFile,
		writeFile: setFile,
		fileExists,
		json,
		makeDir
	}
}

module.exports = fs_promise()


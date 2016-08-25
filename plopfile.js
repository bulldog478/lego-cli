const isEmpty = require('lodash/isEmpty')
const curry = require('lodash/curry')
const extend = require('lodash/extend')
const chalk = require('chalk')

const fs = require('./utils/fs-promise')
const path = require('path')


module.exports = (plop) => {
	const basePath = plop.getPlopfilePath()

	plop.addPrompt('directory', require('inquirer-directory'))

	const isNotEmptyFor = (name) => {
		return (value) => {
			if (isEmpty(value)) {return `${name} is required`}
			return true
		}
	}

	function makePath(p) {	
		return path.isAbsolute(p) ? p : path.join(basePath, p)
	}

	// setGenerator init
	plop.setGenerator('init', {
		description:'create a simple angular project',
		prompts:[
			{ //angular module name
				type: 'input',
				name: 'module',
				message: 'What\'s your angular module name?',
				validate: isNotEmptyFor('module')
			},
			{
				type:'confirm',
				name: 'needRouter',
				message:'Do you want to configurate the router?',
				default:true
			}
		],
		actions:[
			function customAction(anwers) {
				if(anwers.needRouter) {
					let routerPromise = createRouter([])
					routerPromise.then( (result)=>{
						extend(anwers, {router:result})
						console.log(anwers)
						initDirectory(anwers)
					} )
				}

				function createRouter(initRouters){
					const questions = [{
						type:'input',
						name: 'router',
						message: 'What\'s your router name?',
						validate: isNotEmptyFor('router')
					},{
						type:'confirm',
						name:'needRouterAgain',
						message:'Do you want to configurate the next router?',
						default:true
					}]
					return new Promise( (resolve, reject)=>{
						loopRouter(initRouters)

						function loopRouter(routers){
							plop.inquirer.prompt(questions,(anwers)=>{
									routers.push(anwers.router)
									if(anwers.needRouterAgain) {
										loopRouter(routers)
									} else{
										plop.inquirer.prompt({
											type:'list',
											name:'otherwise',
											message:'Choose one router as the default router.',
											choices: routers,
											default: routers[0]
										},({otherwise})=>{
											console.log('The router you configurated : %s, default router : %s', 
												chalk.green(routers.join(', ')),
												chalk.magenta(otherwise));
											resolve({routers, otherwise})
										})
										
									}
							})
						}	
					})
				} 

				function initDirectory(anwers) {
					const actions = [
						{
							type: 'add',
							path: 'src/index.html',
							templateFile: 'plopTemplates/init/src/index.html'
						}
					]
					executeCustomAction(actions, anwers)

				}
			}	

		]
	})



	// setGenerator build

	//utils
	function executeCustomAction(action, data) {
		if(typeof action === 'function') {
			executeFunctionAction(arguments)
		}else {
			action.forEach( function(act){
				executeArrayAction(act, data)
			} )
		}
	}

	function executeFunctionAction(action, data) {
		var _promise = Promise.resolve(action(data))
		return _promise
	}

	function executeArrayAction(action, data) {
		var template = action.template || ''
		var filePath = makePath(plop.renderString(action.path ||'', data))
		var _promise = Promise.resolve().then(function (){
			if(template) {
				return template
			} else if(action.templateFile) {
				return fs.readFile(makePath(action.templateFile)) 
			} else {
				throw Error('No valid template found for this action')
			}
		}).then(function(templateContent) {
			template = templateContent
			
			return fs.fileExists(filePath)
		}).then(function(isExist) {
			if(filePath) {
				if (action.type === 'add') {
					if (isExist) { throw Error('File already exists: ' + filePath)}
					return fs.makeDir(path.dirname(filePath))
						.then(function () {
							return fs.writeFile(makePath(filePath), plop.renderString(template, data))
						})
				} else if (action.type === 'modify') {
					return fs.readFile(filePath)
						.then(function (fileData) {
							fileData = fileData.replace(action.pattern, plop.renderString(template, data))
							return fs.writeFile(filePath, fileData)
						})
				} else {
					throw Error('Invalid action type: ' + action.type)
				}
			}
		})

		return _promise
	}

}



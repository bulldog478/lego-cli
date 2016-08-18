const isEmpty = require('lodash/isEmpty')
const curry = require('lodash/curry')
const extend = require('lodash/extend')
const chalk = require('chalk')

const EventEmitter = require('events');
const fs = require('fs')


module.exports = (plop) => {
	const basePath = plop.getPlopfilePath()

	plop.addPrompt('directory', require('inquirer-directory'))

	const isNotEmptyFor = (name) => {
		return (value) => {
			if (isEmpty(value)) {return `${name} is required`}
			return true
		}
	}

	const makePath = function(p) {
		return path.isAbsolute(p) 
			? p 
			: path.join(basePath, p)
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

				let emitter
				if(anwers.needRouter) {
					loopRouter([])
					emitter = new EventEmitter()
					emitter.on('routersFinish', (routers, otherwise)=>{
						extend(anwers, {
							routersConfig:routers, 
							otherwise
						})
					})
				}

				
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
									emitter.emit('routersFinish',routers, otherwise)
								})
								
							}
						})
				}


			}
		]
	})
	// setGenerator build

}



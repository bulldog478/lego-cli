
const {{name}} = {
	template:require('./{{ name }}View.html'),
	controllerAs:'{{ name }}',
	controller:{{name}}Controller,
	resolve(){
		//Todo route match
	} 
}

{{ name }}Controller.$inject = []
class {{ name }}Controller {
	constructor() { 'ngInject'
		//Todo controller
	}
}

export default ['{{url}}',{{name}}]
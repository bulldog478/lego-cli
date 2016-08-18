import {{ name }}Styles from './{{ name }}Styles.scss'


{{ name }}Directive.$inject = []
function {{ name }}Directive() {'ngInject'
	return {
		restrict:'EA',
		controllerAs: '{{ name }}',
		controller: {{ name }}Controller,
		template: require('./{{ name }}View.html'),
		scope:{
		},
		link:function(){
			//Todo link
		}
	} 
}

{{ name }}Controller.$inject = []
class {{ name }}Controller {
	constructor($scope) { 'ngInject'
		//Todo controller
	}
}


export default angular.module('{{ module }}')
.directive('{{ name }}', {{name}}Directive}).name

{{ name }}Factory.$inject = []
export default function {{ name }}Factory() { 'ngInject'
	return {
		/*key: fn*/
	}
}

export default angular.module('{{ module }}')
.factory('{{ name }}', {{name}Factory}).name


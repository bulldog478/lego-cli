routerConfig.$inject = ['$routeProvider']
export default function routerConfig($routeProvider){
	$routeProvider
		{{#each routerConfigs}}
			.when(...require('./{{name}}')
		{{/each}}
			.otherwise({
				redirectTo: '{{ otherwise }}'
			})
}
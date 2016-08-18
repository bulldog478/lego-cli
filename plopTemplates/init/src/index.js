let module = angular.module('{{camelCase module }}',{{locales}})

{{#if needRouter}}
	module.config(require('./router'))
{{/if}}

$(document).ready(()=>{
	angular.bootstrap(module.name)
})
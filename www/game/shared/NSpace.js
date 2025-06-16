export default class NS
{
	constructor(par)
	{
		var prot	=this.constructor.prototype

		for(var fun in prot )
		{
			this[fun]	=prot[fun].bind(par)
		}
	}
}
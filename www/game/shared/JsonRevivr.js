import Loc from "./Loc.js"
import Col from "./Color.js"


export default class JR
{
	objs	={}

	fn


	constructor()
	{
		this.addobjs([ Loc ,Col ,
			{
				key	:"block"
				,
				fromJSON	:(val)=> this.revivr(val[0],val[1])
			}
		 ])

		this.fn	=this.revivr.bind(this)
	}
}



JR.prototype. addobjs	=function( objs )
{
	for(var obj of objs )
	{
		var key	=obj.key

		this.objs[key]	=obj
	}
	return this
}

JR.prototype. add	=JR.prototype. addobjs



JR.prototype. revivr	=function( key, val, str )
{
	var obj	=this.objs[key]

	return obj	? obj.fromJSON( val )	: val
}
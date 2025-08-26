import Loc from "./Loc.js"
import Col from "./Color.js"


export default class JT
{
	objs	={}

	rev


	constructor()
	{
		this.addobjs([ Loc, Col ])

		this.rev	=this.revivr.bind(this)
	}
}



JT.prototype. addobjs	=function( objs )
{
	for(var obj of objs )
	{
		var key	=obj.key

		this.objs[key]	=obj
	}
}

JT.prototype. add	=JT.prototype. addrules



JT.prototype. revivr	=function( key, val, str )
{
	var obj	=this.objs[key]

	return obj	? obj.fromJSON( val )	: val
}
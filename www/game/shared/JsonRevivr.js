import Loc from "./Loc.js"
import Col from "./Color.js"
import Block from "./items/Block.js"


export default class JR
{
	objs	={}

	fn


	constructor()
	{
		this.addobjs([ Loc ,Col ,
			
			Block.newRevObj(this)
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
import Loc from "./Loc.js"
import Col from "./Color.js"
// import Block from "./items/newBlock.js"


export default class JR
{
	revfns	={}

	fn


	constructor()
	{
		this.addclassa([ Loc ,Col ])

		this.fn	=this.revivr.bind(this)
	}
}


JR.prototype. addclassa	=function( arr )
{
	for(var clss of arr )
	{
		this.addclass( clss )
	}
	return this
}


JR.prototype. addclasso	=function( o )
{
	for(var key in o )
	{
		this.addclass( o[key] )
	}
	return this
}



JR.prototype. addtmplclss	=function( clss )
{
	this.revfns[clss.key]	=clss.newrevfn( this )

	return this
}



JR.prototype. addclass	=function( clss )
{
	this.revfns[clss.key]	=clss.fromJSON.bind(clss)

	return this
}


JR.prototype. add	=JR.prototype. addclass



JR.prototype. revivr	=function( key, val, str )
{
	var revfn	=this.revfns[key]

	return revfn	? revfn( val )	: val
}
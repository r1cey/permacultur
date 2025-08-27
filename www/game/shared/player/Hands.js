import Cnt from "../items/Container.js"
import Jable from "../Jsonable.js"


/** Also extends Container */

export default class Ha extends Jable
{
	item

	static key	="hands"
}



Ha.prototype. getobj	=function()
{
	return this.item
}



Ha.prototype. toJSON	=function()
{
	var it	=this.item

	if( it )
	{
		let obj	={}

		Object.assign( obj, this )

		obj.item	={ key :it.constructor.key , obj :it }

		return obj
	}
	return this
}
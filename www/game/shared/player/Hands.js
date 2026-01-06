// import Holder from "../Holder.js"
import newJable from "../newJsonable.js"

import newPath from "../newPathable.js"


/** Also extends Container */

var Ha	=newJable( newPath( class Ha
{
	item

	static key	="hands"



	ishands()	{return this }


	/**@todo error handling */
	msg2navo( afrom ,i ,ato )
	{
		ato.push( this.item[afrom[i]] )
	}
}))



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


export default Ha
import Loc from '../Loc.js'


///////////////////////////////////////////////////////////////////////////////


export default function(newBin)
{
	class C extends Bo
	{	
		static newBin	=newBin
	}

	return C
}


///////////////////////////////////////////////////////////////////////////////


class Bo
{
	bin

	/** Cell objects. In Board they're just sorted in order.
	 * For inner values, look into Obj.js */
	obj	=[]

	////---

	/** {function}	-Not the actual class, but the function which makes it.
	 * Defined in derived class
	@static
	@var newBin */


	/** tricky buffer, ONLY access it through
	 * getloc() because it can be changed to anything.
	 *@type {Loc} */	
	_loc	=new Loc()
}


///////////////////////////////////////////////////////////////////////////



Bo.prototype.setloc	=function( loc )
{
	this.bin.setloc( loc )
}


/** Location instance returned is only changed when this function is called.
 * Don't reuse it outside of class.
 * Designed like this just to save on garbage collection */

Bo.prototype. getloc	=function()
{
	return this.bin.getloc( this._loc )
}

	
///////////////////////////////////////////////////////////////////////////////
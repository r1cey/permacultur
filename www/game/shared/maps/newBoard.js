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
}


///////////////////////////////////////////////////////////////////////////



Bo.prototype.setloc	=function( loc )
{
	this.bin.setloc( loc )
}


Bo.prototype. getloc	=function()
{
	return this.bin.getloc()
}

	
///////////////////////////////////////////////////////////////////////////////
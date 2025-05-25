
///////////////////////////////////////////////////////////////////////////////


export default function(newBin)
{
	class Bo
	{	
		/** {function}	-Not the actual class, but the function which makes it. */
		static newBin	=newBin

		/** Cell objects. In Board they're just sorted in order.
		 * For inner values, look into Obj.js */
		obj	=[]
	}

	return Bo
}


///////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////


	
///////////////////////////////////////////////////////////////////////////////


/*

throw Error(666)

Bo.prototype. getbprop	=function( ic, name, jbmp )
{
	var Class	=this.constructor

	return this.bufs[Class.ibfromp[name]].getprop( ic, name, jbmp )
}


/** @returns - index of buffer where property was set *

Bo.prototype. setbprop		=function( ic, name, jbmp, val )
{
	var ibuf	=this.constructor.ibfromp[name]

	this.bufs[ibuf].setprop( ic, name, jbmp, val )

	return ibuf
}


/** @arg val	- must be string *

Bo.prototype. testbprop	=function( ic, name, jbmp, val )
{
	return this.bufs[ this.constructor.ibfromp[name] ].testprop( ic, name, jbmp, val )
}

*/

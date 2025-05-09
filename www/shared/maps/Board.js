/** Cell object used contents:
 * pl
 */

export default class Bo
{
	static Bufs

	static ibfromp	// { name: bufi }

	bufs	=[]

	o	={}

	////
	
	_loc	=new Loc()	//tricky buffer, ONLY access it through
						//getloc() because it can be changed to anything

	////

	getloc()	{return this._loc.setxy(
		this.bufs[0].head[2],
		this.bufs[0].head[3],
		this.bufs[0].head[1] )}


	cellsl()	{ return this.bufs[0].cells.length }

	/////


	/** Call this after you build static Bufs array above
	 * - atm in derived classes */
	
	static setbufp()
	{
		var Class	=this

		for(var i=0; i<Class.Bufs.length; i++)
		{
			for(var n in Class.Bufs[i].bmapo )
			{
				Class.ibfromp[n]	=i
			}
		}
	}
}




///////////////////////////////////////////////////////////////////////////////


Bo.prototype. getbprop	=function( ic, name, jbmp )
{
	var Class	=this.constructor

	return this.bufs[Class.ibfromp[name]].getprop( ic, name, jbmp )
}


/** @returns - index of buffer where property was set */

Bo.prototype. setbprop		=function( ic, name, jbmp, val )
{
	var ibuf	=this.constructor.ibfromp[name]

	this.bufs[ibuf].setprop( ic, name, jbmp, val )

	return ibuf
}


/** @arg val	- must be string */

Bo.prototype. testbprop	=function( ic, name, jbmp, val )
{
	return this.bufs[ this.constructor.ibfromp[name] ].testprop( ic, name, jbmp, val )
}



Bo.prototype. scello	=function( loc )
{
	var str	=loc.tovstr()

	var cell	=this.o[str]

	if( ! cell )	this.o[str]	=cell	={}

	return	cell
}

Bo.prototype. setcello	=Bo.prototype. scello



Bo.prototype. gcello	=function(loc)
{
	return this.o[loc.tovstr()]
}

Bo.prototype. getcello	=Bo.prototype. gcello



Bo.prototype. deloprop	=function( loc, n )
{
	var str	=loc.tovstr()

	delete this.o[str][n]

	for( n in this.o[str] )
	{
		return
	}
	
	delete this.o[str]
}

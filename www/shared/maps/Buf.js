export default class Buf
{
	head

	cells

	get c()	{return this.cells }

	get buf()	{return this.head.buffer }

	static headlen	=4*2

	static code

	static bpc		//bytes per cell

	static Arr		//Buffer Array classes

	static bmap	//[]

	static bmapo	//{}
}


///////////////////////////////////////////////////////////////////////////////



Buf.prototype. new	=function( cellsl )
{
	var Class	=this.constructor

	var buf	=new ArrayBuffer( cellsl * Class.bpc + Class.headlen )

	this.set( buf, cellsl )

	return this
}



Buf.prototype. set	=function( buf, cellsl )
{
	var Class	=this.constructor

	this.head	=new Int16Array( buf, 0, Class.headlen>>1 )

	this.head[0]	=Class.code

	this.cells	=new Class.Arr( buf, Class.headlen, cellsl )

	return this
}


///////////////////////////////////////////////////////////////////////////////



Buf.prototype. setprop		=function( ic, ibmp, jbmp, val )
{
	var start	=this.getstartbit( ibmp, jbmp )

	this.cells[ic] =Buf.smask( this.cells[ic], start, this.constructor.bmap[ibmp][jbmp], val )

	/*
	// var mask	=~((~0)<< Con.bmaps[ia][ibmp][jbmp] )

	var mask	=(1 << Con.bmap[ibmp][jbmp]) - 1	//00000111

	mask	=~(mask<< start )	//00011100 -> 11100011

	c	&= mask

	c	|= val << start

	//Map.mask(val,0,len) << start

	this.cells[ic]	=c
	*/
}



Buf.prototype. getprop	=function( ic, ibmp, jbmp )
{
	return Buf.gmask( this.cells[ic], this.getstartbit( ibmp, jbmp ), this.constructor.bmap[ibmp][jbmp] )
}

Buf.prototype. gprop	=Buf.prototype. getprop


///////////////////////////////////////////////////////////////////////////////


Buf.prototype. getstartbit	=function( ibmap, jbmap )
{
	var bmap	=this.constructor.bmap

	var start	=0

	for(var i=0; i<=ibmap; i++)
	{
		for(var j=0, jlen=bmap[i].length; j<jlen; j++)
		{
			if( i===ibmap && j===jbmap )
			{
				return start
			}

			start	+=bmap[i][j]
		}
	}
}





Buf.gmask	=function(code, start, len)
{
	var val	=code >> start

	return val	&= ~((~0)<<len)
}



Buf.smask	=function( code, start, len, val )
{
	var mask	=~((~0)<<len)

	mask	=~(mask<<start)

	code	&= mask

	return code	|= Buf.gmask(val,0,len) << start
}
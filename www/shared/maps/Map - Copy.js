import Loc from './Loc.js'
// import V from './Vec.js'


export default class Map
{
	game

	/*** HEADS ***/

	heads	=[]

	////

	static headlen	=4*2

	//implement static bufcodes[]

	getloc()	{ return this._loc.setxy(this.heads[0][2],this.heads[0][3],this.heads[0][1]) }

	////
	
	_loc	=new Loc()	//tricky buffer, ONLY access it through
						//getloc() because it can be changed to anything

	/*** BODIES ***/

	arrays	=[]

	o	={}	//objects on map

	////
	
	_r	=0
	
	cellsl()	{ return this.arrays[0].length }

	//implement bpc[]

	//implement static bmaps[]

	/*******/

	constructor(game )
	{
		this.game	=game

		/*** aliases ***/

		this.arrs	=this.arrays
	}
}


///////////////////////////////////////////////////////////////////////////////




/** Make new buffer from scratch */

Map.prototype. newbuf	=function( r, c=0, loc=new Loc(0,0,0) )
{
	if(c>0)	r =Map.cells2r(c)

	this._r	=r

	c	=Map.r2cells( r )

	var Con	=this.constructor

	var bufs	=[]

	for(var i=0,l=Con.Arrs.length; i<l; i++)
	{
		bufs[i]	=new ArrayBuffer( c*Con.bpc[i] + Map.headlen )
	}

	this.setbuf2( bufs, c )

	for(var i=0, l=Con.Arrs.length; i<l; i++)
	{
		this.heads[i][0]	=Con.bufcodes[i]
	}
	
	this.setloc( loc )

	return this
}


/** setbuf2 ... Check for legitimacy, set private values */

Map.prototype. setbuf	=function( buf )
{
	
	var c	=this.b2cells( buf.byteLength - this.headlen )
	
	this._r	=Map.cells2r( c )

	if( c !== Map.r2cells(r) )

		console.error( 'MAP BUFFER IS GIVEN WRONG SIZE', buf )
	
	this.setbuf2( buf, c )

	if( this.head[0] !== Map.code )

		console.error( 'MAP BUFFER HAD WRONG CODE!', buf )

	return this
}


///////////////////////////////////////////////////////////////////////////////


/** Set given buffers as own, don't check for legitimate sizes,
 * don't set values */

Map.prototype. setbuf2	=function( bufs, cellsn )
{
	var Con	=this.constructor

	for(var i=0,l=Con.Arrs.length; i<l; i++)
	{
		this.heads[i]	=new Int16Array( bufs[i], 0, Map.headlen>>1 )

		this.arrs[i]	=new (Con.Arrs[i])( bufs[i], Map.headlen, cellsn )
	}

	return this
}


///////////////////////////////////////////////////////////////////////////////


Map.prototype. slice	=function( c, r )
{
	var map	=this

	var map2	=new this.constructor.newbuf( r, 0, c )

	var arrs	=this.arrs

	var cell

	map2.fore(( loc )=>
	{
		var i	=map.i(loc)

		var i2	=map2.i(loc)

		for(var j=0; j<map.arrays.length; j++)
		{
			map2.arrs[j][i2]	=map.arrs[j][i]
		}
		
		map2.o[i2]	=map.o[i]
	})

	return map2
}


///////////////////////////////////////////////////////////////////////////////


Map.prototype. gcell	=function(loc)
{
	return this.o[loc]
}



Map.prototype. scell	=function( loc, oin )
{
	var cell	=this.gcell(loc)

	if( ! cell )	this.o[loc]	=cell	={}

	return	cell
}


Map.prototype. printarr	=function( ia , len=100)
{
	var str	=''

	for(var i=0; i<len && i<1000; i++)
	{
		str	+=this.arrs[ia][i]
	}
	console.log(str)
}


Map.prototype. setcode		=function( ia, ic, ibmp, jbmp, val )
{
	var Con	=this.constructor

	var c	=this.arrs[ia][ic]

	var start	=0	//start bit

	for(var i=0; i<=ibmp; i++)
	{
		for(var j=0, jlen=Con.bmaps[ia][i].length; j<jlen; j++)
		{
			if( i===ibmp && j===jbmp)
			{
				break;
			}

			start	+=Con.bmaps[ia][i][j]
		}
	}

	// var mask	=~((~0)<< Con.bmaps[ia][ibmp][jbmp] )

	var mask	=(1 << Con.bmaps[ia][ibmp][jbmp]) - 1	//00000111

	mask	=~(mask<< start )	//00011100 -> 11100011

	c	&= mask

	c	|= val << start

	//Map.mask(val,0,len) << start

	this.arrs[ia][ic]	=c
}


Map.prototype. getbuf	=function( i )
{
	return this.arrs[i].buffer
}


Map.prototype. newmsgo	=function()
{
	var o2	={}

	for(var i in this.o )
	{
		var cell	=this.o[i]

		for(var n in cell )
		{
			switch( n )
			{
				case 'pl':

					o2[i][n]	=cell[n].newmsgvis()
				break;
				default:

					o2[i][n]	=cell[n]
			}
		}
	}

	return o2
}


///////////////////////////////////////////////////////////////////////////////


Map.r2cells	=function(r)
{
	let cells=1

	for(let i=0; i<r; i++)
	{
		cells	+= 6*(i+1)
	}
	return cells
}
Map.cells2r	=function(cells)
{
	let r	=0
	for(let i=6; i<=cells; i+=6*(r+1))
	{
		r	++
	}
	return r
}

Map.jsonrplcr	=function(key,val)
{
	switch(key)
	{
		case 'cl':

			return '0'
	}
}

Map.mask	=function(code, start, len)
{
	var val	=code >> start

	return val	&= ~((~0)<<len)
}
Map.mask_s	=function( code, start, len, val )
{
	var mask	=~((~0)<<len)

	mask	=~(mask<<start)

	code	&= mask

	return code	|= Map.mask(val,0,len) << start
}




Map.prototype. ready	=function()
{
	return Boolean(this.arr)
}



Map.prototype. bits_gstartlen	=function( n, i )
{
	var bits	=this.bits_map

	var start	=0, len	=0

	for(var ib=0; ib<bits.length && !len; ib++)
	{
		if( bits[ib][0] === n )
		{
			for(var ia=1; ia<bits[ib].length; ia++)
			{
				if( ia === i+1 )
				{
					len	=bits[ib][ia]

					break
				}

				start	+= bits[ib][ia]
			}
		}
	}

	return { start, len }
}



Map.prototype.getacode	=function( code, n, i )
{
	var { start, len }	=this.bits_gstartlen( n, i )

	return Map.mask( code, start, len )
}
Map.prototype. code_s	=function( code, n, i, val )
{
	var { start, len }	=this.bits_gstartlen( n, i )

	return  Map.mask_s( code, start, len, val )
}



Map.prototype. rhombsize	=function()
{
	return this._r*(this._r+1)
}


Map.prototype. i	=function( loc )
{
	let rsize	=this.rhombsize()

	var v	=this.getloc().neg().addv(loc)

	return (v.x>=0 && v.y<0) * (v.x*this._r - v.y) +
		(v.y>=0 && v.z()<0) * (rsize + v.y*this._r - v.z()) +
		(v.z()>=0 && v.x<0) * (rsize*2 + v.z()*this._r - v.x);
}


Map.prototype. arr_g	=function(id, loc)
{
	return this.arrs[i][this.i(loc)]
}
Map.prototype. arr_s	=function(id, loc, val)
{
	this.arrs[i][this.i(loc)]	=val
}


Map.prototype. arr_gdata	=function( loc, n, i )
{
	return this.code_g( this.arr_g(loc), n, i )
}
Map.prototype. arr_sdata	=function( loc, n, i, val )
{
	var ia	=this.i(loc)

	this.arr[ia]	=this.code_s( this.arr[ia], n, i, val )
}


/** @arg fun	- ( loc, code, cell ) 

Map.prototype. o_for	=function( fun )
{
	var x,y
	
	var o	=this.o

	var code	=this.code

	var loc	=new V()

	for(x in o)
	{
		for(y in o[x])
		{
			loc.setxy(+x,+y)

			fun(loc, this.arr_g(loc), o[x][y])
		}
	}
}
*/

Map.prototype. o_g	=function(loc)
{
	return this.o[loc]
}
Map.prototype. o_s	=function( loc )
{
	return this.o[loc]	??={}
}


Map.prototype. gjson	=function()
{
	var o	=this.o

	return JSON.stringify( o, Map.jsonrplcr )
}


/** Not needed atm and maybe later 


Map.o_sparse	=function( o, fun )
{
		{
			for(var p2 in cell[p1])
			{
				if( p2 === 'loc' )
				{
					cell[p1][p2]	=new V().seta(cell[p1][p2])
				}
			}
		}

		fun( loc, code, cell )
	})

	var loc	=new V()

	for(var x in o )
	{
		for(var y in o[x])
		{
			var cell	=o[x][y]

			loc.setxy(+x,+y)

			for(var p1 in cell )
			{
				for(var p2 in cell[p1])
				{
					if( p2 === 'loc' )
					{
						cell[p1][p2]	=new V().seta(cell[p1][p2])
					}
				}
			}

			fun( loc, cell )
		}
	}
}
*/


Map.prototype. inside	=function( v )
{
	return this.getloc().disth(v) <= this._r
}




Map.prototype. corner	=function(dir)
{
	return Loc.dirvh[dir].c().mul(this._r).addv(this.getloc())
}

/** DON'T CHANGE VALUES OF VECTOR IN FUN() !!!
 * If fun returns true then stop looping.
 */

Map.prototype. fore	=function( fun, r, c )
{
	var v, ir, dir, i

	r	??=this._r

	c	??=this.getloc()

	v	= c.c()

	if( fun(v, this) ) return v

	for(ir=0; ir<r; ir++)
	{
		v.neighh( 4 )

		for(dir=0; dir<6; dir++)
		{
			for(i=0; i<ir; i++)
			{
				if( this.inside(v) )
				{
					if( fun(v, this) ) return v
				}

				v.neighh(dir)
			}
		}
	}
}

/** DO NOT CHANGE VECTOR IN FUN() !!! */

Map.prototype. fordiredge	=function( fun, dir, r, c )
{
	r	=r?? this._r

	var v	= c ? c.c() : this.getloc().c()

	v.steph( Loc.roth(dir,-1), r )

	dir	=Loc.roth(dir,1)

	for(let s=0; s<2; s++)
	{
		for(let i=0; i < r; i++)
		{
			fun( v, this )

			v.neighh(dir)
		}
		dir	=Loc.roth(dir,1)
	}
	fun( v, this )
}


/** @arg newcells
 * @arg newcells.code
 * @arg newcells.o
 */

Map.prototype. shift	=function( dir, newcells )
{
	var map	=this

	map.setloc(map.getloc().addv( Loc.dirvh[dir] ))

	var diropp	=Loc.roth(dir, Loc.dirvh.length>>1)

	var r	=this._r
	
	var coropp	=this.corner(diropp)

	var v	=new Loc()
	
	var vnext	=new Loc()

	for(var i, j, side =-1; side <= 1; side += 2 )
	{
		for(j=0;  j < r+1; j++)
		{
			if( j===0 && side>0 )	continue

			v.set( coropp.c().steph(Loc.roth(dir, side), j) )

			vnext.set( v.c().neighh(dir) )

			for(i=0; i < (r<<1)-j; i++)
			{
				this.arr_s( v, this.arr_g(vnext) )

				var cell	=this.o_g( vnext )

				if(cell)	this.o[v]	=cell

				v.neighh(dir)

				vnext.neighh(dir)
			}
		}
	}
	
	var i	=0

	this.fordiredge( function( v, map )
	{
		map.arr_s( v, newcells[i].code )

		if( newcells[i].o )
		{
			map.o[v]	=newcells[i].o
		}

		i++
	}
	, dir )
}


Map.prototype.setloc	=function( loc )
{
	for(var i=0, l=this.heads.length; i<l; i++)
	{
		this.heads[i][2]	=loc.x
		this.heads[i][3]	=loc.y
		this.heads[i][1]	=loc.h
	}
}

import newBoard from './newBoard.js'
import newBinMap	from "./newBinMap.js"
import Obj from './Obj.js'

import Loc from '../Loc.js'


/** Hexagonally round version of Board. */

export default class Map extends newBoard(newBinMap)
{
	obj	=new Obj()

	_r	=0

	////
}


///////////////////////////////////////////////////////////////////////////////



Map.prototype. build	=function( r, maxc =0, loc =new Loc(0,0,0) )
{
	var C	=this.constructor

	this.bin	=new C.Bin( r, maxc, loc )

	this._r	=this.bin.get("r")
}



Map.prototype. setbuf	=function( buf )
{
	var C	=this.constructor

	this.bin	=new C.Bin( buf )

	this._r	=this.bin.get("r")
}




Map.prototype. isready	=function()
{
	return Boolean( this.bin?.getbuf() )
}


///////////////////////////////////////////////////////////////////////////////


/** Can player move there?
 *Can optimize by making special case for server maps by testing for
 *distance from 0,0 */

Map.prototype. isplmov	=function( dest )
{
	return ! this.obj.g(dest)?.pl && this.inside( dest )
}


///////////////////////////////////////////////////////////////////////////////


Map.prototype. printarr	=function( ibuf , r=6, c )
{
	var str	=''

	var ir	=0

	if( !c )	c	=this.getloc()

	this.fore(( loc, r2 )=>
	{
		if( r2 > ir )
		{
			str	=str.replace( /,$/, '|')

			ir ++
		}

		str	+=this.gcellc( ibuf, loc ) + ','
	}
	, r, c )

	console.log(str)
}



Map.prototype. getloc	=function()
{
	return this.bin.getloc()
}


/**@arg {string[]} valname */

Map.prototype. cmpbinval	=function( loc, valname, strval )
{
	this.bin.cmpval( this.ic(loc), valname, strval )
}



Map.prototype. slice	=function( c, r )
{
	var map	=this

	var map2	=new this.constructor()

	map2.build( r, 0, new Loc( c.x, c.y, map.getloc().h ) )

	map2.fore(( loc )=>
	{
		if( map.inside(loc) )
		{
			map2.copycell( loc, map, loc )
		}
	})

	return map2
}



///////////////////////////////////////////////////////////////////////////////



/** DON'T CHANGE VALUES OF VECTOR IN FUN() !!!
 * If fun returns true then stop looping.
 * @arg {function} fun -( loc, distance, map )
 * @arg [r=mapRadius]
 * @arg [c=mapCenter]	-center from where to start looping */

Map.prototype. fore	=function( fun, r, c )
{
	var v, ir, dir, i

	r	??=this._r

	c	??=this.getloc()

	v	= c.c()

	if( fun(v, 0, this) ) return v

	for(ir=1; ir<=r; ir++)
	{
		v.neighh( 4 )

		for(dir=0; dir<6; dir++)
		{
			for(i=0; i<ir; i++)
			{
				if( this.inside(v) )	// I can optimise this
				{
					if( fun(v, ir, this) ) return v
				}

				v.neighh(dir)
			}
		}
	}
}


/** DON'T CHANGE VALUES OF VECTOR IN FUN() !!!
 * If fun returns true then stop looping?
 * fun( loc, map )
 */

Map.prototype. forring	=function( fun, r, c )
{
	if( ! r )
	{
		return fun( c, this )
	}

	r	??=this._r

	c	??=this.getloc()

	var v	=c.clone()

	v.steph( 4, r )

	for(var dir=0; dir<6; dir++)
	{
		for(var i=0; i<r; i++)
		{
			if( this.inside(v) )
			{
				if( fun( v, this ))	return v
			}

			v.neighh(dir)
		}
	}
}



/*
Map.prototype. forstar	=function( fun, r, c )
{
	if( ! r )
	{
		return fun( c, this )
	}

	r	??=this._r

	c	??=this.getloc()

	var v	=c.clone()

	v.steph( 4, r )

	for(var dir =0; dir < 6; dir++)
	{
		for(var i =r)
	}
}*/


/** Sets map height to loc */

Map.prototype. loch	=function( loc )
{
	loc.h	=this.getloc().h

	return loc
}



Map.prototype. copycell	=function( loc, map2, loc2 )
{
	this.setcell_b( loc, map2.getcell_b( loc2 ) )

	var str2	=loc2.tovstr()

	if( map2.obj.o[str2] )
	{
		this.obj.o[loc.tovstr()]	=map2.obj.o[str2]
	}
	else
	{
		delete this.obj.o[loc.tovstr()]
	}
}




///////////////////////////////////////////////////////////////////////////////



Map.prototype. getcell_b	=function( loc )
{
	return this.bin.getcell( this.ic(loc) )
}

Map.prototype. gcell_b	=Map.prototype. getcell_b




Map.prototype. 	setcell_b=function( loc, vals )
{
	this.bin.setcell( this.ic(loc), vals )
}



Map.prototype. newmsgo	=function()
{
	var o2	={}

	for(var locn in this.o )
	{
		var cell	=this.o[locn]

		o2[locn]	={}

		for(var p in cell )
		{
			switch( p )
			{
				case 'pl':

					o2[locn][p]	=cell[p].newmsgvis()
				break;
				default:

					o2[locn][p]	=cell[p]
			}
		}
	}

	return o2
}


///////////////////////////////////////////////////////////////////////////////



Map.jsonrplcr	=function(key,val)
{
	switch(key)
	{
		case 'cl':

			return '0'
	}
}




/*
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
	var start, len

}	=this.bits_gstartlen( n, i )

	return Map.mask( code, start, len )
}
Map.prototype. code_s	=function( code, n, i, val )
{
	var { start, len }	=this.bits_gstartlen( n, i )

	return  Map.mask_s( code, start, len, val )
}
*/



Map.prototype. i	=function( loc )
{
	let rsize	=this._r*(this._r+1)

	var v	=this.getloc().neg().addv(loc)

	return (v.x>=0 && v.y<0) * (v.x*this._r - v.y) +
		(v.y>=0 && v.z()<0) * (rsize + v.y*this._r - v.z()) +
		(v.z()>=0 && v.x<0) * (rsize*2 + v.z()*this._r - v.x);
}

Map.prototype. ic	=Map.prototype.i



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



/** DO NOT CHANGE VECTOR IN FUN() !!! */

Map.prototype. fordiredge	=function( fun, dir, r, c )
{
	r	=r?? this._r

	var v	= c ? c.c() : this.getloc().c()

	v.steph( Loc.roth(dir,-1), r )

	dir	=Loc.roth(dir,1)

	for(var s=0; s<2; s++)
	{
		for(var i=0; i < r; i++)
		{
			if( this.inside(v) )	fun( v, this )

			v.neighh(dir)
		}

		dir	=Loc.roth(dir,1)
	}

	if( this.inside(v) )	fun( v, this )
}


/** Shift map in certain direction, add data
 * from cells array for revealed cells
 * @arg {Number}	dir	- direction
 * @arg {Array}	arrs	-for each buffer an array of codes
 * @arg {Array} objs	-empty cells are empty
 * @arg {Function}	parse	- parsing function to call on each object added
 */

Map.prototype. shift	=function( dir, arrs, objs, parse )
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
				this.copycell( v, this, vnext )

				v.neighh(dir)

				vnext.neighh(dir)
			}
		}
	}

	var ic	=0

	var bufs	=map.bufs

	var len	=map.constructor.Msg.Bufs.length

	map.fordiredge(( v )=>
	{
		var mapi	=map.i(v)

		for(var ib=0; ib<len; ib++)
		{
			bufs[ib].cells[mapi]	=arrs[ib][ic]
		}

		if( objs[ic] )
		{
			map.o[v.tovstr()]	=parse( objs[ic] )
		}
		else
		{
			delete map.o[v.tovstr()]
		}

		/*
		if( ! cells[ic] )
		{
			cells[ic]	=new Uint8Array(map.bufs.length)
		}


		for(var ib=0; ib<map.bufs.length; ib++)
		{
			map.bufs[ib].cells[mapi]	=cells[ic][ib]
			
			// map.scellc( ib, v, ccodes[i] )
		}

		mapi	=v.tovstr()

		if( cells[ic][ib] )
		{
			map.o[mapi]	=parse( cells[ic][ib] )
		}
		else
		{
			delete map.o[mapi]
		}*/

		ic++
	}
	, dir )
}



Map.prototype.setloc	=function( loc )
{
	this.bin.setloc( loc )
}


///////////////////////////////////////////////////////////////////////////////


/** @returns next available id */

Map.setids	=function( startid )
{
	var id	=startid

	for(var i =0;i< this.Bufs.length ;i++)
	{
		if( this.Bufs[i].skipid )	continue

		this.Bufs[i].id	=id

		id++
	}

	return id
}


/** Creates new buffer class
 * @arg bmap	- [{name:[[bits],[bits,[enum]],...]},{name,[...]}]
 */

Map.newBuf	=function( bpc, bmap, skipid )
{
	var g
	
	if(typeof window == 'object' && window)
		g	=window
	else if(typeof global == 'object' &&  global)
		g	=global

	var clss	=class extends Buf
	{
		static bpc	=bpc
		
		static Arr	=g['Uint'+(bpc<<3)+'Array']

		static bmap	=[]

		static bmapo	={}

		static skipid	=skipid
	}

	for(var i =0;i< bmap.length ;i++)
	{
		clss.bmap[i]	=[]

		for(var n in bmap[i] )
		{
			for(var j =0;j< bmap[i][n].length ;j++)
			{
				var bits	=bmap[i][n][j]

				if( typeof bits === "number" )	bits	=[bits]

				if( bits.length > 1 )
				{
					var enum1	={}

					for(var ie =0; ie< bits[1].length ;ie++)
					{
						enum1[bits[1][ie]]	=ie
					}

					bits[1]	=enum1
				}

				clss.bmap[i][j]	=bits

				clss.bmapo[n]	=i
			}
		}
	}

	return clss
}




Map.ibfrombid	=function( bid )
{
	for(var i =0;i< this.Bufs.length; i++)
	{
		if( this.Bufs[i].id === bid )
		{
			return i
		}
	}
	return -1
}




Map.codefrombuf	=function( buf )
{
	return new DataView( buf, 0, 2 ).getUint16( 0, true )
}

Map.timefromcode	=( code )	=> code>>8

Map.idfromcode	=( code )	=> code & 15

Map.dirfromcode	=( code )	=> ( (code&255)>>4 ) - 1




Map.getbmapbits	=function( name , j )
{
	var Buf	=this.Bufs[this.ibfromp[name]]

	return Buf.bmap[Buf.bmapo[name]][j][0]
}
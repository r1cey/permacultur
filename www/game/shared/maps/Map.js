import newBoard from './newBoard.js'
import newBinMap	from "./newBinMap.js"
import Obj from './Obj.js'

import Loc from '../Loc.js'

import Cnt from '../Container.js'


/** Hexagonally round version of Board.
 * In derived classes, make sure every set..._i method
 * has a matching regular set... method. The reason is:
 * when _i is called on server, the client will be sent regulat method */

export default class Map extends newBoard(newBinMap)
{
	obj	=new Obj(this)

	get _r()	{return this.bin.getr()}

	bin2	//optional additional binmap for local calculations

	////
}


///////////////////////////////////////////////////////////////////////////////



Map.prototype. build	=function( r, maxc =0, loc =new Loc(0,0,0) )
{
	var Map	=this.constructor

	this.setbin( new Map.Bin( r, maxc, loc ) )
}



Map.prototype. setbuf	=function( buf )
{
	var C	=this.constructor

	this.setbin( new C.Bin( buf ) )
}



Map.prototype. setbin	=function( bin )
{
	this.bin	=bin
}


Map.prototype. ready	=function()
{
	return this.bin
}


///////////////////////////////////////////////////////////////////////////////



Map.prototype. inside	=function( loc )
{
	return this.bin.inside( loc )
}


/**@arg {Loc}	loc
 * @arg {}	o	-The object as it appears in map obj.
 * 		It's done so local json parser handles it like it handles map obj */

Map.prototype. additem	=function( loc, o )
{
	for(var itemn in o )
	{
		this.obj.set(loc)[itemn]	=o[itemn]
	}
}


///////////////////////////////////////////////////////////////////////////////


/** Can player move there?
 *Can optimize by making special case for server maps by testing for
 *distance from 0,0 */

Map.prototype. canplmov	=function( dest, pl )
{
	var o	=this.obj.g(dest)
	
	return this.inside(dest) && ( !o ||

		(!o.pl || o.pl===pl) && !o.dewd )
}


/**@todo Create class for the returned container. */

Map.prototype. getcnt	=function( v )
{
	var cnt	=new Cnt()

	cnt.map	=this

	cnt.v	=v

	cnt.getinv	=function( name )
	{
		this.map.obj.g( this.v )[name]
	}
	cnt.additem	=function( item, num )
	{
		this.map.additem( this.v, item, num )
	}
	cnt.delitem	=function( item, num )
	{
		this.map.delitem( this.v, item, num )
	}
	return cnt
}


/**@todo Add limits and spread of items
 * @returns Supposed to return the amount of items successfully added */

Map.prototype. additem	=function( v, item, num )
{
	var newit	=new item.constructor( item, num )

	this.obj.s(v)[item.constructor.name]	=newit

	return num
}

Map.prototype. delitem	=function( v, item, num )
{
	console.log("WARN: Haven't added map.delitem yet")
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



Map.prototype. fore	=function( fun, r, c )
{
	return this.bin.fore( fun, r, c )
}



Map.prototype. forring	=function( fun, r, c )
{
	return this.bin.forring( fun, r, c )
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
	var ic	=this.ic(loc)

	var ic2	=map2.ic(loc2)

	this.bin.setcell( ic, map2.bin.getcell( ic2 ) )

	/*if( this.bin2 && map2.bin2 )
	{
		this.bin2.setcell( ic, map2.bin2.getcell( ic2 ) )
	}*/

	var str2	=loc2.tovstr()

	if( map2.obj.o[str2] )
	{
		this.obj.o[loc.tovstr()]	=map2.obj.o[str2]
	}
	/*else
	{
		delete this.obj.o[loc.tovstr()]
	}*/
}




///////////////////////////////////////////////////////////////////////////////



Map.prototype. gbincell	=function( loc )
{
	return this.bin.getcell( this.ic(loc) )
}





Map.prototype. 	sbincell=function( loc, vals )
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
	return this.bin.ic( loc )
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






/*
Map.getbmapbits	=function( name , j )
{
	var Buf	=this.Bufs[this.ibfromp[name]]

	return Buf.bmap[Buf.bmapo[name]][j][0]
}*/
import Loc from '../../www/game/shared/Loc.js'

import Item from '../../www/game/shared/items/Item.js'



/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "s_" and "send_" PREFIXES 
 * ***

export default class ClS
{
	
}*/

var out	={}


///////////////////////////////////////////////////////////////////////////////



out. setclpl	=function()
{
	return[[ this.pl ]]
}



out. setmap	=function()
{
	var{ pl }	=this

	var game	=this.srv.game

	var slicedgr	=game.maps.gr.slice( pl.loc, pl.vision )

	this.sendbin( slicedgr.bin.getbuf())

	var slicedtr	=pl.game.maps.tr.slice( pl.loc, pl.vision )

	this.sendbin( slicedtr.bin.getbuf())

	return[
		[
			{ gr :slicedgr.obj.o, tr :slicedtr.obj.o }
			,
			pl.loc
			,
			pl.vision
		] ,
		( key, val )=> key==="pl"&&pl.name===val.name ? val.name : val
	]
}


//////////////////////////////////////////////////////////////////////////////


/** This client's player had moved. */

out. clplmov	=function( delta )
{
	var{ pl }	=this

	var	loc	=pl.loc
	
	var dir	=Loc.dirv2dirh( delta )

	var r	=pl.vision

	var obj	={ gr	:0 , tr	:0 }

	var boards	=this.srv.game.maps.gshiftboards( loc, r, dir )

	for(var n in boards )
	{
		this.sendbin( boards[n].bin.getbuf() )

		obj[n]	=boards[n].obj
	}
	return[[ obj, loc, r, dir ]]
}


out. movrej	=function( newloc )
{
	return[[ newloc ]]
}


/** Assumes player has already climbed */

out. clplclimb	=function( dir )
{
	this.sendjson({ clplclimb: { dir, newloc: this.pl.loc }})
}



out.setclplitem	=function( item )
{
	return [[ item.gkey() ,item  ]]
}



out.setclplitemcnt	=function( path ,item )
{
	return [[ path ,item.gkey() ,item ]]
}


///////////////////////////////////////////////////////////////////////////////



out. map_additem	=function( map ,loc ,item )
{
	return [[ map.bin.constructor.id ,loc ,item.toJSON(Item.key) ]]
}


/** @arg {string} act 
 * @arg {array} vals */

out. mapset_	=function( map, act, loc, vals )
{
	return [
		[
			map.bin.constructor.id
			,
			loc
			,
			act
			,
			vals
		]
	]
}



out. mapobjset	=function( map, loc, key )
{
	this.sendjson({mapobjset:
		[
			loc , key , map.obj.g(loc)[key]
		]
	})
}


///////////////////////////////////////////////////////////////////////////////

/** New player born. */

out. newpl	=function( pl2 )
{
	this.sendjson({ newpl: pl2 })
}


/** Different player connected */

out. plconn	=function( pl2 )
{
	this.sendjson({ plconn: { name: pl2.name, cl: pl2.cl ? 1 : 0 }})
}



/*Send.prototype. createpl	=function( name )
{
	this.json({ createpl: name })
}

Send.prototype. units	=function( clid, pln )
{
	var pls	=this.s.g.pls

	var pl	=pls[pln]

	var o	=
	{
		pls	:[]
	}
	
	this.s.g.forseenpls( pln, ( pl2n )=>
	{
		o.pls.push( pls[pl2n].newmsgvis( pl2n ) )
	})
	
	this.json( clid, {units: o})
}

Send.prototype. water	=function()
{
	this.send_json({ water: this.pl.water })
}*/



/** Player object should have old location still. */

out. plmov	=function( clid, pl2n, newloc, seen, pl2 )
{
	var pl	=this.cl.pl

	var o	={ loc: newloc.newarr() }

	seen ?
		o.name	=pl2n	:
		o.pl	=pl2.newmsgvis(pl2n)

	this.sendjson(clid, { plmov: o })
}



out. actonobj	=function( loc, key, act, params )
{
	this.sendjson({actonobj:{ loc, key, act, params }})
}



out.setplitem	=function( plname ,plloc ,item )
{
	return [[ plname ,plloc ,item.constructor.key ,item ]]
}


///////////////////////////////////////////////////////////////////////////////



out. wrtc	=function( o )
{
	return[[ o ]]
}


out. error	=function( str )
{
	return[[ str ]]
}



///////////////////////////////////////////////////////////////////////////////


export default out


/*
for(var funn in ClS.prototype)
{
	ClS.prototype["send_"+funn]	=ClS.prototype[funn]

	ClS.prototype["s_"+funn]	=ClS.prototype[funn]

	delete ClS.prototype[funn]
}*/
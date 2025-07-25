import newjsontr from "../../www/game/shared/newjsontransfrm.js"
var jsontr	=newjsontr()

import Loc from '../../www/game/shared/Loc.js'



/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "s_" and "send_" PREFIXES 
 * ***/

export default class ClS
{
	
}


///////////////////////////////////////////////////////////////////////////////



ClS.prototype. setpl	=function()
{
	this.sendjson({ setpl: this.pl }, jsontr.replcr)
}



ClS.prototype. setmap	=function()
{
	var pl	=this.pl

	var game	=this.srv.game

	var slicedgr	=game.maps.gr.slice( pl.loc, pl.vision )

	this.sendbin( slicedgr.bin.getbuf())

	var slicedtr	=pl.game.maps.tr.slice( pl.loc, pl.vision )

	this.sendbin( slicedtr.bin.getbuf())

	var replcr	=newjsontr(
		{
			pl	:
			{
				rep	:( val )=> this.pl.name===val.name ? val.name : val
			}
		}).replcr
		
	this.sendjson(
		{
			setmap:
			{
				obj	:{ gr :slicedgr.obj.o, tr :slicedtr.obj.o }
				,
				loc	:pl.loc
				,
				r	:pl.vision
			}
		}, replcr )
}


//////////////////////////////////////////////////////////////////////////////



ClS.prototype. mapaddobj	=function( map, loc, o )
{
	this.sendjson({mapaddobj:
		{
			mapid	:map.bin.constructor.id
			,
			loc
			,
			o
		}})
}


/** @arg {string} act 
 * @arg {array} vals */

ClS.prototype. mapset_	=function( map, act, loc, vals )
{
	this.sendjson({mapset_:
		{
			mapid	:map.bin.constructor.id
			,
			loc
			,
			vals
			,
			act
		}})
}


///////////////////////////////////////////////////////////////////////////////


/** This client's player had moved. */

ClS.prototype. clplmov	=function( delta )
{
	var pl	=this.pl

	var msg	=
	{
		loc	:pl.loc ,
		dir	:Loc.dirv2dirh( delta ) ,
		r	:pl.vision ,
		obj	:
		{
			gr	:0 ,
			tr	:0
		}
	}

	var boards	=this.srv.game.maps.gshiftboards( msg.loc, msg.r, msg.dir )

	for(var n in boards )
	{
		this.sendbin( boards[n].bin.getbuf() )

		msg.obj[n]	=boards[n].obj
	}

	this.sendjson({ clplmov : msg })
}


ClS.prototype. movrej	=function( newloc )
{
	this.sendjson({ movrej :newloc })
}


/** New player born. */

ClS.prototype. newpl	=function( pl2 )
{
	this.sendjson({ newpl: pl2 })
}


/** Different player connected */

ClS.prototype.plconn	=function( pl2 )
{
	this.sendjson({ plconn: { name: pl2.name, cl: pl2.cl ? 1 : 0 }})
}



/** Assumes player has already climbed */

ClS.prototype. clplclimb	=function( dir )
{
	this.sendjson({ clplclimb: { dir, newloc: this.pl.loc }})
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

ClS.prototype. plmov	=function( clid, pl2n, newloc, seen, pl2 )
{
	var pl	=this.cl.pl

	var o	={ loc: newloc.newarr() }

	seen ?
		o.name	=pl2n	:
		o.pl	=pl2.newmsgvis(pl2n)

	this.sendjson(clid, { plmov: o })
}



ClS.prototype. actonobj	=function( loc, key, act, params )
{
	this.sendjson({actonobj:{ loc, key, act, params }})
}



ClS.prototype. wrtc	=function( o )
{
	this.sendjson({ wrtc: o })
}


ClS.prototype. error	=function( str )
{
	this.sendjson({ error: str })
}



///////////////////////////////////////////////////////////////////////////////


for(var funn in ClS.prototype)
{
	ClS.prototype["send_"+funn]	=ClS.prototype[funn]

	ClS.prototype["s_"+funn]	=ClS.prototype[funn]

	delete ClS.prototype[funn]
}
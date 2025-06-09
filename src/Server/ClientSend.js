import * as json from '../../www/shared/json.js'

import Loc from '../../www/shared/Loc.js'



/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "s_" and "send_" PREFIXES 
 * ***/

export default class ClS
{
	
}


///////////////////////////////////////////////////////////////////////////////



ClS.prototype. setpl	=function()
{
	this.sendjson({ setpl: this.pl }, json.newreplcr())
}



ClS.prototype. setmap	=function()
{
	var pl	=this.pl

	var game	=this.srv.game

	var slicedgr	=game.maps.gr.slice( pl.loc, pl.vision )

	this.sendbin( slicedgr.bin.getbuf())

	var slicedtr	=pl.game.maps.tr.slice( pl.loc, pl.vision )

	this.sendbin( slicedtr.bin.getbuf())

	var jsonrule	=json.newrules(
		{
			pl	:
			{
				rep	:( val )=> this.pl.name===val.name ? val.name : val
			}
		}
	)

	this.sendjson(
		{
			setmap:
			{
				obj	:[slicedgr.obj.o, slicedtr.obj.o]
				,
				loc	:pl.loc
				,
				r	:pl.vision
			}
		}, json.newreplcr(jsonrule) )
}


//////////////////////////////////////////////////////////////////////////////


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

	var timecode	=this.tc.next()

	var msg	=
	{
		timecode,
		loc	:pl.loc,
		delta,
		r	:pl.vision,
		cells	:
		{
			gr	:null,
			tr	:null
		}
	}

	var boards	=this.game().maps.gshiftboards( msg.loc, msg.r, delta, msg.timecode )

	for(var n in boards )
	{
		this.sendbin( boards[n].getbuf() )

		msg.cells[n]	=boards[n].obj
	}

	this.sendjson({ clplmov : msg })

	/*
	var{ loc }	=pl

	var r	=pl.vision

	// var dir	=newloc.c().subv( pl.loc )

	var cellso	=[[],[]]

	var msg	=
	{
		timecode, loc, delta , r
		,
		cells	:cellso
	}

	/* prepare binary buffers *

	var bcodes	=[[],[]]	// binary codes

	var maps	=this.srv.game.maps

	maps.fore(( map )=>
	{
		var Map	=map.constructor

		for(var ib =0;ib< map.bufs.length ;ib++)
		{
			var Buf	=Map.Bufs[ib]

			var mhead	=map.head

			var cellslen	=(r << 1) + 1

			var buf	=new ArrayBuffer( Buf.headlen + Buf.Arr.BYTES_PER_ELEMENT * cellslen)

			var head	=Buf.newheadarr( buf )

			arr[0]	=(mhead[0]<<8) + dir
			arr[1]	=loc.h
			arr[2]	=loc.x
			arr[3]	=loc.y

			var cells	=new Buf.Arr( buf , Buf.headlen ,  cellslen )

			bcodes[map.getloc().h][ib]	=cells
		}
	})

	/* fill cells data *

	var ic	=0

	var h, ib, len, cello

	maps.gr.fordiredge(( loc )=>
	{
		maps.fore((map)=>
		{
			h	=map.getloc().h
	
			var bufs	=map.bufs
	
			for( ib =0,len= bufs.length ;ib<len;ib++)
			{
				bcodes[h][ib][ic]	=map.gcellc( ib, loc )
			}

			cello	=map.gcello( loc )

			if( cello )
			{
				cellso[h][ic]	={}

				for(var prop in cello )
				{
					switch( prop )
					{
						case 'pl' :

							cellso[h][ic].pl	=cello.pl.newmsgvis()
						break;
						default:

							cellso[h][ic][prop]	=cello[prop]
					}
				}
			}

			ic ++
		})
	},
	dir, r, loc )

	/* send *

	for(var h =0;h< 2 ;h++)
	{
		for(var ib =0,len= carrs[h].length ;ib<len;ib++)
		{
			this.send_binary( bcodes[h][ib].buffer )
		}
	}

	this.s.json({ clplmov: o })*/
}


/** New player born. */

ClS.prototype. newpl	=function( pl2 )
{
	this.sendjson({ newpl: pl2 })
}


/** Different player connected */

ClS.prototype.plconn	=function( pl2 )
{
	this.send_json({ plconn: { name: pl2.name, cl: pl2.cl ? 1 : 0 }})
}



/** Assumes player has already climbed */

ClS.prototype. clplclimb	=function( dir )
{
	this.send_json({ clplclimb: { dir, newloc: this.pl.loc }})
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

	this.send_json(clid, { plmov: o })
}

ClS.prototype. wrtc	=function( o )
{
	this.send_json({ wrtc: o })
}


ClS.prototype. error	=function( str )
{
	this.send_json({ error: str })
}



///////////////////////////////////////////////////////////////////////////////


for(var funn in ClS.prototype)
{
	ClS.prototype["send_"+funn]	=ClS.prototype[funn]

	ClS.prototype["s_"+funn]	=ClS.prototype[funn]

	delete ClS.prototype[funn]
}
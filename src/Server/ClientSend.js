import NS from '../../www/shared/NSpace.js'

import Loc from '../../www/shared/Loc.js'

export default class Send extends NS
{
	
}


///////////////////////////////////////////////////////////////////////////////


Send.prototype. setpl	=function()
{
	this.send.json({ setpl: this.pl.newmsg() })
}



Send.prototype. map	=function()
{
	var pl	=this.pl

	var slicedgr	=pl.game.maps.gr.slice( pl.loc, pl.vision )

	for(var i=0; i<slicedgr.bufs.length; i++)
	{
		this.send.binary( slicedgr.bufs[i].buf )
	}

	var slicedtr	=pl.game.maps.tr.slice( pl.loc, pl.vision )

	for(i=0; i<slicedtr.bufs.length; i++)
	{
		this.send.binary( slicedtr.bufs[i].buf )
	}

	this.send.json(
		{
			setmap:
			{
				o: [slicedgr.o, slicedtr.o], loc: slicedgr.getloc(), r: pl.vision
			}
		},( key, val )=>
		{
			switch(key)
			{
				case 'pl' :

					if( this.pl.name === val.name )
					{
						return 0
					}
					else
					{
						return val.newmsgvis()
					}
			}
			
			return val
		})
}


//////////////////////////////////////////////////////////////////////////////



Send.prototype. mapcode	=function( map, loc, ic, ib )
{
	var Bufs	=map.constructor.Bufs

	ic	??=map.i(loc)

	if( ib )	send(ib)

	else
	{
		for(ib =0;ib< Bufs.length; ib++)
		{
			send( ib )
		}
	}


	function send(ib)
	{
		this.send.json({mapcode:
			{
				bid	:Bufs[ib].id ,
				loc ,
				bval	:map.bufs[ib].cells[ic] 
			}})
	}
}


///////////////////////////////////////////////////////////////////////////////


Send.prototype. clplmov	=function( dir )
{
	var pl	=this.pl

	var{ loc }	=pl

	var r	=pl.vision

	// var dir	=newloc.c().subv( pl.loc )

	var cellso	=[[],[]]
	
	var timecode	=Math.floor(Math.random()*255) + 1

	var o	=
	{
		timecode, loc, dir , r
		,
		cells	:cellso
	}

	/* prepare binary buffers */

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

	/* fill cells data */

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

	/* send */

	for(var h =0;h< 2 ;h++)
	{
		for(var ib =0,len= carrs[h].length ;ib<len;ib++)
		{
			this.send.binary( bcodes[h][ib].buffer )
		}
	}

	this.s.json({ clplmov: o })
}


/** New player born. */

Send.prototype. newpl	=function( pl2 )
{
	this.send_json({ newpl: pl2.newmsgvis() })
}


/** Different player connected */

Send.prototype.plconn	=function( pl2 )
{
	this.send_json({ plconn: { name: pl2.name, cl: pl2.cl ? 1 : 0 }})
}



/** Assumes player has already climbed */

Send.prototype. clplclimb	=function( dir )
{
	this.send.json({ clplclimb: { dir, newloc: this.pl.loc }})
}


///////////////////////////////////////////////////////////////////////////////


Send.prototype. json	=function( o, replcr )
{
	this.ws.send( JSON.stringify( o, replcr ) )
}

Send.prototype. binary	=function( buf )
{
	this.ws.send( buf, {binary: true})
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
	this.send.json({ water: this.pl.water })
}*/



/** Player object should have old location still. */

Send.prototype. plmov	=function( clid, pl2n, newloc, seen, pl2 )
{
	var pl	=this.cl.pl

	var o	={ loc: newloc.newarr() }

	seen ?
		o.name	=pl2n	:
		o.pl	=pl2.newmsgvis(pl2n)

	this.json(clid, { plmov: o })
}

Send.prototype. wrtc	=function( o )
{
	this.json({ wrtc: o })
}




Send.prototype. error	=function( str )
{
	this.send.json({ error: str })
}
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

					if( this.pl === val )
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



Send.prototype. mapcode	=function( bcode, loc, ccode )
{
	this.send.json({mapcode:{ bcode, loc, ccode }})
}


///////////////////////////////////////////////////////////////////////////////


Send.prototype. clplmov	=function( newloc )
{
	var pl	=this.pl

	var r	=pl.vision

	var delta	=newloc.c().subv( pl.loc )

	var cellso	=[[],[]]
	
	var timecode	=Math.floor(Math.random()*255) + 1

	var o	=
	{
		timecode
		,
		loc	:newloc
		,
		delta , r
		,
		cells	:cellso
	}

	var carrs	=[[],[]]	// cell arrays

	var maps	=this.srv.game.maps

	maps.fore(( map )=>
	{
		for(var mbuf of map.bufs )
		{
			var Buf	=mbuf.constructor

			var mhead	=mbuf.head

			var mheadlen	=mhead.byteLength

			var buf	=new ArrayBuffer(
				
				mheadlen + 4 + Buf.Arr.BYTES_PER_ELEMENT * ((r<<1) + 1)
			)

			var arr	=Buf.newheadarr( buf )

			arr[0]	=(mhead[0]<<8) + timecode
			arr[1]	=newloc.h
			arr[2]	=newloc.x
			arr[3]	=newloc.y

			arr	=new Int8Array( buf, mheadlen, 4 )

			arr[0]	=delta.x
			arr[1]	=delta.y
			arr[2]	=delta.h

			arr	=new Buf.Arr( buf , mheadlen + 4 ,  (r<<1)+1 )

			carrs[map.getloc().h].push( arr )
		}
	})

	var ic	=0

	var h, ib, len

	maps.gr.fordiredge(( loc )=>
	{
		maps.fore(( map )=>
		{
			h	=map.getloc().h

			var bufs	=map.bufs

			for(ib=0, len=bufs.length; ib<len;ib++ )
			{
				carrs[h][ib][ic]	=map.gcellc( ib, loc )
			}

			var cello	=map.gcello( loc )

			if( cello )
			{
				cellso[h][ic]	={}

				for(var prop in cello )
				{
					switch( prop )
					{
						case 'pl' :

							cellso[h][ic][prop]	=cello[prop].newmsgvis()
						break;
						default:

							cellso[h][ic][prop]	=cello[prop]
					}
				}
			}
		})

		ic ++
	}
	, Loc.dirv2dirh( delta ), r, newloc )

	for(h=0; h<2; h++)
	{
		for(ib=0, len=carrs[h].length; ib<len; ib++)
		{
			this.send.binary( carrs[h][ib].buffer )
		}
	}

	this.s.json({ clplmov: o })


/*
	this.srv.game.maps.fore(( map )=>
	{
		var sendcells	=[]

		o.cells.push(sendcells)

		for(var mbuf of map.bufs )
		{
			var Buf	=mbuf.constructor

			var mhead	=mbuf.head

			var mheadlen	=mhead.byteLength

			var buf	=new ArrayBuffer(
				
				mheadlen + 3 + Buf.Arr.BYTES_PER_ELEMENT * ((r<<1) + 1)
			)

			var arr	=Buf.newheadarr( buf )

			arr[0]	=mhead[0]<<8
			arr[1]	=newloc.h
			arr[2]	=newloc.x
			arr[3]	=newloc.y

			arr	=new Int8Array( buf, mheadlen, 3 )

			arr[0]	=delta.x
			arr[1]	=delta.y
			arr[2]	=delta.h

			arr	=new Buf.Arr( buf , mheadlen + 3 ,  (r<<1)+1 )

			var i	=0

			var mcells	=mbuf.cells

			map.fordiredge(( loc )=>
			{
				arr[i]	=mcells[map.i(loc)]

				var cello	=map.gcello( loc )

				if( cello )
				{
					var msgcello	={}
				
					for(var prop in cello )
					{
						switch( prop )
						{
							case 'pl' :

								msgcello[prop]	=cello[prop].newmsgvis()
							break;
							default:

								msgcello[prop]	=cello[prop]
						}
					}

				i++
			}
			, Loc.dirv2dirh( delta ), r, newloc )

			this.send.binary( buf )
		}
	})

	this.pl.map.fordiredge(( loc, map )=>
	{
		if( ! map.inside(loc) )
		{
			o.cells.push(0)

			return
		}

		cell	=[]


		for(var i=0; i<map.bufs.length; i++)
		{
			cell[i]	=map.gcellc( i, loc )
		}

		cello	=map.gcello( loc )

		if( cello )
		{
			var msgcello	={}
		
			for(var prop in cello )
			{
				switch( prop )
				{
					case 'pl' :

						msgcello[prop]	=cello[prop].newmsgvis()
					break;
					default:

						msgcello[prop]	=cello[prop]
				}
			}

			cell[map.bufs.length]	=msgcello
		}

		o.cells.push( cell )
	}
	, Loc.dirv2dirh( o.delta ), o.r, o.loc )

	this.s.json({ clplmov: o })
	*/
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
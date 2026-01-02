export default function newcnts( Rcpt ,SCnt )
{
	var mmpu	=Cnt.mm3perunit

	var o	={}

	///////////////////////////////////////////////////////////////////////////////


	o.Belt	=class extends Rcpt
	{
		static vol	=Math.floor(15*15*10/mmpu)

		static key	="belt"

		inv	=
		{
			/**@prop { bagid : bag } */
			seedbags	:{}
		}

		allowed	=Rcpt.newallow({"multi":1},{"seedbag":5})


		/*
		additem( item ,len )
		{
			var belt	=Cont.prototype.additem. call(this, item )

			len	??=item.num

			var inv	=belt.inv

			var addedlen

			switch( item.constructor.key )
			{
				case "multi" :

					if( inv.multi )	return 0

					addedlen	=1

					inv.multi	=item.take( addedlen )
				break
				default :

					addedlen	=0
			}
			return addedlen
		}


		calcvol()
		{
			var vol	=0

			for(var ik in this.inv )
			{
				if( ik === "seedbags" )
				{
					for(var sbid in this.inv[ik] )	vol	+= this.inv[ik][sbid].calcvol()
				}
				else	vol	+= this.inv[ik].calcvol()
			}
			return vol
		}*/
	}

	///////////////////////////////////////////////////////////////////////////////

	for(var n in o )
	{
		if( o[n] instanceof Cnt )	o[n+SCnt.suffix]	=o[n].newStck()
	}

	return o
}
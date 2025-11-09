export default function newcnts( Cnt )
{
	var o	={}

	///////////////////////////////////////////////////////////////////////////////


	o.Belt	=class extends Cnt
	{
		static vol	=Math.floor(15*15*10/125)

		static key	="belt"

		inv	=
		{
			/**@prop { bagid : bag } */
			seedbags	:{}
		}


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

	return o
}
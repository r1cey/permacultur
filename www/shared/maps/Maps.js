export default function( Ground, Trees )
{
	Trees.setids( Ground.setids( 1 ) )



	return class
	{
		ground	=new Ground()
		
		gr	=this.ground

		trees	=new Trees()

		tr	=this.trees



		fromloc( loc )
		{
			return loc.h	? this.tr	: this.gr
		}

		fromh( h )
		{
			return h	? this.tr	: this.gr
		}

		frombid( bid )
		{
			var ibuf

			if( ibuf	=this.gr.constructor.bifrombid(bid) )
			{
				return { map :this.gr, ibuf}
			}
			else if( ibuf	=this.tr.constructor.bifrombid(bid) )
			{
				return { map :this.tr, ibuf }
			}

			console.error("Can't find buffer from id!")
		}

		ready()
		{
			return this.gr.ready() && this.tr.ready()
		}

		fore( fun )
		{
			fun( this.gr )
			fun( this.tr )
		}


		isplmov( dest )
		{
			return this.fromloc( dest ).isplmov( dest )
		}
	}
}


///////////////////////////////////////////////////////////////////////////////
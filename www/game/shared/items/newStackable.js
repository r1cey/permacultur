import Item	from "./Item.js"

export default function( NewIt )
{
	class St	extends( NewIt || Item )
	{
		len	=1

		// acts	={}


		constructor( len )
		{
			super()
			
			if( len > 1 )	this.len	=len
		}


		isstck()	{return this }


		/**	Doesn't reduce the num of this item. 
		 * @returns new obj or this. */
		take( l =1 )
		{
			var out

			if( l < this.len )
			{
				out	=new this.constructor( this ,l )

				// this.num	-= l
			}
			else
			{
				out	=this
			}
			return 	out
		}


		/**@returns true if object remains empty */
		del( l )
		{
			return ( this.len	-=l ) <= 0
		}

		

		calcvol()
		{
			return this.constructor.vol * this.len
		}

	/*
		toJSON( key )
		{
			switch( key )
			{
				case Stack.key :

					return[ this.constructor.key, this ]
			}
			return this
		}



		static newRevObj( jrev )
		{
			return {

				key	:Stack.key
				,
				fromJSON	:( meta )=>	jrev.revivr( meta[0], meta[1] )
			}
		}*/
	}
	return St
}
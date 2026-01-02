import Item	from "./Item.js"



export default function( NewIt )
{
	class Bl	extends( NewIt || Item )
	{
		static key	="block"

		/*
		constructor( obj )
		{
			super()
			
			this.set( obj )
		}*/


		isblock()	{return this }


		toJSON( key )
		{
			switch( key )
			{
				case Block.key :

					return[ this.constructor.key, this ]
			}
			return this
		}

		static newRevObj( jrev )
		{
			return {

				key	:Block.key
				,
				fromJSON	:( meta )=>	jrev.revivr( meta[0], meta[1] )
			}
		}
	}


	return Bl
}
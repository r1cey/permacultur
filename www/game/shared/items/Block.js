import Jable from "../Jsonable.js"



export default class Block	extends Jable
{
	static key	="block"

	static isblock	=true


	constructor( obj )
	{
		super()
		
		this.set( obj )
	}


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
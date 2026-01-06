export default function( Base )
{
	class Jable extends Base
	{
		static key

		static fromJSON(val, ...args )	{return new this(...args).set( val ) }

		static newrevfn( jrev )
		{
			return ( val )=> jrev.revivr( val[0] ,val[1] )
		}

		
		gkey()	{return this.constructor.key }
		

		set( obj )	{return Object.assign( this, obj ) }
	}

	return Jable
}
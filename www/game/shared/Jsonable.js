export default class Jable
{
	static key

	static fromJSON(val, ...args )	{return new this(...args).set( val ) }


	set( obj )	{return Object.assign( this, obj ) }
}
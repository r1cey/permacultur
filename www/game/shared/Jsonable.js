export default class Jable
{
	static key

	static fromJSON(val)	{return new this().set( val ) }


	set( obj )	{return Object.assign( this, obj ) }
}
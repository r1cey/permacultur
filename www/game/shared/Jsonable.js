export default class Jable
{
	static key

	static fromJSON(val, ...args )	{return new this(...args).set( val ) }

	static newRevO( ...args )
	{
		return {

			key	:this.key
			,
			fromJSON	:( val )=>	 this.fromJSON( val, ...args )
		}
	}
	

	set( obj )	{return Object.assign( this, obj ) }
}
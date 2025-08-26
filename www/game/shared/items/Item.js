export default class Item
{
	num	=1

	spoil	=0

	/** A unit is 125 cubic mm which is a sunflower seed */
	static vol	=1

	// acts	={}



	constructor( obj, num )
	{
		Object.assign( this, obj )

		if( num	!= null )	this.num	=num
	}


	/** Doesn't reduce from obj.
	 * @returns new obj or this. */
	take( l )
	{
		return l<this.num	? new this.constructor(this,l)	: this
	}


	/**@returns true if object remains empty */
	del( l )
	{
		return ( this.num	-=l ) <= 0
	}

	

	calcvol()
	{
		return this.constructor.vol * this.num
	}


	static fromJSON( obj )
	{
		return this( obj )
	}
}
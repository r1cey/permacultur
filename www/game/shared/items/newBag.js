// import Cnt from "./newContainer.js"


export function newBag( Box )
{
	class Bag extends Box
	{
		isbag()	{return this }
	}


	/*
	Bag.prototype. getobj	=function( id )
	{
		return typeof id==="number"	? this.cnts[id]	: this.items[id]
	}


	/** Modifies given items if portion was taken.
	 * @returns how many items were transfered *

	Bag.prototype. additem	=function( item ,len )
	{
		len	??=item.num

		// calc len and volume
		{
			var maxvol	=this.constructor.boxvol

			if( len > 1 )
			{
				let maxlen	=Math.floor((maxvol - this.calcitemvol())/item.constructor.vol)

				len	=Math.min( maxlen, len )

				if( len <= 0 )	return 0
			}
			else if( item.calcvol() + this.calcitemvol() >= maxvol )
			{
				return 0
			}
		}
		var bag	=Cnt.prototype.additem. call(this, item )

		if( item.constructor.idpool )	item.dad	=bag

		if( item.id )
		{
			bag.cnts[item.id]	=item
		}
		else
		{
			let itemk	=item.constructor.key

			if( bag.items[itemk] )
			{
				let bagits	=bag.items[itemk]

				bagits.spoil	=( bagits.spoil*bagits.num + item.spoil*len )/( bagits.num + len )

				bagits.num	+= len
			}
			else
			{
				bag.items[itemk]	=item.take( len )
			}
		}
		return len
	}



	Bag.prototype. delitem	=function( item, num =1, dadbox )
	{
		var itemn	=item.constructor.name

		item.notempty	? this.set.delete(item)	:
		
			(this.o[itemn].num	-= num) > 0	? 0	: delete this.o[itemn]

		this.calcempty()	? dadbox.set.delete(this) && Bag.prototype.additem. call(dadbox, this ) : 0
	}
	*


	///////////////////////////////////////////////////////////////////////////////


	/*
	Bag.prototype. mov2uniq	=function( cnt )
	{
		var key	=cnt.constructor.key

		if( this.items[key].num <= 0 )	delete this.items[key]

		this.cnts[cnt.id]	=cnt
	}*/


	///////////////////////////////////////////////////////////////////////////


	return Bag
}
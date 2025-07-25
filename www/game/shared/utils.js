export class WM //WeightMap
{
	m


	constructor()
	{
		var map

		if( Array.isArray( arguments[0] ) )
		{
			let[ keys, ws ]	=arguments

			map	=new Map()

			for(var i=0,len= keys.length ;i<len;i++)
			{
				map.set( keys[i], ws[i] )
			}
		}
		else if( arguments[0] instanceof Map )
		{
			map	=new Map( arguments[0] )
		}
		else	map	=new Map()

		this.m	=map
	}


	pickrnd()
	{
		var sum	=0

		for(var val of this.m.values())
		{
			sum	+= val
		}
		var r	=Math.random() * sum

		var acc	=0

		for(var pair of this.m.entries())
		{
			acc	+= pair[1]

			if( r < acc )
			{
				this.m.delete( pair[0] )

				return pair[0]
			}
		}
		//shouldn't happen
		let key	=this.m.keys().next().value

		console.error( "WeightMap", key )

		this.m.delete( key )

		return key
	}
}



export function rnd( n )
{
	return Math.floor(Math.random()*n )
}
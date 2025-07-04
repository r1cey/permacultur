/** Removes the val from array
 * @returns the removed val */

export function pickrnd( opts, weights )
{
	var sum	=0

	for(var i=0,len= opts.length ;i<len;i++)
	{
		sum	+= weights[i]
	}
	var r	=rnd( sum )

	var acc	=0

	for(var i=0;i<len;i++)
	{
		if( r < acc )
		{
			weights.splice( i, 1 )

			return opts.splice( i, 1 )[0]
		}
	}
	//shouldn't happen
	i	=rnd( opts.length )

	weights.splice( i, 1 )

	return opts.splice( i, 1 )[0]
}



export function rnd( n )
{
	return Math.floor(Math.random()*n )
}
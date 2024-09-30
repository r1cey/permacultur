export default async function( obj )
{
	var names	=[]
	var proms	=[]

	for(var n in obj )
	{
		if( obj[n] === '$$l' )
		{
			names.push( n )
			proms.push( import( './'+n+'.js' ))
		}
	}

	var proms	=await Promise.allSettled(proms)

	proms.forEach(( res, i )=>
	{
		obj[names[i]]	=res.value?.default || res.value
	} )
}
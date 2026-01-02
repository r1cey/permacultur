import newPathable from "../newPathable.js";

export default newPathable( class Cs
{
	o	={}


	iscnts()	{return this }


	get len()
	{
		var len	=0

		for(var id in o )
		{
			len ++
		}
		return len
	}


	calcvol()
	{
		var{ o }	=this

		var vol	=0

		for(var k in o )
		{
			vol	+= o[k].calcvol()
		}
		return vol
	}
})

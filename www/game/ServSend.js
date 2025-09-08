// import SG from './ServGet.js'


/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "s_" and "send_" PREFIXES 
 * ***

export default class SS extends SG
{
	constructor()
	{
		super()
	}
}*/


var out	={}


///////////////////////////////////////////////////////////////////////////////



out. newplayer	=function( o )
{
	return[[ o ]]
}


///////////////////////////////////////////////////////////////////////////////



out. mov	=function( loc )
{
	return[[ loc ]]
}



out. wrtc	=function( o )
{
	return[[ o ]]
}




out. climb	=function( dir, loc )
{
	return[[ dir, loc ]]
}



out. actonobj	=function( path, act, params )
{
	return[[ path, act, params ]]
}



///////////////////////////////////////////////////////////////////////////////


export default out

/*
for(var funn in out)
{
	out["send_"+funn]	=out[funn]

	out["s_"+funn]	=out[funn]

	delete out[funn]
}*/
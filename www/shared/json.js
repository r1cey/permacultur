import Loc from "./Loc.js"
import Col from "./Color.js"


var keys	=
{
	loc :
	{
		rev	:( val )=>new Loc(val)
	},
	col	:
	{
		rev :( val )=>new Col(val)
	},
	cl	:
	{
		rep	:( val )=> val ? 1 : 0
	}
}

export function newreplacer()
{
	return function( key, val )
	{
		if( keys[key]?.rep )	return keys[key].rep( val )

		else	return val
	}
}


export function newreviver()
{
	return function( key, val, str )
	{
		if( keys[key]?.rev )	return keys[key].rev( val )

		else	return val
	}
}


export function add( newkeys )
{
	for(var key in newkeys )
	{
		for(var ty in newkeys[key] )
		{
			keys[key][ty]	=newkeys[key][ty]
		}
	}
}
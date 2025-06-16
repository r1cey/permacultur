import Loc from "./Loc.js"
import Col from "./Color.js"
import Hands from "./player/Hands.js"


var rules	=
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
	},
	game	:
	{
		rep	:( val )=> undefined
	},
	hands	:
	{
		rev:( val )=>new Hands(val)
	}
}


export function newreplcr( newrules )
{
	var r	=newrules || rules

	return function( key, val )
	{
		if( r[key]?.rep )	return r[key].rep( val )

		else	return val
	}
}


export function newrevivr( newrules )
{
	var r	=newrules || rules

	return function( key, val, str )
	{
		if( r[key]?.rev )	return r[key].rev( val )

		else	return val
	}
}


export function newrules( newrules )
{
	var r	={}

	for(var key in newrules )
	{
		r[key]	={}

		for(var ty in newrules[key] )
		{
			r[key][ty]	=newrules[key][ty]
		}
	}	
	for(var key in rules )
	{
		r[key]	??={}

		for(var ty in rules[key] )
		{
			r[key][ty]	??=rules[key][ty]
		}
	}

	return r
}
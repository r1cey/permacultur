import Loc from "./Loc.js"
import Col from "./Color.js"


var globrules	=
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
	}
}



export default function ( addrules )
{
	var r	=addrules ? newrules(addrules) : globrules

	var exprt	={}

	exprt.replcr	=function( key, val )
	{
		if( r[key]?.rep )	return r[key].rep( val )

		else	return val
	}

	exprt.revivr	=function( key, val, str )
	{
		if( r[key]?.rev )	return r[key].rev( val )

		else	return val
	}

	return exprt
}


function newrules( addrules )
{
	var r	={}

	for(var key in addrules )
	{
		r[key]	={}

		for(var ty in addrules[key] )
		{
			r[key][ty]	=addrules[key][ty]
		}
	}	
	for(var key in globrules )
	{
		r[key]	??={}

		for(var ty in globrules[key] )
		{
			r[key][ty]	??=globrules[key][ty]
		}
	}
	return r
}


function newreplcr( r )
{
	return function( key, val )
	{
		if( r[key]?.rep )	return r[key].rep( val )

		else	return val
	}
}


function newrevivr( r )
{
	return function( key, val, str )
	{
		if( r[key]?.rev )	return r[key].rev( val )

		else	return val
	}
}
import Loc from "./Loc.js"
import Col from "./Color.js"
import Hands from "./player/Hands.js"
// import tools from "./tools.js"


export default function newjsonrules( tools )
{
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
		},
		dewd	:
		{
			rev:( val )=>new tools.Dewd(val)
		},
		seedbag :
		{
			rev:( val )=> val.map(( bag )=> new tools.Seedbag(bag) )
		}
	}

	var exprt	={}

	exprt.newreplcr	=function( newrules )
	{
		var r	=newrules || rules

		return function( key, val )
		{
			if( r[key]?.rep )	return r[key].rep( val )

			else	return val
		}
	}
	exprt.newrevivr	=function( newrules )
	{
		var r	=newrules || rules

		return function( key, val, str )
		{
			if( r[key]?.rev )	return r[key].rev( val )

			else	return val
		}
	}
	exprt.newrules	=function( newrules )
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
	return exprt
}
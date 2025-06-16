import Pl from './Player.js'

export default class Msg
{

}

Msg.prototype. str	=function()
{
	return JSON.stringify(this)
}

Msg.prototype. maxclients	=function()
{
	this.maxclients	=true

	return this
}

Msg.prototype. login	=function( name )
{
	this.login	=
	{
		name:	name
	}

	return this
}

Msg.prototype. createpl	=function( name )
{
	this.createpl	=name

	return this
}

Msg.prototype. player	=function( pl )
{
	this.pl	= new Pl(pl)
	/*{
		name:	pl.name
		,
		loc:	pl.loc
		,
		r:	pl.r
		,
		col:	pl.col
	}*/
	return this
}

Msg.prototype. water	=function( val )
{
	this.water	=val

	return this
}

Msg.prototype. cells	=function( cells )
{
	this.cells	=cells

	return this
}

Msg.prototype. plloc	=function(pl)
{
	this.plloc	=pl.loc.clone().roundh()

	return this
}

Msg.prototype. mapmov	=function( cells )
{
	this.mapmov	=cells

	return this
}
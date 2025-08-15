export default class Cnt
{
	pl

	map

	box

	dadbox
}


Cnt.prototype. frompl	=function( pl, boxes )
{
	this.pl	=pl

	var i	=0

	var box

	if( boxes?.[i] === "hands" )
	{
		box	=pl.hands

		i++
	}
	else	box	=pl.inv

	for(; i < boxes.length ; i++ )
	{
		box	=box
	}
}
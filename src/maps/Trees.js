import Maps	from '../../www/shared/maps/Maps.js'
import Map	from './Map.js'

import Loc from  '../../www/shared/Loc.js'
import Vec from  '../../www/shared/Vec.js'

export default class T extends Map(Maps.Tree)
{
	static name	='trees'
}


///////////////////////////////////////////////////////////////////////////////



T.prototype. gentree	=function( loc, lvl, ic )
{
	var m	=this

	if( lvl <= 3 )
	{
		return
	}

	ic	??=m.i(loc)


}


///////////////////////////////////////////////////////////////////////////////



T.prototype. setbranch	=function( loc, type )
{
	this.setbranchi(this.i(loc), type, loc )
}


T.prototype. setbranchi	=function( ic, type, loc )
{
	this.bufs[0].setprop( ic, 0, 0, type )

	this.game?.server?.send.mapcode( loc, 0, this.bufs[0].cells[ic] )
}
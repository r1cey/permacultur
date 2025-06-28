import Inv	from "./Inv.js"
import newHands from "../shared/player/newHands.js"


export default class Ha extends newHands(Inv)
{
}



Ha.prototype. attachhtmlinv	=function( htmlinv )
{
	this.htmlobj	=htmlinv.hands

	this.htmlobj.plobj	=this
}
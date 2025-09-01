// import Box	from "./Box.js"
import Hands from "../shared/player/Hands.js"


export default class Ha extends Hands
{
}



Ha.prototype. attachhtmlinv	=function( htmlinv )
{
	this.htmlobj	=htmlinv.hands

	this.htmlobj.plobj	=this
}
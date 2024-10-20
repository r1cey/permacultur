import V	from './shared/Vec.js'

export default class Touch
{
	can

	// drag	=new Drag(this)

	on	=false

	start	=new V()

	last	=new V()

	pos	=new V()

	time	=0

	constructor(can)
	{
		this.can	=can
	}
}


///////////////////////////////////////////////////////////////////////////////



Touch.prototype. ondown	=function( ev )
{
	var tch	=this

	tch.on	=true

	tch.start.setev( ev )
	tch.last.setev( ev )
	tch.pos.setev( ev )

	let menu	=this.can.menu

	if(menu)	menu.del()

	var el	=tch.can.el

	el.onpointerup	=this.onup. bind(this)
	// el.onpointercancel	=this.onpup. bind(this)
	el.onpointerout	=this.onup. bind(this)
	
	el.onpointermove	=this.onmove. bind(this)

	tch.time	=performance.now()

	return tch.stopslct(ev)
}

Touch.prototype. onup	=function( ev )
{
	var tch	=this

	tch.on	=false

	var el	=tch.can.el

	el.onpointermove	=null
	el.onpointerup	=null
	el.onpointerout	=null

	if(performance.now() - tch.time <= 200)
	{
		tch.can.clicked( tch.pos )
	}
}

Touch.prototype. onmove	=function( ev )
{
	var tch	=this

	tch.pos.setev( ev )

	return tch.stopslct(ev)
}


///////////////////////////////////////////////////////////////////////////////



Touch.prototype. stopslct	=function( ev )
{
	if(ev.stopPropagation) ev.stopPropagation();
    if(ev.preventDefault) ev.preventDefault();
    ev.cancelBubble=true;
    ev.returnValue=false;
    return false;
}
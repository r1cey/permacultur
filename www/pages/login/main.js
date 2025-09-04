import P from '../Page.js'


export default class Page extends P
{
	get elbut()
	{	
		return this.el.querySelector('button')
	}
}

Page.prototype. start	=function(submit)
{
	this.elbut.onclick	=( ev )=>
	{
		var elinp	=this.el.querySelector('input')

		ev.currentTarget.disabled	=true

		submit({ name: elinp.value })

		return false
	}

	document.body.insertBefore( this.el, document.body.firstChild )
}

Page.prototype. reset	=function()
{
	this.elbut.disabled	=false
}
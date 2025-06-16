export default class Console
{
	html
	
	el

	constructor(html, el)
	{
		this.html	=html

		this.el	=el
	}
}

Console.prototype. write	=function( str )
{
	var el	=this.el

	el.textContent	=str

	el.style.transform	='translateY(0)'

	el.onpointerdown	=this.onpdown.bind(this)
}

Console.prototype. log	=Console.prototype.write

Console.prototype. onpdown	=function(ev)
{
	this.el.style.transform	='translateY(-100%)'
}
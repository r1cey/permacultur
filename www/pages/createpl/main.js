import P from '../Page.js'

export default class Page extends P
{
	inputels	=[,,]

	get elname()
	{
		return this.el.querySelector('name')
	}
}

Page.prototype. start	=function( name, submit )
{
	var el	=this.el

	this.elname.textContent	=name

	var iels	=this.inputels

	iels[0]	=el.querySelector('hue').querySelector('input')
	iels[1]	=el.querySelector('sat').querySelector('input')
	iels[2]	=el.querySelector('light').querySelector('input')

	for(var inputel of this.inputels)
	{
		inputel.oninput	=this.oninput.bind(this)

		inputel.dispatchEvent(new Event('input'))
	}

	el.querySelector('button').onclick	=(ev)=>
	{
		submit( { name, col: this.arr() } )

		ev.currentTarget.disabled	=true
	}

	document.body.insertBefore( el,
		document.getElementsByTagName('screen')[0] )
}

Page.prototype. arr	=function()
{
	var arr=[]

	for(var el of this.inputels)
	{
		arr.push(parseInt(el.value))
	}

	return arr
}

Page.prototype. oninput	=function(ev)
{
	var inputel	=ev.currentTarget

	// debugger

	var valel	=inputel.parentElement.querySelector('val')

	var iels	=this.inputels

	valel.textContent	=inputel.value.toString()

	this.el.querySelector('colbox').style.backgroundColor
		=`hsl(${iels[0].value} ${iels[1].value}% ${iels[2].value}%)`
}
import Con from './Console.js'
import Can from './canvas/Canvas.js'
import Menu	from "./Menu.js"
import ContextMenu	from "./ContextMenu.js"
import Imgs	from "./Imgs.js"

export default class Html
{
	cl	//client

	con	=new Con(this, document.querySelector('console'))

	screen	=document.querySelector("screen")

	fps	=
	{
		el	:document.querySelector('fps')
		,
		set	:function( n )
		{
			this.el.textContent	=`${n}fps`
		}
	}

	can	=new Can(this, document.getElementById('can'))

	menu	=new Menu(this)

	ps	={}

	inv	//not necessary since should be already in .ps

	contextmenu	=new ContextMenu(this)

	imgs	=new Imgs(this)

	resize	=
	{
		tout	:0
		,
		delay	:100
	}


	constructor( cl )
	{
		this.cl	=cl

		this.can.resize()

		this.can.draw()

		window.onresize	=this.onresize. bind(this)
	}
}


///////////////////////////////////////////////////////////////////////////////



Html.prototype. loadp	=async function( name, ...args )
{
	var promis	=[,,]

	promis[0]	=this.fetch(`pages/${name}/main.xhtml`)

	promis[1]	=import(`./pages/${name}/main.js?${Math.floor(Math.random()*100)}`)

	promis[2]	=new Promise(function(res, rej)
	{
		let el	=document.createElement( 'link' )

		el.type	='text/css'
		el.rel	='stylesheet'
		el.onload	=(ev)=> res(el)
		el.onerror	=(ev)=> rej(el)
		el.href	=`pages/${name}/main.css?${Math.floor(Math.random()*100)}`

		document.head.appendChild(el)
	})

	var res	=await Promise.allSettled( promis )

	var el, css, p

	if( res[0].status === 'rejected' )
	{
		console.log(`Failed to load xhtml: ${name}/main.xhtml`)
	}
	else
	{
		el	=(new DOMParser()).parseFromString(await res[0].value.text(), "text/html").body.firstElementChild
	}
	if( res[2].status === 'rejected' )
	{
		console.log(`Failed to load css: ${name}/main.css`)

		res[2].value.remove()
	}
	else
	{
		css	=res[2].value
	}
	if( res[1].status === 'rejected' )
	{
		p	={ el, css }
	}
	else
	{
		p	=new (res[1].value.default)(this, el, css, ...args)
	}

	this.ps[name]	=p

	return p
}


///////////////////////////////////////////////////////////////////////////////



Html.prototype. onresize	=function()
{
	var res	=this.resize

	if( res.tout )	clearTimeout( res.tout )
	
	res.tout	=setTimeout( this.can.resize. bind(this.can), res.delay )
}




Html.prototype. fetch	=function( url )
{
	return fetch(url, {cache: "no-store"})
}




Html.prototype. delpage	=function( name )
{
	if( this.ps[name] )
	{
		this.ps[name].el?.remove()
		this.ps[name].css?.remove()
		delete this.ps[name]
	}
}
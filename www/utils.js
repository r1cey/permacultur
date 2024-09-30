Element.prototype. getparent	=function( selstr )
{
	var el	=this;

	var elfound

	var selobj	=parsesel(selstr)

	let elclasses, isxfound

	while( el )
	{
		el	=el.parentElement
		
		if( ! el )
		{
			break
		}

		if( selobj.tag && selobj.tag != el.tagName.toUpperCase())
		{
			continue
		}
		if( selobj.id && selobj.id != el.id)
		{
			continue
		}
		if( selobj.classes.length && el.className )
		{
			elclasses	=el.className.split(' ')

			isxfound	=true

			selobj.classes.forEach(( classn )=>
			{
				if( ! elclasses.includes( classn ) )
				{
					isxfound	=false
				}
			})

			if( ! isxfound )
			{
				continue
			}
		}
		if( selobj.attrs.length )
		{
			isxfound	=true

			selobj.attrs.forEach(( attr )=>
			{
				if( el.getAttribute(attr[0]) != attr[1] )
				{
					isxfound	=false
				}
			})

			if( ! isxfound)
			{
				continue
			}
		}

		//found element
		elfound	=el
		break
	}
	return elfound
}

function parsesel( sel )
{
	var obj	=
	{
		tag:	null,
		id:	null,
		classes:	[],
		attrs:	[]
	}
	sel.split(/(?=\.)|(?=#)|(?=\[)/).forEach(( token )=>
	{
		switch (token[0])
		{
			case '#':
				obj.id	=token.slice(1);
			break;
			case '.':
				obj.classes.push(token.slice(1).toLowerCase());
			break;
			case '[':
				obj.attrs.push(token.slice(1,-1).split('='));
				break;
			default :
				obj.tag	=token.toUpperCase();
			break;
		}
	});
	return obj;
}
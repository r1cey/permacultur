import { dir } from 'console'
import fs from 'fs/promises'



export default class F
{
	/*
	players	=
	{
		dir	:'pls/'
		,
		max	:10000
		,
		read	:async function(n)
		{
			return await F.readjson( this.dir+n+'.json' )
		}
		,
		remain	:async function()
		{
			var files	=await F.readdir( this.dir )
	
			return this.max - files.length
		}
	}*/
}


///////////////////////////////////////////////////////////////////////////////



F.prototype. readjson	=async function(url)
{
	try
	{
		return JSON.parse(await fs.readFile(url, 'utf8'))
	}
	catch(err)
	{
		console.log(`Couldn't read file: ${url}`)
		
		throw err
	}
}


F.prototype. readbuf	=async function( path )
{
	try
	{
		return (await fs.readFile(path))?.buffer
	}
	catch( err )
	{
		console.error( `Coudln't read map file: ${path}` )

		throw err
	}
}


F.prototype. readdir	=async function( path )
{
	try
	{
		return await fs.readdir( path )
	}
	catch(err)
	{
		console.error( 'Couldn\'t read dir: '+path )
		
		return
	}
}



F.prototype. savejson	=async function( path, o, fun )
{
	var json	=JSON.stringify( o, fun )

	return await this.savefile( path, json )	? json	: undefined
}

F.prototype. savebuf	=async function( path, buf )
{
	buf	=Buffer.from(buf)

	return await this.savefile( path, buf )	? buf	: undefined
}



///////////////////////////////////////////////////////////////////////////////



F.prototype. filename	=function( path )
{
	return path.slice(0,path.lastIndexOf('.'))
}


F.prototype. fileext	=function( path )
{
	return path.slice(path.lastIndexOf('.')+1)
}


///////////////////////////////////////////////////////////////////////////////



F.prototype. savefile	=async function( path, val )
{
	try
	{
		await fs.writeFile( path, val, {flag: 'w'} )

		console.log( `File ${path} saved.` )

		return true
	}
	catch(err)
	{
		console.error( 'Couldn\'t write file: '+path )

		return false
	}
}


F.prototype. readerrs	=async function( path = "./errors.json")
{
	var str

	try
	{
		str	=await fs.readFile(path, 'utf8')
	}
	catch( err )
	{
		console.log( `Couldn't read errors file: ${path}` )

		return
	}

	let errs	=JSON.parse(str)

	return errs
}

F.prototype. readconf	=async function( gameconf, srvconf )
{
	var path	=this.urls.conf

	let str

	try
	{
		str	=await fs.readFile(path, 'utf8')
	}
	catch( err )
	{
		console.log( this.game.errs[405], path )

		return
	}

	let o	=JSON.parse(str)

	let prop, prop2

	for(prop in o )
	{
		if(prop === 'server')
		{
			for(prop2 in o[prop] )
			{
				srvconf[prop2]	=o[prop][prop2]
			}
		}
		else
		{
			gameconf[prop]	=o[prop]
		}
	}
}

F.prototype. readpls	=async function( pls )
{
	var files	=await F.readdir( this.paths.pls )
	
	for(var filen of files)
	{
		var pla	=await F.readjson( this.paths.pls+filen )

		if( !pla )
		{
			return
		}

		pla.cl	=0

		pls[filen.substring(0,filen.lastIndexOf('.'))]
				=new Pl( pla, true )
	}
}

/*
F.prototype. readmap	=async function( path, map )
{
	var buf	=await F.readbuf( path+'.bin' )

	if( !buf )
	{
		return
	}

	map.setbuf( buf )

	console.log( `Read: r=${map.r}, cells=${map.cells}`)

	var o	=await F.readjson( path+locf+'.json' )

	if(o )
	{
		map.o	=o
	}

	return map
}
*

F.prototype. readmaps	=async function( maps )
{
	var dir	=this.paths.maps
	
	var files	=await F.readdir( dir )

	var promises	=[]
	
	for(var filen of files )
	{
		var locf	=filen.substring(0, filen.lastIndexOf('.'))

		if(maps[locf])	continue
		
		var map	=maps[locf]	=new Map()
		
		promises.push( map.read( locf, dir ))
	}

	await Promise.allSettled( promises )
}


F.prototype. maps_rnames	=async function( maps )
{
	var files	=await fs.readdir( this.maps )
	
	for(var filen of files)
	{
		var name	=filen.slice(0, filen.lastIndexOf('.'))

		if( maps[name] )	continue

		maps[name]	=true
	}

	return maps
}

F.prototype. maps_ro	=async function( id )
{
	var o	=this.readjson( this.maps+id+'.json' )
}


F.prototype. savepl	=async function( pla )
{
	return F.savejson( this.paths.pls+pla.name+'.json', pla )
}

F.prototype. savepls	=async function( pls )
{
	console.log('Saving players in files.')

	for(var name in pls)
	{
		await this.savepl(name, pls[name])
	}
}

F.prototype. savemap	=function( map )
{
	var path	=this.paths.maps+map.getloc()

	console.log(`Attempting to write map: ${path}`)

	F.savebuf( path+'.bin', map.getbuf() )

	F.savefile( path+'.json', map.gjson() )
}

F.prototype. savemaps	=function( maps )
{
	for(var n in maps )
	{
		this.savemap( maps[n] )
	}
}

class Maps
{
	dir	='./maps/'
}


class Pls
{
	dir ='./players/'

	max	=20000
}


Pls.prototype. g	=async function( n )
{
	var pl	=await F.getjson( this.dir+n+'.json')

	return pl
}


Pls.prototype. s	=async function( pl )
{
	return await F.savejson( this.dir+pl.name+'.json', pl )
}*/
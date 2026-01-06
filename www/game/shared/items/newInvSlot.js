import newInv from "./newInv.js";



export default function( newInv =newInv )
{
    const Slt =newInv( class
    {
        static allowed  ={}


        static canadditem( nav ,_i ,item ,len )
        {
            return Math.min( this.allowed[item.gkey()] ,len )
        }
    })    


	Slt. newallow	=function( stcks ,cnts )
	{
		var allowed	=Object.assign( {} ,stcks )

		// Object.assign( allowed  )

		for(var k in cnts )
		{
			allowed[k]	=cnts[k]

			allowed[k+this.Stack.suffix]	=cnts[k]
		}
		return allowed
	}


    return Slt
}
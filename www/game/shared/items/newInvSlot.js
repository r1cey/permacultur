import newInv from "./newInv.js";



export default function( newInv =newInv )
{
    const Slt =newInv( class
    {
        static allowed  ={}


        static canadditem( nav ,_i ,item ,len )
        {
            var lenallow	=Math.min( this.allowed[item.gkey()] ,len )
        }
    })


    return Slt
}
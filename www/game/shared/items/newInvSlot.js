// import Inv from "./Inv.js";



export default function( Inv )
{
    class Slt extends Inv
    {
        static allowed  ={}


        static canadditem( nav ,_i ,item ,len )
        {
            var lenallow	=Math.min( this.allowed[item.gkey()] ,len )
        }
    }


    return Slt
}
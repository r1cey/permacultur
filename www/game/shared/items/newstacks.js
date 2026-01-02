// import newStackable from "./newStackable.js"


export default function newstacks( NewStack )
{
	var Stack	=NewStack// || newStackable()

	var mmpu	=Stack.mm3perunit

	var o	={}


	///////////////////////////////////////////////////////////////////////////


	o.Multi	=class extends Stack
	{
		static vol	=30*20*150/mmpu

		// static vol	=15*15*30

		static key	="multi"
	}


	o.CucumberSeed	=class extends Stack
	{
		static vol	=1

		static key	="cucumber_seeds"
	}

	///////////////////////////////////////////////////////////////////////////


	return o
}

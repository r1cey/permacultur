import newRcpt from "../shared/items/newReceptacle.js"

import newContainer from "../shared/items/newContainer.js"

import newSlot from "../shared/items/newInvSlot.js"

import Item from "./Item.js"

import newInv from "./newInv.js"



class ClRcpt	extends newRcpt( newContainer( Item , newInv ), newSlot )
{

}
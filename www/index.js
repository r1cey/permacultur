// import './utils.js'

import Client from "./game/Client.js"

window.cl	=new Client()

cl.srv.url	='ws://www.deoraita.co.il:8043'

cl.start()

cl.html.can.drawgrid()

// cl.html.menu.setopts( { symb :"a" } )

// cl.html.menu.show()
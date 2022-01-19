const bitshares=require('btsdex')

async function mamad() {
  const getConnection=await bitshares.connect("wss://dex.iobanker.com/ws")
  let acc=await bitshares.login("mohammadamir1153","P5J6eL7XDGCQK5AMBSNXpsXqJQsM3hRTUB4EJkPJS3JxN")

}
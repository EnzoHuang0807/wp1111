import mongo from './mongo'
import server from './server'

mongo.connect();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {console.log(`Server is up on port ${PORT}!`)});
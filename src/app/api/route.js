import { NextResponse } from "next/server";
import connectDB from '../../lib/connectDB';
import Game from "@/models/game";

export async function GET(req){
    await connectDB();
    let searchParams = req.nextUrl.searchParams

    let user = searchParams.get('name')
    let game = searchParams.get('game')
    console.log(user, game)

    if(user && game && game.length == 2 && game.replace("r", "").replace("s", "").replace("p", "") == ""){
        console.log(user, game)
        let oldUser = await Game.find({user: user})
        oldUser = Array.from(oldUser)
        console.log(oldUser)
        let r;
        if(oldUser[0]){
            r = await Game.updateOne({user: user}, {games: oldUser[0].games + game})
        } else{
            let n = {user: user, games: game}
            n = new Game(n)
            r = await n.save()
        }
        return NextResponse.json(r)
    } else {
        let list = await Game.find({})
        return NextResponse.json(list)
    }
}
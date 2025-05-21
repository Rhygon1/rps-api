import { NextResponse } from "next/server";
import connectDB from '../../lib/connectDB';
import Game from "@/models/game";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers'

export async function GET(req) {
    await connectDB();
    const cookieStore = await cookies()
    let searchParams = req.nextUrl.searchParams

    let user = searchParams.get('name')
    let game = searchParams.get('game')
    let auth;
    try{
        auth = cookieStore.get('auth').value
    } catch {
        return NextResponse.json({ message: 'Why :(' }, { status: 400 });
    }
    console.log(user, game)

    if (user && auth && game && game.length == 2 && game.replaceAll("r", "").replaceAll("s", "").replaceAll("p", "") == "") {
        console.log(user, game, auth)
        let oldUser = await Game.find({ user: user })
        oldUser = Array.from(oldUser)
        console.log(oldUser)
        let r;
        if (oldUser[0]) {
            if (oldUser[0].auth == auth) {
                r = await Game.updateOne({ user: user }, { games: oldUser[0].games + game, lastPlayed: Date.now(), auth: uuidv4() })
            } else {
                return NextResponse.json({ message: 'Why :(' }, { status: 400 });
            }
        }
        console.log(r)
        return NextResponse.json(r)
    } else {
        let list = await Game.find({})
        return NextResponse.json(list)
    }
}
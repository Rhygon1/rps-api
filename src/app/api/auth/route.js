import { NextResponse } from "next/server";
import connectDB from '../../../lib/connectDB';
import Game from "@/models/game";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers'

export async function GET(req){
    await connectDB();
    const cookieStore = await cookies()

    let searchParams = req.nextUrl.searchParams
    let user = searchParams.get('name')
    let auth = uuidv4()
    let oldUser = await Game.find({ user: user })
    oldUser = Array.from(oldUser);
    if (!user){
        return NextResponse.json({Message: "nuh uh"}, {status: 400})
    }
    let r;
    if (oldUser[0]) {
        r = await Game.updateOne({ user: user }, { auth: auth+"1" })
    } else {
        let n = { user: user, games: "", lastPlayed: Date.now(), auth: auth+"1"}
        n = new Game(n)
        r = await n.save()
    }
    console.log(r)
    cookieStore.set('auth', auth, { secure: true, maxAge: 5 })
    return NextResponse.json({Meh: "meh"})
}
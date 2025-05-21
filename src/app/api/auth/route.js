import { NextResponse } from "next/server";
import connectDB from '../../../lib/connectDB';
import Game from "@/models/game";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers'

export async function GET(req) {
    await connectDB();
    const cookieStore = await cookies()

    let searchParams = req.nextUrl.searchParams
    let user = searchParams.get('name')
    let auth = uuidv4()
    let oldUser = await Game.find({ user: user })
    oldUser = Array.from(oldUser);
    let r;
    if (oldUser[0]) {
        r = await Game.updateOne({ user: user }, { auth: auth })
    } else {
        let n = { user: user, games: "", lastPlayed: Date.now() }
        n = new Game(n)
        r = await n.save()
    }
    console.log(r)
    cookieStore.set('auth', auth, { secure: true, maxAge: 5 })
    return NextResponse.json({meh: "meh"})
}
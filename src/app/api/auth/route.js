import { NextResponse } from "next/server";
import connectDB from '../../../lib/connectDB';
import Game from "@/models/game";
import { v4 as uuidv4 } from 'uuid';

export async function GET(req) {
    await connectDB();

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
    return NextResponse.json({auth: auth})
}
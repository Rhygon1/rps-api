import { NextResponse } from "next/server";
import connectDB from '../../../lib/connectDB';
import Game from "@/models/game";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function GET(req){
    await connectDB();
    const cookieStore = await cookies()
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
    let searchParams = req.nextUrl.searchParams
    let user = crypto.createHash('sha256').update(searchParams.get('name')).digest('hex');
    let auth = uuidv4()
    let oldUser = await Game.find({ user: user })
    oldUser = Array.from(oldUser);
    if (!user){
        return NextResponse.json({Message: "nuh uh"}, {status: 400})
    }
    let r;
    if (oldUser[0]) {
        let under5 = oldUser[0].totalUnder5
        if(Date.now() - new Date(oldUser[0].lastPlayed).getTime() < 2000){
            under5 += 1
        } else {
            under5 = 0
        }
        r = await Game.updateOne({ user: user }, { auth: auth+"1", totalUnder5: under5 })
    } else {
        let n = { user: user, games: "", lastPlayed: Date.now(), auth: auth+"1", totalUnder5: 0, Banned: false}
        n = new Game(n)
        r = await n.save()
    }
    console.log(auth, ip, r)
    cookieStore.set('auth', auth, { secure: true, maxAge: 5 })
    return NextResponse.json({Meh: "meh"})
}
import { NextResponse } from "next/server";
import connectDB from '../../lib/connectDB';
import Game from "@/models/game";
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const rateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1, '10 s'), // 5 requests in 10 seconds
});

export async function GET(req){
    const { success } = await rateLimit.limit(req.ip);
    if (!success) {
        return res.status(429).json('Too many requests');
    }
    await connectDB();
    let searchParams = req.nextUrl.searchParams

    let user = searchParams.get('name')
    let game = searchParams.get('game')
    console.log(user, game)

    if(user && game){
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
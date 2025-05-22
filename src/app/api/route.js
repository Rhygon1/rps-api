import { NextResponse } from "next/server";
import connectDB from '../../lib/connectDB';
import Game from "@/models/game";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function GET(req) {
    function highScore(seq) {
        let score = 0
        let bestScore = 0

        function mod(n, m) {
            return ((n % m) + m) % m;
        }

        for (let i = 0; i < seq.length; i += 2) {
            const diff = mod(("rps".indexOf(seq[i]) - "rps".indexOf(seq[i + 1])), 3)
            if (diff == 1) {
                score++
            } else if (diff == 2) {
                score = 0
            }
            if (score > bestScore) {
                bestScore = score
            }
        }

        return bestScore

    }

    const winMapping = {
        "r": "p",
        "p": "s",
        "s": "r"
    }
    const loseMapping = {
        "r": "s",
        "p": "r",
        "s": "p"
    }


    await connectDB();
    const cookieStore = await cookies()
    let searchParams = req.nextUrl.searchParams

    let user = searchParams.get('name')
    if (!user) {
        return NextResponse.json({ message: 'Why :(' }, { status: 400 });
    }
    user = crypto.createHash('sha256').update(user).digest('hex');
    let game = searchParams.get('game')
    let auth;
    try {
        auth = cookieStore.get('auth').value
    } catch {
        return NextResponse.json({ message: 'Why :(' }, { status: 400 });
    }
    console.log(user, game)
    let rand = "rps"[Math.floor(Math.random() * 3)]
    if(Math.random() > 0.25){
        if(Math.random() > 0.5){
            rand = winMapping[game]
        } else {
            rand = game
        }
    } else {
        rand = loseMapping[game]
    }

    if (user && auth && game && game.length == 1 && game.replaceAll("r", "").replaceAll("s", "").replaceAll("p", "") == "") {
        console.log(user, game, auth)
        let oldUser = await Game.find({ user: user })
        oldUser = Array.from(oldUser)
        console.log(oldUser)
        let r;
        if (oldUser[0]) {
            if (oldUser[0].auth == auth) {
                let games = oldUser[0].games
                if (games.length > 18 && highScore(games.slice(-18)) > 7) {
                    rand = winMapping[game]
                }

                r = await Game.updateOne({ user: user }, { games: oldUser[0].games + game + rand, lastPlayed: Date.now(), auth: uuidv4() })
            } else {
                return NextResponse.json({ message: 'Why :(' }, { status: 400 });
            }
        }
        console.log(r)
        return NextResponse.json({ pick: rand })
    } else {
        let list = await Game.find({})
        return NextResponse.json(list)
    }
}
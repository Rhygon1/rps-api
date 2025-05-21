"use client"

import Image from "next/image";
import { Loader, Check } from 'lucide-react';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function Home() {
  const [AIPick, SetAIPick] = useState("N")
  const [Decided, SetDecided] = useState("N")
  const [Scores, SetScores] = useState([0, 0])
  const [ShowOptions, SetShowOptions] = useState(["rock", "paper", "scissors"])
  const [uid, setUid] = useState(typeof window !== "undefined" ? localStorage.getItem("uid") || "" : "")
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if(!uid){
      const uuid = uuidv4()
      setUid(uuid)
      localStorage.setItem('uid', uuid)
    }
  }, [])

  useEffect(() => {
    if(AIPick != "N") {return}
    fetch("/api/AI")
      .then(res => res.json())
      .then(d => {
        d = d.pick
        SetAIPick(d)
      })
  }, [AIPick])

  useEffect(() => {
    if(AIPick != "N" && ShowOptions.length == 1){
      const diff = mod(("rps".indexOf(ShowOptions[0][0]) - "rps".indexOf(AIPick)), 3)
      if(diff == 1){
        SetDecided("You Won!")
        SetScores(a => [a[0] + 1, a[1]])
        setHighScore(a => a + 1)
      }
      if(diff == 2){
        SetDecided("You Lost :(")
        SetScores(a => [a[0], a[1] + 1])
        setHighScore(0)
      }
      if(diff == 0){
        SetDecided("Draw")
        setHighScore(0)
      }

      async function f(){
        let authi = await fetch(`/api/auth?name=${uid}`)
        let js = await authi.json()
        let a = js.auth
        await fetch(`/api?name=${uid}&game=${ShowOptions[0][0]}${AIPick}&auth=${a}`)
      }
      f()
    }
  }, [AIPick, ShowOptions])

  function choose(a: string){
    if(ShowOptions.length == 1) {return}
    SetShowOptions([a])
  }

  function reset(){
    SetAIPick("N")
    SetDecided("N")
    SetShowOptions(["rock", "paper", "scissors"])
  }

  const mapping = {
    "r": "rock",
    "p": "paper", 
    "s": "scissors"
  }
  return (
    <div className="flex relative justify-center h-screen">
      <p className="absolute top-2 right-5 white">{`High score: ${highScore}`}</p>
      <main className="flex flex-col justify-around container max-w-xl">
        <div className="flex flex-col justify-around">
          <p className="text-center">Your pick</p>
          <div className="flex justify-around w-full h-full max-h-3/4">
            {ShowOptions.map((a, i) =>
              <Image onClick={() => choose(a)} src={`/${a}.png`} width={200} height={100} className="w-1/4 h-fit m-5" alt={`${a}`} key={`${a}${i}`} />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-around items-center">
          <p className="text-center m-4">{Scores[0]}-{Scores[1]}</p>
          {
            Decided != "N" ?
            <p className="text-center m-4">{Decided}</p>
            : <div></div>
          }
          {
            Decided != "N" ?
            <button onClick={reset} className="bg-black text-slate-100 p-2 rounded-sm hover:bg-slate-100 hover:text-slate-700">Next round</button>
            : <div></div>
          }
        </div>
        
        {!AIPick ? <div className="flex flex-col justify-around items-center">
          <Loader className="h-full w-fit animate-spin m-3" />
          <p className="text-center">AI Picking</p>
        </div> : 
        <div className="flex flex-col justify-around items-center">
            {Decided != "N" ? 
            <Image src={`/${mapping[AIPick as keyof typeof mapping]}.png`} width={200} height={100} className="w-1/4 h-fit m-5" alt={`${mapping[AIPick as keyof typeof mapping]}`} key={`${mapping[AIPick as keyof typeof mapping]}`} />
           : <div></div>}
            <Check className="h-full w-fit" />
            <p className="text-center">AI Picked</p>
        </div>}
      </main>
    </div>
  );
}

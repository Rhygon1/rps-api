import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({pick: "rps"[Math.floor(Math.random() * 3)]})
}
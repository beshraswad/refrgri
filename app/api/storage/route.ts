import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
const root = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const safe = (value:string) => value.replace(/[^a-zA-Z0-9._-]/g,"-").slice(0,100);

export async function GET(request:NextRequest) {
  const type=safe(request.nextUrl.searchParams.get("type")||"projects");
  const rawName=request.nextUrl.searchParams.get("name");
  if(!rawName){try{const files=await readdir(path.join(root,type));return NextResponse.json({items:files.filter(x=>x.endsWith(".json")).map(x=>x.slice(0,-5))})}catch{return NextResponse.json({items:[]})}}
  const name=safe(rawName);
  try { const body=await readFile(path.join(root,type,`${name}.json`),"utf8"); return NextResponse.json(JSON.parse(body)); }
  catch { return NextResponse.json({items:[]}); }
}

export async function POST(request:NextRequest) {
  const data=await request.json() as {type?:string;name?:string;content?:unknown};
  const type=safe(data.type||"projects"), name=safe(data.name||crypto.randomUUID());
  const dir=path.join(root,type); await mkdir(dir,{recursive:true});
  await writeFile(path.join(dir,`${name}.json`),JSON.stringify({name,content:data.content,savedAt:new Date().toISOString()},null,2),"utf8");
  return NextResponse.json({ok:true,name});
}

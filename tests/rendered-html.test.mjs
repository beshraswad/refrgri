import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const root=new URL("../",import.meta.url);

test("cycle workbench exposes the core research workflows",async()=>{
  const page=await readFile(new URL("app/page.tsx",root),"utf8");
  for(const feature of ["Cycle data","Experimental","Refrigerants","Ideal compressor outlet","Download CSV","Print / Save PDF"]){
    assert.ok(page.includes(feature),`missing ${feature}`);
  }
  assert.doesNotMatch(page,/Psychrometric/i);
});

test("persistent storage supports create, read, list and delete",async()=>{
  const route=await readFile(new URL("app/api/storage/route.ts",root),"utf8");
  assert.match(route,/export async function GET/);
  assert.match(route,/export async function POST/);
  assert.match(route,/export async function DELETE/);
  assert.match(route,/DATA_DIR/);
});

test("Railway runs the validated Next build",async()=>{
  const railway=await readFile(new URL("railway.toml",root),"utf8");
  assert.match(railway,/buildCommand = "npm run build"/);
  assert.match(railway,/startCommand = "npm run start -- -p \$PORT"/);
});

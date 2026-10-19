import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, recommend } from '../docs/decision.mjs';
const basic = {load:'essentials',cooling:'none',duration:'short',leave:'yes',operation:'self',noise:'quiet',budget:'small',roof:'unknown',solar:'low-cost',medical:'no',years:'unknown'};
function result(overrides={}) { return recommend({...basic,...overrides}); }
test('small, short, manually managed essentials have a portable-first path',()=>{assert.equal(result().route,'portable');});
test('automatic essentials with permanent-system budget have a battery-first path',()=>{assert.equal(result({operation:'automatic',budget:'permanent'}).route,'battery');});
test('prolonged high loads with accepted service and sufficient budget have a generator quote path',()=>{assert.equal(result({load:'whole',duration:'days',leave:'no',operation:'helper',noise:'accept',budget:'permanent'}).route,'generator');});
test('quiet requirement prevents generator recommendation even through long outages',()=>{assert.notEqual(result({load:'whole',duration:'days',leave:'no',noise:'quiet',budget:'large'}).route,'generator');});
test('small budget and cooling needs produce a cooling and assistance action, not a false adequate-system promise',()=>{const r=result({cooling:'room',leave:'no'});assert.equal(r.route,'assessment');assert.ok(r.actions.some(a=>a.id==='cooling'));});
test('medical equipment never follows the ordinary portable-appliance recommendation',()=>{const r=result({medical:'yes'});assert.equal(r.route,'assessment');assert.ok(r.actions.some(a=>a.id==='medical'));});
test('unknowns return a defined assessment instead of guessing capacity',()=>{const a=Object.fromEntries(questions.map(q=>[q.id,'unknown']));assert.equal(recommend(a).route,'assessment');});
test('solar assessment requires interest, budget, assessed roof, and enough expected years',()=>{const eligible={solar:'consider',budget:'large',roof:'assessed',years:'long'};assert.ok(result(eligible).actions.some(a=>a.id==='solar'));for(const roof of ['repair','unknown','avoid'])assert.ok(!result({...eligible,roof}).actions.some(a=>a.id==='solar'));assert.ok(!result({...eligible,years:'short'}).actions.some(a=>a.id==='solar'));});
test('existing solar calls for compatibility review rather than new panels',()=>{const r=result({solar:'existing',budget:'permanent'});assert.ok(r.actions.some(a=>a.id==='existing'));assert.ok(!r.actions.some(a=>a.id==='solar'));});
test('incomplete and invalid input is rejected',()=>{assert.throws(()=>recommend({}));assert.throws(()=>result({budget:'invalid'}));});
test('decision invariants across representative combinations',()=>{
 for(const load of ['essentials','whole','unknown'])for(const cooling of ['none','room','whole','unknown'])for(const duration of ['short','overnight','days','unknown'])for(const leave of ['yes','no','unknown'])for(const operation of ['self','helper','automatic','unknown'])for(const noise of ['quiet','accept','unknown'])for(const budget of ['small','limited','permanent','large','flexible','unknown']) {
  const a={...basic,load,cooling,duration,leave,operation,noise,budget};const r=recommend(a);
  assert.ok(r.title&&r.next&&r.scope&&r.reasons.length);
  if(r.route==='portable'){assert.equal(leave,'yes');assert.equal(load,'essentials');assert.equal(cooling,'none');assert.equal(duration,'short');assert.ok(['self','helper'].includes(operation));}
  if(r.route==='generator'){assert.equal(duration,'days');assert.equal(noise,'accept');assert.ok(['permanent','large','flexible'].includes(budget));assert.notEqual(operation,'unknown');}
  if(['small','limited','unknown'].includes(budget))assert.ok(!['battery','generator'].includes(r.route));
  if(duration==='days'&&leave==='no')assert.ok(r.actions.some(a=>a.id==='extended'));
 }
});

test('short whole-house needs do not automatically justify an engine',()=>{assert.equal(result({load:'whole',duration:'short',noise:'accept',budget:'permanent'}).route,'battery');});

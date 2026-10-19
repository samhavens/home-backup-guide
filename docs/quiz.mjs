import { questions, recommend, answerSummary } from './decision.mjs';

const host = document.getElementById('quiz-content');
const quiz = document.getElementById('quiz');
const printButton = document.getElementById('print');
const answers = {};
function element(tag, text, className) {
 const node=document.createElement(tag);
 if(text!==undefined) node.textContent=text;
 if(className) node.className=className;
 return node;
}
function button(text, action, className='') {
 const node=element('button',text,className);node.type='button';node.addEventListener('click',action);return node;
}
function focusScreen() {
 quiz.scrollIntoView({block:'start'});
 const heading=host.querySelector('h1,h2');
 if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
function renderQuestion(index, after='next') {
 document.body.classList.remove('quiz-result');
 printButton.textContent='Print guide';
 const q=questions[index];
 host.replaceChildren();
 const progress=element('p',`Question ${index+1} of ${questions.length}`,'quiz-progress');
 const heading=element('h1',q.title,'task-title');heading.id='question-title';
 const hint=element('p',q.hint,'question-hint');hint.id='question-hint';
 const form=element('form');form.noValidate=true;
 const group=element('fieldset');
 const legend=element('legend',q.title,'sr-only');group.append(legend);group.setAttribute('aria-describedby','question-hint answer-error');
 for(const [value,label,description] of q.choices) {
  const choice=element('label',undefined,'quiz-choice');
  const radio=document.createElement('input');radio.type='radio';radio.name=q.id;radio.value=value;radio.checked=answers[q.id]===value;
  const words=element('span');words.append(element('strong',label),element('span',description,'choice-description'));
  choice.append(radio,words);group.append(choice);
 }
 const error=element('p','','quiz-error');error.id='answer-error';error.setAttribute('role','alert');
 const controls=element('div',undefined,'quiz-nav');
 if(index>0&&after==='next') controls.append(button('Back',()=>{const selected=form.querySelector('input:checked');if(selected)answers[q.id]=selected.value;renderQuestion(index-1);}));
 if(after==='result') controls.append(button('Cancel change',renderResult));
 const next=element('button',after==='result'?'Update my plan':index===questions.length-1?'See my plan':'Continue','primary');next.type='submit';controls.append(next);
 form.append(group,error,controls);
 form.addEventListener('submit',event=>{
  event.preventDefault();const selected=form.querySelector('input:checked');
  if(!selected){error.textContent='Please choose one answer. “Not sure” is fine.';form.querySelector('input').focus();return;}
  answers[q.id]=selected.value;
  if(after==='result'||index===questions.length-1) renderResult();else renderQuestion(index+1);
 });
 form.addEventListener('change',()=>{error.textContent='';});
 host.append(progress,heading,hint,form,element('p','Your answers stay on this page. Refreshing starts the quiz over.','quiz-privacy'));
 focusScreen();
}
function requestText(plan) {
 const load=answers.load==='whole'?'most household use':answers.load==='essentials'?'the refrigerator, selected lights, phone charging, and internet equipment':'a sensible set of essential appliances to be defined with you';
 const cooling={none:'We do not request backup air conditioning.',room:'Include one suitable cooled room.',whole:'Include our usual central air conditioning.',unknown:'Help us define a safe cooling arrangement.'}[answers.cooling];
 const duration={short:'Our outages are usually a few hours.',overnight:'We want coverage through the night or most of a day.',days:'We want a plan for more than one day without utility power.',unknown:'Please help us establish our outage history and required coverage.'}[answers.duration];
 const budget=answerSummary(answers).find(row=>row.id==='budget').answer;
 return `We are Bob and Roberta in Calabasas. We want backup for ${load}. ${cooling} ${duration} Our comfortable purchase range: ${budget}. ${plan.scope} Please explain what we personally must do during an outage and identify one service contact.`;
}
function planText(plan) {
 return [
 'Backup plan for Bob and Roberta',
 plan.title,
 `NEXT STEP: ${plan.next}`,
 plan.cost,
 `REQUEST: ${requestText(plan)}`,
 ...plan.actions.map(a=>`${a.title} ${a.text}${a.href?` ${a.href}`:''}`),
 'OUR ANSWERS:',
 ...answerSummary(answers).map(a=>`${a.question} ${a.answer}`),
 `Important: ${plan.limit}`,
 'These are screening recommendations and planning allowances, not a sized design or a promise of program eligibility.',
 'CPA Energy Team: 866-319-4488, Monday-Friday, 9 am-5 pm Pacific. No-charge guidance for CPA customers.',
 'Guide: https://samhavens.github.io/home-backup-guide/'
 ].join('\n\n');
}
function renderResult() {
 const plan=recommend(answers);
 host.replaceChildren();document.body.classList.add('quiz-result');printButton.textContent='Print my plan';
 host.append(element('p','Your backup plan','quiz-progress'),element('h1',plan.title,'task-title'),element('p',plan.next,'result-next'),element('p',plan.cost,'result-cost'));
 const next=element('section',undefined,'result-action');next.append(element('h3','Do this next'));
 if(plan.route==='portable') next.append(element('p','Ask a helper to confirm the appliance requirements and set up a demonstration. If you want independent guidance first, call the CPA Energy Team.'));
 else next.append(element('p','Use the prepared request below when you call. You do not need to work out equipment sizes or repeat the guide’s questions.'));
 if(answers.medical==='yes') {
  const link=element('a','Check SCE battery assistance','button primary');link.href='https://www.sce.com/outages-safety/outage-preparedness/critical-care-backup-battery-program';next.append(link,element('p','Ask SCE to confirm eligibility and availability. No benefit is assumed.','contact-hours'));
 } else {
  const call=element('a','Call CPA: 866-319-4488','button primary');call.href='tel:+18663194488';next.append(call,element('p','For CPA customers. Monday-Friday, 9 am-5 pm Pacific.','contact-hours'));
 }
 const website=element('a','CPA Energy Team website');website.href='https://cleanpoweralliance.org/energyteam/';next.append(website);host.append(next);
 for(const action of plan.actions) {
  const section=element('section',undefined,'plan-step');section.append(element('h3',action.title),element('p',action.text));
  if(action.href){const link=element('a',action.link);link.href=action.href;section.append(link);}
  host.append(section);
 }
 const request=element('section',undefined,'quote-request');request.append(element('h3','Your request, ready to use'),element('p',`“${requestText(plan)}”`));host.append(request);
 const tools=element('div',undefined,'result-tools');const copyStatus=element('p','','copy-status');copyStatus.setAttribute('role','status');
 tools.append(button('Copy my complete plan',async()=>{
  const text=planText(plan);
  try {
   if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(text);copyStatus.textContent='Plan copied. You can paste it into a message or email.';
  } catch {
   copyStatus.textContent='Select and copy the plan below. On a phone, touch and hold the text.';
   if(!host.querySelector('#copy-plan')){
    const label=element('label','Your complete plan');label.htmlFor='copy-plan';const area=document.createElement('textarea');area.id='copy-plan';area.readOnly=true;area.value=text;area.rows=12;tools.after(label,area);area.focus();area.select();
   }else{const area=host.querySelector('#copy-plan');area.focus();area.select();}
  }
 }),button('Print my plan',()=>window.print()));
 host.append(tools,copyStatus);
 const why=element('details');why.append(element('summary','Why this fits your answers'));
 const reasons=element('ul');plan.reasons.forEach(reason=>reasons.append(element('li',reason)));why.append(reasons,element('p',plan.limit));host.append(why);
 const review=element('details');review.id='answer-review';review.append(element('summary','Review or change your answers'));
 const list=element('div',undefined,'answer-review');for(const row of answerSummary(answers)){
  const item=element('div');item.append(element('h3',row.question),element('p',row.answer),button(`Change: ${row.answer}`,()=>renderQuestion(questions.findIndex(q=>q.id===row.id),'result')));list.append(item);
 }review.append(list);host.append(review);
 host.append(element('p','This plan identifies what to do next. An installer must confirm equipment compatibility, actual runtime, and the complete price. Assistance programs must confirm eligibility.','result-limit'));
 host.append(button('Start over (clears answers)',()=>{for(const key of Object.keys(answers))delete answers[key];renderQuestion(0);},'restart'));
 focusScreen();
}
document.getElementById('quiz-start').addEventListener('click',event=>{event.preventDefault();renderQuestion(0);});

let printSnapshot=null;
window.addEventListener('beforeprint',()=>{
 if(!document.body.classList.contains('quiz-result')||printSnapshot!==null)return;
 printSnapshot=Array.from(host.querySelectorAll('details'),node=>({node,open:node.open}));
 printSnapshot.forEach(({node})=>{node.open=true;});
});
window.addEventListener('afterprint',()=>{
 if(printSnapshot===null)return;
 printSnapshot.forEach(({node,open})=>{node.open=open;});
 printSnapshot=null;
});

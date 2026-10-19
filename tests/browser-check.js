const page=await browser.getPage('quiz');
const checks=[];
function check(condition,label){if(!condition)throw new Error(label);checks.push(label);}
async function complete(values){
 await page.goto('http://127.0.0.1:8791',{waitUntil:'networkidle'});
 await page.getByRole('link',{name:'Find my plan',exact:true}).click();
 for(let i=0;i<values.length;i++){
  await page.locator(`input[value="${values[i]}"]`).check();
  await page.getByRole('button',{name:i===values.length-1?'See my plan':'Continue',exact:true}).click();
 }
 return await page.locator('#quiz-content h1').textContent();
}
await page.setViewportSize({width:390,height:844});
const basic=['essentials','none','short','yes','self','quiet','small','unknown','low-cost','no','unknown'];
check((await complete(basic)).includes('plug-in battery'),'portable result');
await page.getByText('Review or change your answers',{exact:true}).click();
await page.locator('.answer-review > div').nth(1).getByRole('button').click();
await page.locator('input[value="room"]').check();
await page.getByRole('button',{name:'Cancel change',exact:true}).click();
check((await page.locator('#quiz-content h1').textContent()).includes('plug-in battery'),'cancel edit leaves answers unchanged');
await page.getByText('Review or change your answers',{exact:true}).click();
await page.locator('.answer-review > div').nth(1).getByRole('button').click();
await page.locator('input[value="room"]').check();
await page.getByRole('button',{name:'Update my plan',exact:true}).click();
check((await page.locator('#quiz-content h1').textContent()).includes('cooling first'),'editing updates recommendation');
check((await page.locator('.quote-request').textContent()).includes('one suitable cooled room'),'prepared request includes selected cooling');
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('Denied');}},configurable:true}));
await page.getByRole('button',{name:'Copy my complete plan',exact:true}).click();
check((await page.locator('#copy-plan').inputValue()).includes('Less than $1,500'),'clipboard denial offers complete selectable plan');
await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
check(await page.locator('#quiz-content').evaluate(e=>[...e.querySelectorAll('details')].every(d=>d.open)),'print opens result details');
await page.emulateMedia({media:'print'});
check(await page.locator('#background-guide').evaluate(e=>getComputedStyle(e).display==='none'),'result printing excludes long guide');
await page.emulateMedia({media:'screen'});
await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
check(await page.locator('#quiz-content').evaluate(e=>[...e.querySelectorAll('details')].every(d=>!d.open)),'print restores result disclosures');
const battery=['essentials','room','overnight','yes','automatic','quiet','permanent','unknown','low-cost','no','unknown'];
check((await complete(battery)).includes('automatic battery'),'battery result');
const generator=['whole','whole','days','no','automatic','accept','permanent','unknown','low-cost','no','long'];
check((await complete(generator)).includes('standby generator'),'generator result');
check((await page.locator('#quiz-content').textContent()).includes('several days without utility power'),'extended-outage action');
const medical=[...basic];medical[9]='yes';
check((await complete(medical)).includes('medical-device backup assistance'),'medical assistance first');
check((await page.locator('.result-action .button').getAttribute('href')).includes('sce.com'),'medical primary action goes to SCE');
check((await complete(Array(11).fill('unknown'))).includes('assessment'),'all unknown answers get defined assessment');
await page.getByRole('button',{name:'Start over (clears answers)',exact:true}).click();
check(await page.locator('#quiz-content input:checked').count()===0,'restart clears answers');
await page.getByRole('button',{name:'Continue',exact:true}).click();
check((await page.locator('#answer-error').textContent()).includes('choose one'),'missing answer gives useful error');
await page.locator('input[value="essentials"]').check();await page.getByRole('button',{name:'Continue',exact:true}).click();
await page.locator('input[value="room"]').check();await page.getByRole('button',{name:'Back',exact:true}).click();
check(await page.locator('input[value="essentials"]').isChecked(),'Back preserves previous answer');
await page.getByRole('button',{name:'Continue',exact:true}).click();
check(await page.locator('input[value="room"]').isChecked(),'Back preserves an answer selected before going back');
for(const width of [320,390,1280]){
 await page.setViewportSize({width,height:844});
 check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`no overflow at ${width}`);
}
await page.setViewportSize({width:320,height:844});
await page.getByRole('button',{name:'Larger text',exact:true}).click();
check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow with larger text at 320');
await page.getByRole('button',{name:'Standard text',exact:true}).click();
console.log(JSON.stringify({passed:checks.length,checks}));
console.log(await saveScreenshot(await page.screenshot(),'quiz-question-final.png'));
await page.setViewportSize({width:390,height:844});await complete(battery);
console.log(await saveScreenshot(await page.screenshot(),'quiz-battery-final.png'));

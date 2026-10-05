/* Pure scroll-to-scene model. No clocks, autoplay or DOM dependencies. */
(function (root) {
 'use strict';
 const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
 const ramp = (p,a,b) => { const t=clamp((p-a)/(b-a)); return t*t*(3-2*t); };
 const lerp = (a,b,t) => a+(b-a)*t;
 // Every position refers to the same container, never a swapped asset.
 const poses = [
  [0,680,386,1,1], [.06,680,386,1,1], [.13,650,370,1,1.35], [.24,650,370,1,1.35],
  [.30,650,386,1,.9], [.35,650,386,1,.9], [.38,650,386,1,.9],
  [.405,650,245,1,.9], [.44,500,245,1,.9], [.48,500,386,1,.9],
  [.51,500,386,1,.9], [.59,620,386,1,.9],
  [.65,470,530,.2,.9], [.715,470,530,.2,.9],
  [.75,470,290,.2,.9], [.79,804,290,.2,.9], [.825,804,409,.2,.9],
  [.85,804,409,.2,.9], [.92,859,419,.2,.78],
  [.945,859,419,.2,.78], [.98,650,370,1,1.35], [1,650,370,1,1.35]
 ];
 const chapters = [
  {at:0,label:'THE JOURNEY OF A SEAL',title:'Small seal. Big confidence.',description:'Global Seals supplies security seals for business applications.',detail:'YARD / BEFORE DISPATCH'},
  {at:.065,label:'01 / SECURE THE CONTAINER',title:'A precise connection.',description:'The doors close and the locking bar turns into position. The bolt aligns with the locking point.',detail:'CONTAINER DOORS / LOCKING HARDWARE'},
  {at:.17,label:'01 / VISIBLE IDENTIFICATION',title:'Small detail. Clear reference.',description:'Matching identification on the bolt and barrel supports shipment checks at handover points.',detail:'BOLT + BARREL / SEAL ID 000043'},
  {at:.24,label:'02 / THE SCALE OF THE JOURNEY',title:'One small connection.',description:'A sealed container. Surrounded by an operation much bigger than itself.',detail:'SEAL APPLIED / IDENTIFICATION RECORDED'},
  {at:.32,label:'03 / TERMINAL HANDLING',title:'Lift. Align. Place.',description:'The spreader connects at the container corners. The crane lifts, transfers and lowers the container onto a truck chassis.',detail:'YARD CRANE / CONTROLLED TRANSFER'},
  {at:.49,label:'04 / ROAD TRANSPORT',title:'Identifiable at every handover.',description:'The seal stays with the container. Its visible number remains a reference for the next shipment check.',detail:'ROAD / SEAL ID 000043'},
  {at:.60,label:'05 / PORT APPROACH',title:'A much bigger operation.',description:'The sealed container reaches the terminal, ready for its next handover.',detail:'ORIGIN: SEAL APPLIED / ROAD: IDENTIFICATION MAINTAINED'},
  {at:.665,label:'06 / PORT HANDOVER',title:'Pause. Check. Continue.',description:'Check the seal is present and compare its identification with the shipment records before loading.',detail:'PORT CHECKPOINT / PRESENCE + IDENTIFICATION'},
  {at:.715,label:'07 / VESSEL LOADING',title:'One among many.',description:'A ship-to-shore crane lifts the same container into its available position on an already loaded vessel.',detail:'LIFT / TRANSFER / LOWER / RELEASE'},
  {at:.835,label:'08 / DEPARTURE',title:'One seal. The whole journey.',description:'Security that travels with your cargo. The vessel leaves the terminal, and the same seal stays attached.',detail:'ON VESSEL / SEAL ID 000043'},
  {at:.90,label:'09 / OPEN WATER',title:'From origin to destination.',description:'Our product does not move the shipment. It helps make shipment integrity visible along the way.',detail:'ILLUSTRATIVE SHIPMENT / SECURITY SEALS BY GLOBAL SEALS'},
  {at:.95,label:'10 / DESTINATION INSPECTION',title:'Arrive. Check. Confirm.',description:'Inspect the seal and verify its identification against shipment records before authorised removal.',detail:'PRESENCE / SERIAL IDENTIFICATION / CONDITION'}
 ];
 function sample(progress) {
  const p=clamp(progress); let i=0;
  while(i<poses.length-2 && p>poses[i+1][0])i++;
  const a=poses[i],b=poses[i+1],t=ramp(p,a[0],b[0]);
  const [x,y,scale,camera]=a.slice(1).map((v,j)=>lerp(v,b[j+1],t));
  const departure=ramp(p,.85,.92),destination=ramp(p,.945,.98);
  const port=ramp(p,.60,.65)*(1-ramp(p,.86,.92));
  const ocean=ramp(p,.61,.65)*(1-destination);
  const yardCrane=ramp(p,.31,.35)*(1-ramp(p,.48,.50));
  const shipCrane=ramp(p,.69,.715)*(1-ramp(p,.83,.845));
  const crane=Math.max(yardCrane,shipCrane);
  const isShip=p>.6;
  const hooked=isShip?(p>=.715&&p<=.825):(p>=.38&&p<=.48);
  // Align before lifting, and retract after release. Transfer phases have constant Y.
  let gap=0;
  if(!hooked)gap=isShip?(p<.715?65*(1-ramp(p,.69,.715)):65*ramp(p,.825,.845)):(p<.38?70*(1-ramp(p,.35,.38)):70*ramp(p,.48,.50));
  const truckVisible=ramp(p,.34,.38)*(1-ramp(p,.72,.75));
  let truckX=x,truckY=y,truckScale=scale;
  if(p<.49){truckX=500;truckY=386;truckScale=1;}
  else if(p>.65){truckX=470;truckY=530;truckScale=.2;}
  const chapter=chapters.filter(c=>p>=c.at).at(-1);
  return {p,x,y,scale,camera,chapter,hero:1-ramp(p,.035,.075),
   doors:ramp(p,.085,.135),handle:ramp(p,.135,.16),pin:ramp(p,.16,.20),barrel:ramp(p,.20,.24),sealVisible:ramp(p,.15,.165),
   yard:(1-ramp(p,.59,.65))*(1-destination),yardX:-ramp(p,.49,.60)*230,
   ground:1-ocean,port,ocean,ship:ramp(p,.61,.65)*(1-destination),shipX:450+departure*55,shipY:310+departure*10,
   crane,hooked,spreaderX:x,spreaderY:y-gap,spreaderScale:scale,
   truckVisible,truckX,truckY,truckScale,wheelAngle:ramp(p,.49,.65)*920,
   // Foreground is road parallax; at the destination it would return shifted and zoomed, so keep it hidden there.
   roadX:-ramp(p,.49,.65)*900,foreground:(1-ocean)*(1-destination),
   inspection:destination,waterX:departure*30,departure,destination,
   inset:p<.065?1:0};
 }
 root.SealStory={sample,chapters,clamp};
})(typeof window!=='undefined'?window:globalThis);

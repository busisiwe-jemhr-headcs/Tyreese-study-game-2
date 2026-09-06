import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createClient} from '@supabase/supabase-js';
import './styles.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const FAMILY_CODE = import.meta.env.VITE_FAMILY_CODE || 'TYREESE-LOCAL';
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const SUBJECTS = [
  {id:'maths', name:'Mathematics', icon:'➗', color:'violet', tagline:'Build the brain XP.', topics:['Fractions','Angles & turns','Parallel & perpendicular lines','Squares, rectangles & quadrilaterals','Whole numbers & mental maths']},
  {id:'geography', name:'Geography', icon:'🌍', color:'cyan', tagline:'Read the map. Read the weather.', topics:['Weather elements & measurement','Rainfall patterns','Weather vs climate','South African climates','Natural vegetation & savannah']},
  {id:'history', name:'History', icon:'🏺', color:'amber', tagline:'Unlock the ancient world.', topics:['Ancient Egypt','Nile River','Pharaohs & society','Sources & evidence','Paragraph/source-based reasoning']},
  {id:'nst', name:'NST', icon:'⚡', color:'orange', tagline:'Energy. Change. Systems.', topics:['Energy & fuels','Fire triangle & safety','Simple circuits','Electricity to homes','Energy & movement','Wheels & axles']},
  {id:'isizulu', name:'isiZulu', icon:'🗣️', color:'green', tagline:'Speak it. Read it. Use it.', topics:['Reading comprehension','Vocabulary','Sentence building','Grammar','Writing & communication']},
  {id:'english', name:'English', icon:'📚', color:'blue', tagline:'Read deeper. Write sharper.', topics:['Novel reading','Characters & themes','Book review','Pronouns, adjectives & adverbs','Conjunctions & sentence structure','Similes, idioms & proverbs']},
  {id:'coding', name:'Coding & Robotics', icon:'🤖', color:'pink', tagline:'Think like a builder.', topics:['Patterns in data','Complete symbolic patterns','Read code line-by-line','Sprites & sequences','What is a robot?','Robot types & components']}
];

const QUESTIONS = {
 maths:[
  {q:'A loot crate contains 17/10 kg of supplies. Write this as a mixed number.',a:['1 7/10','1 1/7','2 7/10','17 1/10'],c:0,e:'Divide 17 by 10: one whole with 7 tenths left.'},
  {q:'Tyreese completes 7/8 of a challenge and then another 3/4. How much has he completed altogether?',a:['1 1/8','1 5/8','10/12','13/16'],c:1,e:'Convert 3/4 to 6/8. Then 7/8 + 6/8 = 13/8 = 1 5/8.'},
  {q:'Which statement is ALWAYS true for a square?',a:['Only opposite sides are equal','All four sides are equal and all four angles are right angles','It has exactly one pair of parallel sides','Its angles add to 180°'],c:1,e:'A square has four equal sides, four right angles and opposite sides parallel.'},
  {q:'A turn of 270° is equal to…',a:['1/4 turn','1/2 turn','3/4 turn','4 complete turns'],c:2,e:'A complete turn is 360°, so 270° is three quarters.'},
  {q:'A rectangle has length 20 cm and width 9 cm. Which pair gives the other two side lengths?',a:['20 cm and 9 cm','11 cm and 29 cm','18 cm and 40 cm','9 cm and 29 cm'],c:0,e:'Opposite sides of a rectangle are equal.'},
  {q:'What is 3/5 of 100?',a:['15','30','50','60'],c:3,e:'100 ÷ 5 = 20, then 20 × 3 = 60.'},
  {q:'A line that never meets another line because they stay the same distance apart is…',a:['perpendicular','parallel','curved','a right angle'],c:1,e:'Parallel lines remain equidistant and do not intersect.'},
  {q:'Which answer shows 19/6 as a mixed number?',a:['2 6/19','3 1/6','3 6/1','2 3/6'],c:1,e:'18/6 is 3, with 1/6 remaining.'}
 ,
  {q:"Which fraction is equivalent to 3/4?",a:["6/8", "3/8", "4/6", "9/16"],c:0,e:"Multiply numerator and denominator by 2: 3/4 = 6/8."},
  {q:"A map mission says the market is southwest of the park. If Tyreese walks from the market to the park, which direction is he travelling?",a:["Southwest", "Northeast", "Southeast", "Northwest"],c:1,e:"The reverse of southwest is northeast."},
  {q:"A rectangle and a square both have four right angles. What makes the square different?",a:["It has no parallel sides", "All four sides are equal", "It has only three sides", "Its angles are not 90°"],c:1,e:"A square has four equal sides as well as four right angles."},
  {q:"Tyreese says 2/3 + 1/6 = 3/9 because he added the denominators. What should you tell him?",a:["Add denominators every time", "Use a common denominator, then add the numerators", "Subtract the numerators", "Multiply the denominators only"],c:1,e:"Use sixths: 2/3 = 4/6, so 4/6 + 1/6 = 5/6."}],
 geography:[
  {q:'Which set contains three elements of weather?',a:['Temperature, wind, rainfall','Soil, rocks, minerals','Population, roads, trade','Crops, factories, mines'],c:0,e:'Weather includes temperature, wind, cloud cover and rainfall.'},
  {q:'Weather describes…',a:['the usual conditions over many decades','conditions of the atmosphere at a particular time/place','only rainfall','only temperature'],c:1,e:'Weather is short-term atmospheric conditions; climate describes longer-term patterns.'},
  {q:'Which instrument is used to measure rainfall?',a:['Thermometer','Rain gauge','Wind vane','Compass'],c:1,e:'A rain gauge collects and measures rainfall.'},
  {q:'A place has hot summers and cool winters. Which question helps determine its climate?',a:['What happened at 2pm today?','What are the long-term patterns over time?','What colour is the sky?','Which direction is north?'],c:1,e:'Climate is based on patterns over longer periods.'},
  {q:'Why is natural vegetation linked to climate?',a:['Plants need conditions such as suitable temperature and water','Plants decide the weather','All plants need exactly the same climate','Vegetation changes the calendar'],c:0,e:'Climate affects water availability and growing conditions, so plants adapt to local climates.'},
  {q:'Savannah grasslands are best described as…',a:['only dense rainforest','grassland with scattered trees/shrubs in suitable climates','permanent snowfields','desert with no plants'],c:1,e:'Savannah has grasses with scattered trees and is linked to its climate.'}
 ,
  {q:"A thermometer reads 28°C and a wind vane points west. Which statement is an observation of today's weather?",a:["It is 28°C and wind is from the west", "The region has a tropical climate", "The vegetation is savannah", "It always rains in winter"],c:0,e:"Those are short-term measurable weather observations."},
  {q:"Why might rainfall maps show different patterns across South Africa?",a:["Rainfall is distributed differently across places and seasons", "Every place gets the same rainfall", "Maps create rainfall", "Vegetation controls all rain"],c:0,e:"Location, season and climate patterns affect rainfall distribution."},
  {q:"A plant has features that help it survive with little water. This is an example of…",a:["adaptation", "a weather instrument", "a map scale", "precipitation"],c:0,e:"An adaptation helps an organism survive in its environment."},
  {q:"Which is the best way to investigate how weather changes?",a:["Record observations regularly and look for patterns", "Make one guess", "Only check one afternoon", "Use a fictional story"],c:0,e:"Repeated observations let you compare conditions and identify patterns."}],
 history:[
  {q:'Why was the Nile River important to ancient Egypt?',a:['It provided water and supported farming and transport','It made Egypt cold','It was used only for games','It separated Egypt from Africa'],c:0,e:'The Nile supplied water, fertile land for farming and a route for movement.'},
  {q:'A historian compares two written records made at different times. What skill is being used?',a:['Guessing','Using sources as evidence','Memorising names','Drawing maps'],c:1,e:'Historical thinking uses sources to investigate and support conclusions.'},
  {q:'Which question is strongest when analysing an ancient source?',a:['Is it cool?','Who made it, when, and why?','Can I copy it?','Is it long?'],c:1,e:'Author, date/context and purpose help us judge what a source can tell us.'},
  {q:'A pharaoh was…',a:['a ruler of ancient Egypt','a Roman soldier','a river','a type of crop'],c:0,e:'Pharaohs were rulers of ancient Egypt.'},
  {q:'Why should a history paragraph explain evidence rather than only list facts?',a:['Because historians need reasons for conclusions','Because facts are not useful','Because paragraphs must be long','Because dates are optional'],c:0,e:'Good historical writing connects evidence to a reasoned conclusion.'}
 ,
  {q:"Why was farming possible near the Nile?",a:["The river provided water and fertile soil in an otherwise dry region", "The river stopped all sunlight", "The river made metal", "The river was a road"],c:0,e:"The Nile supported agriculture through water and fertile land."},
  {q:"If a source was created hundreds of years after the event it describes, what should a historian do?",a:["Use it carefully and consider when and why it was created", "Assume every detail is automatically true", "Ignore all evidence", "Change the date"],c:0,e:"Context and purpose affect how historians interpret sources."},
  {q:"Which answer best shows cause and effect?",a:["The Nile flooded, so fertile soil was deposited for farming", "Egypt had a pharaoh", "The Nile is a river", "A pyramid is a building"],c:0,e:"Cause and effect explains why one event or condition leads to another."},
  {q:"A source shows a picture of a royal ceremony. What might it tell a historian?",a:["Something about status, culture or beliefs — but it must be interpreted carefully", "Every person's private thoughts", "The exact temperature that day", "Nothing at all"],c:0,e:"Sources can provide clues, but historians must consider perspective and context."}],
 nst:[
  {q:'What happens when a spring is compressed and then released?',a:['Stored energy can produce movement','It loses all energy instantly','It becomes a battery','It turns into water'],c:0,e:'Compression stores energy; releasing the spring can produce movement.'},
  {q:'Which three things are needed for most fires to start and continue?',a:['Fuel, heat, oxygen','Water, ice, wind','Soil, light, oxygen','Metal, water, fuel'],c:0,e:'The fire triangle is fuel + heat + oxygen.'},
  {q:'What is the main purpose of a complete circuit?',a:['To provide a continuous path for electric current','To stop electricity completely','To create rain','To measure temperature'],c:0,e:'A complete circuit gives electricity a continuous path.'},
  {q:'Why do wheels and axles help many vehicles move?',a:['They can reduce friction and make movement easier','They make vehicles heavier','They stop all movement','They create fuel'],c:0,e:'The wheel-and-axle system helps rolling movement happen more easily.'},
  {q:'Electricity can travel from a power station to homes through…',a:['an electricity distribution network','a rain gauge','a compass','a spring only'],c:0,e:'Electricity is generated and transmitted through a network to users.'},
  {q:'If a fire is unsafe to fight, what is the best response?',a:['Raise the alarm, get to safety and follow emergency procedures','Hide nearby','Touch the fire to test it','Add fuel'],c:0,e:'Safety comes first: alert others, evacuate and follow the appropriate emergency response.'}
 ,
  {q:"A battery, wires and a bulb are connected, but the bulb stays off. What is a sensible first check?",a:["Check whether the circuit is complete and connections are secure", "Add water", "Break the bulb", "Remove all wires"],c:0,e:"A break or poor connection can stop current flowing through the circuit."},
  {q:"Why should you never use a real flame to test an idea without adult supervision?",a:["Fire can cause burns and uncontrolled fires", "Fire cannot produce energy", "Fire is always cold", "Flames are only imaginary"],c:0,e:"Fire is hazardous; safe investigation requires proper controls and supervision."},
  {q:"Which situation demonstrates stored energy becoming movement energy?",a:["A stretched elastic band is released and moves an object", "A rock sits still", "A lamp is switched off", "Rain falls on a roof"],c:0,e:"The stretched elastic stores energy that can be transferred to movement."},
  {q:"If two wheel-and-axle designs are tested, what makes the comparison fair?",a:["Change one important variable while keeping other conditions similar", "Change everything at once", "Only test the faster one", "Choose the result you like"],c:0,e:"Fair tests control variables so the effect of the chosen change can be judged."}],
 isizulu:[
  {q:'What does “umfana” mean?',a:['boy','girl','school','book'],c:0,e:'Umfana means boy.'},
  {q:'Which sentence means “The boy is reading”?',a:['Umfana uyafunda.','Umfana uyadlala.','Intombazane iyacula.','Umama uyapheka.'],c:0,e:'Uyafunda means is reading/studying.'},
  {q:'If a sentence is asking a question, what should Tyreese pay attention to?',a:['Meaning and question structure','Only the first letter','Only the last word','The number of commas'],c:0,e:'Comprehension means understanding what the sentence is asking and responding appropriately.'},
  {q:'Choose the best reason for reading a passage twice.',a:['To confirm meaning and details','To make it longer','To avoid understanding it','To change every word'],c:0,e:'Re-reading can help identify details and confirm meaning.'},
  {q:'Which is the strongest answer to a comprehension question?',a:['A random word','A full response supported by the passage','Only “yes”','A copied title'],c:1,e:'A strong comprehension response shows understanding and uses evidence from the text.'}
 ,
  {q:"Which word means “girl”?",a:["intombazane", "umfana", "umuntu", "isikole"],c:0,e:"Intombazane means girl."},
  {q:"Choose the sentence that best means “The mother is cooking.”",a:["Umama uyapheka.", "Umama uyafunda.", "Umama uyagijima.", "Umama uyacula."],c:0,e:"Uyapheka means is cooking."},
  {q:"When answering a reading question in isiZulu, why should you look back at the passage?",a:["To support your answer with the correct meaning and details", "To copy random words", "To avoid reading", "To change the story"],c:0,e:"Returning to the text helps you answer from evidence rather than guessing."},
  {q:"Which strategy helps when you meet an unfamiliar isiZulu word?",a:["Use surrounding words and context, then check a dictionary if needed", "Ignore the whole sentence", "Invent any meaning", "Skip the paragraph"],c:0,e:"Context gives clues; a dictionary can confirm meaning."}],
 english:[
  {q:'In a novel, why does a character’s decision matter?',a:['It can reveal character, move events forward or create conflict','It only fills space','It changes the font','It has no effect'],c:0,e:'Character choices often reveal traits and drive the plot.'},
  {q:'What is the central message of a story?',a:['The main idea or lesson the text communicates','The longest sentence','The page number','The author’s address'],c:0,e:'The central message is the key idea or lesson.'},
  {q:'Which is a simile?',a:['The runner was fast.','The runner was as fast as lightning.','The runner ran.','The runner stopped.'],c:1,e:'A simile compares using words such as “like” or “as”.'},
  {q:'Which sentence uses the past tense?',a:['Tyreese plays.','Tyreese is playing.','Tyreese played.','Tyreese will play.'],c:2,e:'Played tells us the action happened in the past.'},
  {q:'What makes a book review useful?',a:['It summarises key points and gives a supported opinion','It only gives a star rating','It copies the whole book','It has no evidence'],c:0,e:'A good review combines relevant summary with a reasoned evaluation.'},
  {q:'Which word is an adjective?',a:['quickly','bright','run','under'],c:1,e:'Bright describes a noun, so it is an adjective.'}
 ,
  {q:"Which sentence uses a conjunction to join ideas?",a:["Tyreese studied because he wanted to improve.", "Tyreese studied.", "Tyreese, quickly.", "Study!"],c:0,e:"Because connects the reason to the action."},
  {q:"What is an adverb doing in “Tyreese answered carefully”?",a:["It tells how he answered", "It names a person", "It describes a noun", "It joins two paragraphs"],c:0,e:"Carefully tells how the action was performed."},
  {q:"Which is the best evidence for saying a character is brave?",a:["A scene where the character faces danger to help someone", "The character's name", "The page number", "The book cover colour"],c:0,e:"A character's actions provide evidence for an interpretation."},
  {q:"A proverb is best understood as…",a:["a short traditional saying that expresses a lesson or idea", "a character's name", "a punctuation mark", "a paragraph heading"],c:0,e:"Proverbs convey shared wisdom or a lesson."}],
 coding:[
  {q:'If code says “move 10 steps” four times, what pattern is happening?',a:['A repeated sequence','A random event','A spelling rule','A weather pattern'],c:0,e:'The same instruction repeats, which is a sequence/pattern.'},
  {q:'Why should you read code line-by-line before running it?',a:['To predict what the program should do and spot logic mistakes','To make the computer slower','To avoid learning','Because code cannot be tested'],c:0,e:'Reading first helps you reason about the program and compare your prediction with its behaviour.'},
  {q:'A robot is best described as…',a:['a machine designed to perform tasks using programmed/control systems','any toy with wheels','a human wearing metal','a computer game'],c:0,e:'Robots are machines that can be designed to sense, control and/or perform tasks.'},
  {q:'Which is an example of changing existing code?',a:['Copying code and changing values so a sprite moves differently','Deleting the whole project','Turning off the laptop','Printing the keyboard'],c:0,e:'Modifying an existing program to create a new effect is a core coding skill.'},
  {q:'A pattern has 2, 4, 6, 8, ?. What belongs next?',a:['9','10','12','16'],c:1,e:'The pattern increases by 2 each time.'},
  {q:'Why are patterns useful in coding?',a:['They help us recognise repeated rules and predict what comes next','They make all programs identical','They remove logic','They stop computers working'],c:0,e:'Recognising patterns supports algorithmic and computational thinking.'}
 ,
  {q:"A sprite moves 20 steps, turns, then repeats. What is the most important idea to understand?",a:["The order of instructions changes the program's behaviour", "The colour of the sprite is the algorithm", "A computer guesses the next command", "Loops have no purpose"],c:0,e:"Sequence and repetition are core programming ideas."},
  {q:"A pattern is ▲ ● ▲ ● ▲ ●. What should come next?",a:["▲", "■", "●", "◆"],c:0,e:"The two-symbol pattern alternates, so the next symbol is ▲."},
  {q:"Which robot component helps a robot detect information from its environment?",a:["A sensor", "A sticker", "A paintbrush", "A notebook"],c:0,e:"Sensors collect information that a robot can use for decisions/control."},
  {q:"Tyreese changes one command in a working program, runs it, and compares the result. This is useful because…",a:["It helps him test cause and effect in the code", "It prevents learning", "It guarantees every change is correct", "It removes the need to think"],c:0,e:"Changing one part and testing helps isolate how the instruction affects behaviour."}]
};

const storageKey='tyreese-quest-state-v1';
const defaultState={player:{name:'Tyreese',handle:'TYR3ESE',xp:0,level:1,streak:0},sessions:[],subjectStats:{}};

function loadLocal(){try{return JSON.parse(localStorage.getItem(storageKey))||defaultState}catch{return defaultState}}
function saveLocal(s){localStorage.setItem(storageKey,JSON.stringify(s))}
function avatarSvg(){
 return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#7c3aed"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs>
 <circle cx="110" cy="110" r="105" fill="#0f172a"/>
 <circle cx="110" cy="112" r="82" fill="url(#g)" opacity=".25"/>
 <path d="M62 91c0-38 22-58 48-58s48 20 48 58v24H62z" fill="#17120f"/>
 <path d="M71 103c0-25 16-45 39-45s39 20 39 45v31c0 27-17 45-39 45s-39-18-39-45z" fill="#7b4a2d"/>
 <path d="M67 96c7-31 24-48 44-48 23 0 40 17 44 48-17-13-34-17-48-17-15 0-28 6-40 17z" fill="#201510"/>
 <circle cx="94" cy="119" r="5" fill="#101010"/><circle cx="126" cy="119" r="5" fill="#101010"/>
 <path d="M97 145c9 7 18 7 27 0" fill="none" stroke="#2b160e" stroke-width="5" stroke-linecap="round"/>
 <path d="M72 171c24 18 52 18 76 0l17 24H55z" fill="#111827"/>
 <path d="M83 174h54v31H83z" fill="#111827"/>
 <path d="M91 181h38l-4 17H95z" fill="#22d3ee"/>
 <path d="M80 96h25" stroke="#111" stroke-width="6" stroke-linecap="round"/><path d="M115 96h25" stroke="#111" stroke-width="6" stroke-linecap="round"/>
 </svg>`;
}

function levelForXp(xp){return Math.floor(xp/500)+1}
function pct(n,d){return d?Math.round(n/d*100):0}

function App(){
 const [state,setState]=useState(loadLocal);
 const [view,setView]=useState('home');
 const [subject,setSubject]=useState(null);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [answers,setAnswers]=useState([]);
 const [started,setStarted]=useState(false);
 const [finished,setFinished]=useState(false);
 const [parentMode,setParentMode]=useState(false);
 const [parentPin,setParentPin]=useState('');
 const [notice,setNotice]=useState('');

 useEffect(()=>{saveLocal(state)},[state]);
 useEffect(()=>{
   if(!supabase)return;
   // Pull the latest shared state and listen for live parent-dashboard updates.
   supabase.from('player_state').select('state').eq('family_code',FAMILY_CODE).maybeSingle()
    .then(({data})=>{if(data?.state){setState(data.state); saveLocal(data.state)}});

   const channel=supabase.channel('tyreese-live')
     .on('postgres_changes',
       {event:'UPDATE',schema:'public',table:'player_state',filter:`family_code=eq.${FAMILY_CODE}`},
       payload=>{if(payload.new?.state){setState(payload.new.state);saveLocal(payload.new.state)}}
     ).subscribe();

   return ()=>{supabase.removeChannel(channel)};
 },[]);
 const sync=async(next)=>{
   setState(next); saveLocal(next);
   if(supabase){
     await supabase.from('player_state').upsert({family_code:FAMILY_CODE,state:next,updated_at:new Date().toISOString()},{onConflict:'family_code'});
   }
 };
 const currentQs=subject?QUESTIONS[subject.id]:[];
 const currentQ=currentQs[questionIndex];
 const avgBySubject=useMemo(()=>{
   const out={};
   for(const s of SUBJECTS){
     const st=state.subjectStats[s.id];
     out[s.id]=st?Math.round(st.correct/st.total*100):0;
   }
   return out;
 },[state]);
 const overall=useMemo(()=>{
   let c=0,t=0; Object.values(state.subjectStats).forEach(x=>{c+=x.correct;t+=x.total}); return pct(c,t);
 },[state]);
 const startQuest=s=>{setSubject(s);setQuestionIndex(0);setAnswers([]);setStarted(true);setFinished(false);setView('quest')};
 const choose=(i)=>{
   const next=[...answers]; next[questionIndex]=i; setAnswers(next);
 };
 const nextQuestion=async()=>{
   if(answers[questionIndex]===undefined){setNotice('Choose an answer first. Think it through — no guessing spam 😎');return}
   setNotice('');
   if(questionIndex<currentQs.length-1){setQuestionIndex(questionIndex+1);return}
   const score=currentQs.reduce((n,q,i)=>n+(answers[i]===q.c?1:0),0);
   const xp=score*75+250;
   const sid=subject.id;
   const old=state.subjectStats[sid]||{correct:0,total:0,quests:0,best:0};
   const newStat={correct:old.correct+score,total:old.total+currentQs.length,quests:old.quests+1,best:Math.max(old.best,score)};
   const next={...state,player:{...state.player,xp:state.player.xp+xp,level:levelForXp(state.player.xp+xp),streak:state.player.streak+1},subjectStats:{...state.subjectStats,[sid]:newStat},sessions:[...state.sessions,{id:Date.now(),subject:sid,score,total:currentQs.length,xp,date:new Date().toISOString()}]};
   await sync(next); setFinished(true);
 };
 const reset=()=>{localStorage.removeItem(storageKey); location.reload()};

 if(parentMode){
   return <ParentDashboard state={state} overall={overall} avgBySubject={avgBySubject} onBack={()=>setParentMode(false)} reset={reset}/>;
 }
 if(view==='quest'&&subject){
   return <Quest subject={subject} q={currentQ} index={questionIndex} total={currentQs.length} answer={answers[questionIndex]} choose={choose} next={nextQuestion} finished={finished} answers={answers} onHome={()=>{setView('home');setSubject(null)}} xp={state.player.xp} notice={notice}/>;
 }
 return <div className="app">
   <Header state={state} onParent={()=>setParentMode(true)}/>
   <main className="container">
    {view==='home' && <>
      <section className="hero">
        <div className="avatar" dangerouslySetInnerHTML={{__html:avatarSvg()}}/>
        <div><div className="eyebrow">GRADE 5 • TERM 3 • BATTLE MODE</div>
        <h1>Yo, <span>Tyreese</span> 👊</h1>
        <p>Welcome to <b>TYR3ESE QUEST HQ</b>. Seven tracks. One target: <b>80%+ mastery</b>. Your job isn't to memorise — it's to understand, explain and conquer.</p>
        <div className="heroBtns"><button className="primary" onClick={()=>document.getElementById('tracks').scrollIntoView({behavior:'smooth'})}>⚡ Drop into a Quest</button><button className="ghost" onClick={()=>setParentMode(true)}>Parent HQ</button></div></div>
      </section>
      <section className="stats">
        <div><span>LEVEL</span><strong>{state.player.level}</strong></div><div><span>XP</span><strong>{state.player.xp}</strong></div><div><span>STREAK</span><strong>🔥 {state.player.streak}</strong></div><div><span>OVERALL</span><strong>{overall}%</strong></div>
      </section>
      <section id="tracks">
       <div className="sectionHead"><div><div className="eyebrow">YOUR DROP ZONE</div><h2>Choose your track</h2></div><span className="pill">30–60 MIN • B + C</span></div>
       <div className="grid">{SUBJECTS.map(s=><SubjectCard key={s.id} s={s} mastery={avgBySubject[s.id]} onClick={()=>startQuest(s)}/>)}</div>
      </section>
      <section className="how">
        <div><b>🎯 Understand</b><span>Questions mix recall, reasoning and application.</span></div>
        <div><b>🧠 Explain</b><span>Feedback tells you why an answer works.</span></div>
        <div><b>🔥 Return</b><span>Weak skills come back in future drops.</span></div>
        <div><b>🏆 Master</b><span>80% is the mission target — 90% is elite.</span></div>
      </section>
    </>}
   </main>
   <footer>Built for Tyreese • CAPS-aligned study structure • Family-first progress tracking</footer>
 </div>
}

function Header({state,onParent}){return <header><div className="brand"><span className="logo">⚡</span><div><b>TYR3ESE</b><small>QUEST HQ</small></div></div><div className="headerRight"><div className="miniLevel">LVL {state.player.level} <span>{state.player.xp} XP</span></div><button className="parentBtn" onClick={onParent}>👀 Parent HQ</button></div></header>}

function SubjectCard({s,mastery,onClick}){
 return <button className={`subject ${s.color}`} onClick={onClick}><div className="subjectTop"><span className="subjectIcon">{s.icon}</span><span className="arrow">↗</span></div><h3>{s.name}</h3><p>{s.tagline}</p><div className="progress"><span style={{width:`${mastery}%`}}/></div><div className="subjectBottom"><span>{mastery?`${mastery}% mastery`:'Not started'}</span><span>{s.topics.length} skills</span></div></button>
}

function Quest({subject,q,index,total,answer,choose,next,finished,answers,onHome,xp,notice}){
 const score=answers.reduce((n,a,i)=>n+(a===QUESTIONS[subject.id][i].c?1:0),0);
 return <div className="questPage">
  <header><button className="back" onClick={onHome}>← HQ</button><div className="brand"><span className="logo">⚡</span><div><b>{subject.name.toUpperCase()}</b><small>MISSION TRACK</small></div></div><div className="miniLevel">XP {xp}</div></header>
  <main className="questContainer">
   {!finished?<><div className="questMeta"><span className="pill">{subject.icon} {subject.name}</span><span>Challenge {index+1}/{total}</span></div>
   <div className="bar"><span style={{width:`${((index)/total)*100}%`}}/></div>
   <div className="questionCard"><div className="eyebrow">THINK BEFORE YOU SHOOT</div><h1>{q.q}</h1><div className="answers">{q.a.map((x,i)=><button key={x} className={answer===i?'selected':''} onClick={()=>choose(i)}><span>{String.fromCharCode(65+i)}</span>{x}</button>)}</div>{notice&&<div className="notice">{notice}</div>}<button className="primary big" onClick={next}>{index===total-1?'⚔️ Finish Mission':'Next Challenge →'}</button></div>
   <div className="coach">💡 <b>Coach rule:</b> If you can't explain why your answer is correct, you don't own the skill yet.</div></>
   :<Result subject={subject} score={score} total={total} onHome={onHome}/>}
  </main>
 </div>
}

function Result({subject,score,total,onHome}){
 const p=pct(score,total); const xp=score*75+250;
 return <div className="result"><div className="resultEmoji">{p>=80?'🏆':'🧩'}</div><div className="eyebrow">MISSION COMPLETE</div><h1>{p>=80?'That was a clean drop.':'Good fight. Now we level it up.'}</h1><div className="scoreBig">{p}%</div><p>{score}/{total} correct • <b>+{xp} XP</b></p><div className={`resultBand ${p>=80?'win':''}`}>{p>=80?'80%+ target hit. Keep the streak alive.':'Below target — that’s useful data. Your next quest should revisit the weak spots.'}</div><button className="primary big" onClick={onHome}>Return to HQ</button></div>
}

function ParentDashboard({state,overall,avgBySubject,onBack,reset}){
 const recent=[...state.sessions].reverse().slice(0,8);
 const weakest=[...SUBJECTS].sort((a,b)=>(avgBySubject[a.id]||0)-(avgBySubject[b.id]||0)).slice(0,3);
 return <div className="parent"><header><button className="back" onClick={onBack}>← Tyreese HQ</button><div className="brand"><span className="logo">👀</span><div><b>PARENT HQ</b><small>PROGRESS COMMAND</small></div></div><button className="parentBtn" onClick={()=>{if(confirm('Reset all local progress?'))reset()}}>Reset local data</button></header>
 <main className="parentContainer"><div className="parentHero"><div><div className="eyebrow">TYR3ESE / {state.player.handle}</div><h1>How's he doing?</h1><p>Use this view to spot gaps early, celebrate progress and know what to do next.</p></div><div className="overallRing"><b>{overall}%</b><span>overall mastery</span></div></div>
 <div className="parentGrid"><div className="panel wide"><h2>Subject readiness</h2>{SUBJECTS.map(s=>{const m=avgBySubject[s.id];return <div className="row" key={s.id}><span className="rowName">{s.icon} {s.name}</span><div className="rowBar"><span style={{width:`${m}%`}}/></div>})}</div>
 <div className="panel"><h2>Coach him on…</h2>{weakest.map(s=><div className="tip" key={s.id}><b>{s.icon} {s.name} — {avgBySubject[s.id]}%</b><span>{avgBySubject[s.id]<70?'Do a short teach-back: ask him to explain the concept without notes.':avgBySubject[s.id]<80?'Do 5 extra questions and ask him to explain one answer aloud.':'Keep it warm: one mixed challenge to maintain mastery.'}</span></div>)}</div></div>
 <div className="parentGrid"><div className="panel"><h2>What you can do tonight</h2><ol><li>Ask Tyreese to teach you one thing he learned — no notes.</li><li>Ask “How do you know?” after an answer, not just “What is the answer?”</li><li>Keep sessions to 30–60 minutes and stop while he still has energy.</li><li>Celebrate improvement and explanation quality, not only marks.</li></ol></div><div className="panel"><h2>Recent drops</h2>{recent.length?<div className="recent">{recent.map(x=><div key={x.id}><span>{SUBJECTS.find(s=>s.id===x.subject)?.icon} {SUBJECTS.find(s=>s.id===x.subject)?.name}</span><b>{pct(x.score,x.total)}%</b><small>+{x.xp} XP</small></div>)}</div>:<p className="muted">No quests completed yet.</p>}</div></div>
 <div className="syncNote">{supabaseConfigured()? '☁️ Cross-device sync is configured.':'💾 Local mode is active. Add Supabase environment variables to sync between laptops.'}</div>
 </main></div>
}

function supabaseConfigured(){return !!(SUPABASE_URL&&SUPABASE_KEY)}

createRoot(document.getElementById('root')).render(<App/>);

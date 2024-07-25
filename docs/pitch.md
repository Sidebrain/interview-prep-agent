# Pitch Deck 

## Outline

### What is the problem 
It is hard for candidates to put their best foot forwrd in interviews 
- problem pronounced for industries that are not leetcode type with objective right or wrong
- It is hard to figure out the questions that will be asked 
- It is hard to find people who are willing to mentor / guide you 
- It is hard to (and embarassing) to ask for help (prepare for interviews, conduct mock interviews, and so forth)
- It is hard to repeat an ask (multiple interviews, etc) 
- It is hard to know why you didnt convert an interview or why you didnt make the shortlist 
- It is hard to know where you stand
- It is hard to know how to get better 

The result is that the period before and during interviews is nerve racking, confusing and opaque 

### The solution
An AI agent to help conduct interviews and give you critical feedback so you know the areas you are lacking and need to improve on 

### Features
- Build your own highly customized interviews 
    - tell the AI what company, team and role you are applying for, it will configure itself to give you feedback 
- A custom rating rubric will be developed that is used to rate / critique you 
    - you will get turn by turn feedback as well as consolidated feedback at the end of the interview
- Take as many interviews as you want, and see how you improve over time 
- Not a dumb questionnaire, it features a sophisticated agent architecture that makes the conversation dynamic 
    - can tell when you are exaggerating, being vague and press you for details 
    - Can tell when you act like you know but you may not know 
    - can sense when you are becoming curt or rude, and modify itself to respond to the unproffessionalism 
- Can help point out areas to focus on 

### Why this is helpful
- Zero embarassment learning, you can ask for help as many times as you want
- Upload the job description and your resume, it will start suggesting experiences to talk about in actual interviews
- Get rid of your nerves, so on the day of the actual interview you put your best foot forward, with confidence 
- Use it to prepare for an immediately upcoming interview, or use it to navigate to the ambitious job that you see 

### The Architecture
A recursive architecture of AI agents 
Global commander agent, who creates sub-agents 
Interviwer agent and a candidate agent 
Both can be either AI or human, both can reflect on their actions, and critique the other 
They also have an internal flow analyzer to manage the flow of the conversation 
Both the interviewer and the candidate can either be AI or human 

### Product Categories this unlocks 
1. AI interviewer - AI candidate
    Learn --> Watch a simulated interview between two experts (both AI)
2. AI Interviewer - Human Candidate 
    Improve --> Improve your interview skills, get feedback, improve diction, etc 
    Hire --> Source candidates, do your first round shortlist, a recruiter who is constantly vetting candidates 
3. Human Interviewer - AI Candidate 
    Learn how to interview. Useful for interviewers to learn how to ask the right questions, and become better interviewers
4. Human Interviewer - Human Candidate 
    Interview copilot. Takes notes while you interview, and provides you feedback on what questions/areas to probe deeper on. Map like real time navigation for inteviews

### Ancillary use cases unlocked 
- Help draft the job requirements 
- Have a recruiter who is out there looking for your perfect candidate across the globe, day and night, across languages 

### Level 0 Focus 
- Help candidates with mock interviews
- Help SMEs / high volume recruiters save time and money with recruiting

### Why now?
Building a mock interview agent was not something that scaled, you would need domain experts for each industry to even launch a category 
AI contains two latent capabilities that makes this entire scheme possible:
- It has embedded in its weights, most human generated knowledge, including interview data, criteria for filtering etc. With the right prompt all that data is readily available 
- A general reasoning agent. With this you dont need to train it to critique every type of interview, tell it the qualities of a good interviewer and the qualities of a good candidate, and it is able to join the dots 

### From Mock interviews to touching on an industry ripe for disruption 
HR, specifically recruiting is still stuck in the 80s. Processes have not changed
Hiring a candidate is time consuming for the founder (if its a small company) and for the HR team in a mid to large company.
This is reflected in the pricing - comparable AI tools charge 150$ for 4 interview sessions, to companies like HireVue who supposedly use AI to source candidates and charge $15000 for 2 candidates. Non Negotiable pricing. 
It is rare for candidates to get feedback on their interviews, they are flying blind. Unfair to blame companies because everybody is running short on time

### We are bringing recruiting into the modern age 

### We start off as an AI engineering company, but secretly we are a deep learning company 

### WHat is our moat 
- Self designing AI Agents, you can set the recursive depth and the appropriate amount of complexity will present itself 
- RLHF - we will be bringing in recruiters with domain expertise to critique our critique, this will build a reward model and an system that keeps getting smarter 
- Synthetic data, high / low / mid quality interviews that will be used as input to build our own neural nets 

### What is our advantage 
- Transparent pricing 
- Interview for any role from day one (Practice, and actually interview) 
- Use your voice to talk about the qualities you are looking for, and craft the interviewer that best represents you 
- Create an interview agent and plug it into your recruiting pipeline

### About the Founder / Why
- I got lucky. I am grateful for it, but I never forget. Outside our immediate family branch, most are poor and lacking in opportunity. I often get calls asking for help in connecting them to some economic opportunity. I help where I can, but sadly most times I am unable to. I want to help these people, access opportunity. 
- I left a successful product management career in SF, to return to India and build my engineering skills and learn Artificial Intelligence from ground up. 
- I exited two companies, in the process learning hard won lessons, such as building a vitamin vs a painkiller, and tarpit ideas. 
- I live, breathe and think AI. Steve Jobs says the dots connect backwards. One of the earliest memories I have is of thinkng how thinking works. I was thinking meta cognitive frameworks as a child. I did it because it came naturally to me and I enjoyed breaking down thought. Many years later, when GPT3 launched i felt a deep resonance. Then the dots started connecting backward. What I was doing from when I was a child, is what gives me an unfair advantage in this space. Building in AI and especially agents is an application of the skill I was seeded with. 
- My first principles are physics, and biology is my deepest muse. 
- My goal is to build something that distributes opportunity. AI is the great intellectual equalizer, I want every human, irrespective of their circumstance, to be able to access and attain opportunity.


## Brain Dump
Making recruiting fun for candidates and organizations
Your recruiting on autopilot
Your hiring on autopilot
Get the job you want, 
navigate to the job you want
Learn from watching an interview play out 
provide feedback to every interview
Take the pain out of sourcing candidates 
Practice mock interviews (iceberg)
Recruit for any role, tell teh ai the company, the role and the team you are recruiting for and have the ai interview you, give you feedback and help you improve 

Can tell the story from an emotional, sequence of events, 

Helps reduce discrimination 
helps generate job descriptions
recursive architecture for agents - society of mind

Helping bridge the gap between opportunity and human
Increasing the efficiency of matching human to opportunity
Distributing opportunity 
Making opportunity accessible

High willingness to pay both on consumer and organization side
On the org side: helps save time, on the candidate side: helps increase earning - both are directly affecting painkiller parameters

Can integrate voice analysis to detect feelings, etc into the interview (Hume) 

About the founder
- learned from many vitamin products, this is a painkiller problem 


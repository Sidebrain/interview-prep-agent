# Mock Interview Agent

I am building out an interview agent. Here's a brief startup pitch:

## For who is this:
- Candidates who have an upcoming interview and want to practice mock interviewing
- Aspirational candidates who want to attain a certain position, or get admitted to a certain institution 

## How does this work
- You tell the agent what company, role, designation and team you are applying for. The agent uses its internal knowledgebase or finds information on the internet to build itself out with information about the following:
    - Description of the company
    - description of the team 
    - Rubric that the company uses to rate the interview (if available, eg: Amazon's leaderhsip principles) 
        - If it cannot find the rubric, it has an internal rubric. THis rubric is built upon input from various experienced recruiters. 
- Then the interviewer conducts the interview. The interview medium will be rolled out as follows:
    - Typing (current)
    - Voice
    - Video 
- Once the interview is complete you get a detailed feedback of your performance and what you need to do to improve

## Why now
Well AI. Specifically: 
- Its internal knowledge base which is all of the internet
- ability to reason 
- Ability to be supplied with external knowledge and have that be used to reason

## Architecture

### Framwork
I am building my own framework, primarily because I want to retain every degree of freedom. Using a framework curtails your degrees of freedom.  
- I looked into all the existing frameworks and libraries including `Autogen`, `Llamaindex` and `CrewAI` and decided to build my own. 
- This field is still fairly nascent and learning an abstraction rather than the source felt unecessary, and like I was stepping away from the source. 
- Building my own framework has two advantages, in building you understand the source much more deeply and you gain infintely more flexiblity. You build how your brain thinks, rather than how the framework wants you to implement. 

### Game Design x AI Agents
I am leveraging game design principles to build out the agents. In a separate project I worked on a text to animation engine using a game engine as the staging environment and I was blown away. Game design is the closest connection that code has to reality in its architecture. 

### Websockets all around
First time implementing websockets, but I think they are going to be key.

### Schema Design
- This is hughly dynamic, but if you want to see how I am thinking through this checkout `docs/uml/*`. Extensive iterations of schema are in there. You will start getting an idea of how I am thinking. 

### Experience based decisions
- In the early stages I am building without any database storage. I found that the second you introduce database you lock certain things down and if you are confident in your architecture that's great, but if you want to have a high level of flexibility in your objects and classes, you should not be hasty to bring a database into the mix. THat said, to ease the later database integration, make sure your classes have id's and you are following best practices you should be fine. 

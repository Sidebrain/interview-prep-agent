import asyncio
from app.agents.abstract_agent import Agent


async def test_agents():
    god = Agent(origin_timeline=None)
    canon_timeline = god.timeline
    agent1, agent2 = Agent(canon_timeline), Agent(canon_timeline)
    await asyncio.gather(agent1(), agent2())
    print("\n\n")
    print(canon_timeline.timeline)


if __name__ == "__main__":
    asyncio.run(test_agents())

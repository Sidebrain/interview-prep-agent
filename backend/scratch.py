import asyncio
from app.agents.abstract_agent import Agent


async def test_agents():
    god = Agent(origin_timeline=None, purpose_file_path=None)
    canon_timeline = god.timeline
    interviewer = Agent(
        origin_timeline=canon_timeline,
        purpose_file_path="docs/agent_config/interviewer.md",
        max_iterations=5,
    )
    candidate = Agent(
        origin_timeline=canon_timeline,
        purpose_file_path="docs/agent_config/candidate.md",
        max_iterations=5,
    )
    await interviewer.receive_notification()
    # await asyncio.gather(interviewer(), candidate())
    # print("\n\n")
    print(canon_timeline.timestream)


if __name__ == "__main__":
    asyncio.run(test_agents())

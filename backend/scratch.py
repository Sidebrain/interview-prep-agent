from app.agents.abstract_agent import Agent


if __name__ == "__main__":
    god = Agent(origin_timeline=None)
    canon_timeline = god.timeline
    agent1, agent2 = Agent(canon_timeline), Agent(canon_timeline)
    print(agent1(), agent2())
    print("\n\n")
    print(canon_timeline.timeline)

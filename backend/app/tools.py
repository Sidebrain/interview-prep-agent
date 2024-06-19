
from abc import ABC, abstractmethod


class Tool(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def use(self):
        pass


class InterviewRater(Tool):
    def __init__(self):
        pass

    def use(self):
        return "InterviewRater is being used"
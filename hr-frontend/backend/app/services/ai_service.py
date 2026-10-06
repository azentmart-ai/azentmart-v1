from ..ai.agent import answer


def get_answer(message: str) -> str:
    return answer(message)

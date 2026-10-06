from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..ai.agent import answer
from ..database import get_db
from ..dependencies import current_user
from ..schemas import ChatIn

router = APIRouter(prefix="/ai-agent", tags=["AI HR Agent"])

@router.post("/chat")
def chat(payload: ChatIn, db: Session = Depends(get_db), user=Depends(current_user)):
    return answer(payload.message, db, user)

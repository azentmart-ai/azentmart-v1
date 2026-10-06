from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import current_user
from ..models import Ticket
from ..schemas import TicketIn
from ..mcp.registry import employee_lookup,policy_search,employee_context,tool_catalog
router=APIRouter(prefix='/mcp',tags=['MCP Tools'])
@router.get('/tools')
def tools(user=Depends(current_user)):return {"tools":tool_catalog()}
@router.get('/employee-lookup')
def lookup(employee_id:int|None=None,query:str|None=None,db:Session=Depends(get_db),user=Depends(current_user)):return {"results":employee_lookup(db,user,employee_id,query)}
@router.get('/policy-search')
def policy(query:str,db:Session=Depends(get_db),user=Depends(current_user)):return {"results":policy_search(db,user,query)}
@router.get('/employee-context/{employee_id}')
def context(employee_id:int,db:Session=Depends(get_db),user=Depends(current_user)):
    result=employee_context(db,user,employee_id)
    if result is None:return {"error":"Employee not found or not permitted"}
    return result
@router.post('/create-support-ticket')
def create_ticket(payload:TicketIn,db:Session=Depends(get_db),user=Depends(current_user)):
    t=Ticket(user_id=user.id,**payload.model_dump());db.add(t);db.commit();db.refresh(t);return {"id":t.id,"status":t.status}

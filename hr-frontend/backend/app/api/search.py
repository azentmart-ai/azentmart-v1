from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import current_user, is_hr
from ..models import Document, Employee, Policy, Leave, Attendance, Payroll, Ticket, Onboarding
router=APIRouter(prefix="/search",tags=["Search"])
@router.get("")
def search(q:str=Query(min_length=2,max_length=120),db:Session=Depends(get_db),user=Depends(current_user)):
    term=f"%{q}%";results=[]
    eq=db.query(Employee)
    if not is_hr(user): eq=eq.filter(Employee.user_id==user.id)
    for e in eq.filter((Employee.name.ilike(term))|(Employee.email.ilike(term))|(Employee.department.ilike(term))|(Employee.designation.ilike(term))).limit(8): results.append({"id":e.id,"type":"employee","title":e.name,"subtitle":f"{e.email} · {e.department or 'Employee'}","url":f"/employees/{e.id}"})
    for d in db.query(Document).filter((Document.title.ilike(term))|(Document.description.ilike(term))).limit(5): results.append({"id":d.id,"type":"document","title":d.title,"subtitle":d.category,"url":"/documents"})
    for p in db.query(Policy).filter((Policy.title.ilike(term))|(Policy.description.ilike(term))).limit(5): results.append({"id":p.id,"type":"policy","title":p.title,"subtitle":f"Policy · v{p.version}","url":"/policies"})
    if is_hr(user):
        for l in db.query(Leave).filter((Leave.leave_type.ilike(term))|(Leave.reason.ilike(term))|(Leave.status.ilike(term))).limit(5): results.append({"id":l.id,"type":"leave","title":f"Leave request #{l.id}","subtitle":f"{l.leave_type} · {l.status}","url":"/leave"})
        for p in db.query(Payroll).filter((Payroll.month.ilike(term))|(Payroll.status.ilike(term))).limit(5): results.append({"id":p.id,"type":"payroll","title":f"Payroll {p.month}","subtitle":p.status,"url":"/payroll"})
    for t in db.query(Ticket).filter(Ticket.user_id==user.id if not is_hr(user) else True).filter((Ticket.subject.ilike(term))|(Ticket.description.ilike(term))|(Ticket.status.ilike(term))).limit(5): results.append({"id":t.id,"type":"ticket","title":t.subject,"subtitle":f"Ticket · {t.status}","url":"/support/tickets"})
    return {"results":results[:30]}
